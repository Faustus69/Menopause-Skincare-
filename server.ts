/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INGREDIENTS_DATA } from './src/data';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Use JSON parsing with a 10MB limit to handle base64 image payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyC93uR120iFE0y2dGGm0I6Tp8vu8ORyu9o';
  const OWNER_UID = 'hCN44TadBZMVJC5mzKspDFWNYYL2';
  const OWNER_EMAIL = 'needthis2027@gmail.com';
  const GUEST_EMAIL = process.env.GUEST_EMAIL || 'guest@wisebloom.co.uk';

  function isOwnerUser(user: { uid?: string; email?: string | null; emailVerified?: boolean } | null | undefined): boolean {
    if (!user) return false;
    // Primary secure identity authority: verified Firebase User ID
    if (user.uid === OWNER_UID) return true;
    // Secondary check: email if verified
    if (user.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase() && user.emailVerified === true) {
      return true;
    }
    return false;
  }

  function isGuestUser(user: { uid?: string; email?: string | null } | null | undefined): boolean {
    if (!user) return false;
    if (user.email && user.email.toLowerCase() === GUEST_EMAIL.toLowerCase()) return true;
    return false;
  }

  const FIREBASE_PROJECT_ID = 'gen-lang-client-0969934764';
  const FIRESTORE_DB_ID = 'ai-studio-themenopauseskin-fd8161d9-500d-4851-a59b-0a400cee5175';
  const LIVE_APP_URL = 'https://app.wisebloom.co.uk';
  const GUEST_PASS_COOKIE = 'wb_guest_pass';
  const GUEST_PASS_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  const STATE_FILE_PATH = path.join(process.cwd(), '.runtime', 'guest-invite.json');

  interface GuestInviteState {
    activeToken: string | null;
    activeTokenHash: string | null;
    version: number;
    revokedHashes: string[];
    hmacSecret?: string;
    updatedAt: string | null;
  }

  function loadInviteState(): GuestInviteState {
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        const raw = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          activeToken: typeof parsed.activeToken === 'string' ? parsed.activeToken : null,
          activeTokenHash: typeof parsed.activeTokenHash === 'string' ? parsed.activeTokenHash : null,
          version: typeof parsed.version === 'number' ? parsed.version : 0,
          revokedHashes: Array.isArray(parsed.revokedHashes) ? parsed.revokedHashes.slice(-100) : [],
          hmacSecret: typeof parsed.hmacSecret === 'string' ? parsed.hmacSecret : undefined,
          updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null
        };
      }
    } catch (err) {
      console.warn('Notice reading guest invite state:', err);
    }
    return {
      activeToken: null,
      activeTokenHash: null,
      version: 0,
      revokedHashes: [],
      updatedAt: null
    };
  }

  function saveInviteState(state: GuestInviteState) {
    try {
      const dir = path.dirname(STATE_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2), { encoding: 'utf-8', mode: 0o600 });
    } catch (err) {
      console.warn('Notice saving guest invite state:', err);
    }
  }

  let inviteState: GuestInviteState = loadInviteState();
  const inviteStatusCache = new Map<string, { active: boolean; expiresAt: number }>();

  function sha256Hex(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  function getGuestSigningSecret(): string {
    if (process.env.GUEST_SIGNING_SECRET) {
      return process.env.GUEST_SIGNING_SECRET;
    }
    if (process.env.GEMINI_API_KEY) {
      return crypto
        .createHmac('sha256', process.env.GEMINI_API_KEY)
        .update('wisebloom-guest-pass-signing-v1')
        .digest('hex');
    }
    if (!inviteState.hmacSecret) {
      inviteState.hmacSecret = crypto.randomBytes(32).toString('hex');
      saveInviteState(inviteState);
    }
    return inviteState.hmacSecret;
  }

  interface GuestPassPayload {
    uid: string;
    tokenHash: string;
    version: number;
    iat: number;
    exp: number;
  }

  function signGuestPass(payload: GuestPassPayload): string {
    const encoded = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
    const sig = crypto
      .createHmac('sha256', getGuestSigningSecret())
      .update(encoded)
      .digest('base64url');
    return `${encoded}.${sig}`;
  }

  function verifyGuestPassSignature(passToken: string | undefined, expectedUid: string): GuestPassPayload | null {
    if (!passToken || typeof passToken !== 'string') return null;
    const parts = passToken.split('.');
    if (parts.length !== 2) return null;
    const [encoded, providedSig] = parts;
    if (!encoded || !providedSig) return null;
    try {
      const expectedSig = crypto
        .createHmac('sha256', getGuestSigningSecret())
        .update(encoded)
        .digest('base64url');
      const a = Buffer.from(providedSig, 'utf-8');
      const b = Buffer.from(expectedSig, 'utf-8');
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return null;
      }
      const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as GuestPassPayload;
      if (
        !payload ||
        payload.uid !== expectedUid ||
        typeof payload.tokenHash !== 'string' ||
        typeof payload.exp !== 'number' ||
        Date.now() > payload.exp
      ) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  function parseCookies(cookieHeader: string | undefined): Record<string, string> {
    const result: Record<string, string> = {};
    if (!cookieHeader) return result;
    for (const part of cookieHeader.split(';')) {
      const idx = part.indexOf('=');
      if (idx === -1) continue;
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      if (key) {
        try {
          result[key] = decodeURIComponent(val);
        } catch {
          result[key] = val;
        }
      }
    }
    return result;
  }

  function extractGuestPassFromReq(req: express.Request): string | undefined {
    const headerPass = req.headers['x-guest-pass'];
    if (typeof headerPass === 'string' && headerPass.trim()) {
      return headerPass.trim();
    }
    const cookies = parseCookies(req.headers.cookie);
    return cookies[GUEST_PASS_COOKIE];
  }

  function setGuestPassCookie(req: express.Request, res: express.Response, passToken: string) {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const maxAgeSec = Math.floor(GUEST_PASS_TTL_MS / 1000);
    const parts = [
      `${GUEST_PASS_COOKIE}=${encodeURIComponent(passToken)}`,
      'HttpOnly',
      'Path=/',
      `Max-Age=${maxAgeSec}`,
      'SameSite=Lax'
    ];
    if (isHttps) {
      parts.push('Secure');
    }
    res.setHeader('Set-Cookie', parts.join('; '));
  }

  function clearGuestPassCookie(req: express.Request, res: express.Response) {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const parts = [
      `${GUEST_PASS_COOKIE}=`,
      'HttpOnly',
      'Path=/',
      'Max-Age=0',
      'SameSite=Lax'
    ];
    if (isHttps) {
      parts.push('Secure');
    }
    res.setHeader('Set-Cookie', parts.join('; '));
  }

  function getClientIp(req: express.Request): string {
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string' && xff.trim()) {
      return xff.split(',')[0].trim();
    }
    return req.socket?.remoteAddress || 'unknown';
  }

  // Rate limit stores
  const guestRedeemFailures = new Map<string, { count: number; resetAt: number }>();
  const inviteValidateChecks = new Map<string, { count: number; resetAt: number }>();
  const scanUsageByUid = new Map<string, { burstCount: number; burstResetAt: number; dailyCount: number; dailyResetAt: number }>();
  const guestScanUsageByIp = new Map<string, { dailyCount: number; dailyResetAt: number }>();

  const GUEST_SCAN_BURST_LIMIT = 5;
  const GUEST_SCAN_BURST_WINDOW_MS = 10 * 60 * 1000; // 10 mins
  const GUEST_SCAN_DAILY_LIMIT = 15;
  const GUEST_SCAN_IP_DAILY_LIMIT = 30;
  const STANDARD_SCAN_DAILY_LIMIT = 60;
  const DAY_MS = 24 * 60 * 60 * 1000;

  async function isInviteHashActive(tokenHash: string, bearerToken: string): Promise<boolean> {
    if (!tokenHash || !/^[a-f0-9]{64}$/.test(tokenHash)) return false;
    if (inviteState.revokedHashes.includes(tokenHash)) return false;
    if (inviteState.activeTokenHash && inviteState.activeTokenHash === tokenHash) return true;

    const cached = inviteStatusCache.get(tokenHash);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.active;
    }

    try {
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DB_ID}/documents/guest_invites/${tokenHash}`;
      const fsRes = await fetch(firestoreUrl, {
        headers: { Authorization: `Bearer ${bearerToken}` }
      });
      if (fsRes.ok) {
        const fsData = (await fsRes.json()) as any;
        const isActive = fsData?.fields?.active?.booleanValue === true;
        inviteStatusCache.set(tokenHash, { active: isActive, expiresAt: Date.now() + 60_000 });
        if (!isActive && !inviteState.revokedHashes.includes(tokenHash)) {
          inviteState.revokedHashes = [...inviteState.revokedHashes.slice(-99), tokenHash];
          saveInviteState(inviteState);
        }
        return isActive;
      }
    } catch {
      // Fallback to local state if Firestore rules are not yet deployed or unreachable
    }
    return false;
  }

  async function syncInviteToFirestore(
    ownerToken: string,
    newToken: string | null,
    newHash: string | null,
    previousHash: string | null,
    version: number
  ) {
    try {
      const writes: any[] = [];
      const basePath = `projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DB_ID}/documents`;

      if (previousHash) {
        writes.push({
          update: {
            name: `${basePath}/guest_invites/${previousHash}`,
            fields: {
              active: { booleanValue: false }
            }
          },
          updateMask: { fieldPaths: ['active'] },
          updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
          currentDocument: { exists: true }
        });
      }

      if (newHash) {
        writes.push({
          update: {
            name: `${basePath}/guest_invites/${newHash}`,
            fields: {
              active: { booleanValue: true },
              version: { integerValue: String(version) }
            }
          },
          updateTransforms: [
            { fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' },
            { fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }
          ],
          currentDocument: { exists: false }
        });
      }

      writes.push({
        update: {
          name: `${basePath}/app_config/guest_invite`,
          fields: {
            token: { stringValue: newToken || '' },
            tokenHash: { stringValue: newHash || '' },
            active: { booleanValue: Boolean(newToken) },
            version: { integerValue: String(version) }
          }
        },
        updateMask: { fieldPaths: ['token', 'tokenHash', 'active', 'version'] },
        updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }]
      });

      const commitUrl = `https://firestore.googleapis.com/v1/${basePath}:commit`;
      const res = await fetch(commitUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ownerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ writes })
      });
      if (!res.ok) {
        // If previousHash didn't exist in Firestore yet, retry without the previousHash update
        if (previousHash) {
          const fallbackWrites = writes.slice(1);
          await fetch(commitUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${ownerToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ writes: fallbackWrites })
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Firestore guest invite sync notice:', err);
    }
  }

  async function restoreInviteFromFirestoreIfMissing(ownerToken: string) {
    if (inviteState.activeToken || inviteState.version > 0) return;
    try {
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DB_ID}/documents/app_config/guest_invite`;
      const res = await fetch(firestoreUrl, {
        headers: { Authorization: `Bearer ${ownerToken}` }
      });
      if (res.ok) {
        const doc = (await res.json()) as any;
        const fields = doc?.fields;
        if (fields) {
          const active = fields.active?.booleanValue === true;
          const token = fields.token?.stringValue || '';
          const tokenHash = fields.tokenHash?.stringValue || '';
          const version = Number(fields.version?.integerValue || 0);
          if (version > 0 || token) {
            inviteState = {
              ...inviteState,
              activeToken: active && token ? token : null,
              activeTokenHash: active && tokenHash ? tokenHash : null,
              version,
              updatedAt: new Date().toISOString()
            };
            saveInviteState(inviteState);
          }
        }
      }
    } catch {
      // Ignore if Firestore rules not deployed yet
    }
  }

  async function verifyFirebaseToken(idToken: string | undefined) {
    if (!idToken) return null;
    try {
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json() as any;
      if (data.users && data.users.length > 0) {
        const u = data.users[0];
        const uid = u.localId;
        const email = u.email;
        const emailVerified = u.emailVerified === true;
        const isAnonymous = !email && (!Array.isArray(u.providerUserInfo) || u.providerUserInfo.length === 0);
        const isOwner = isOwnerUser({ uid, email, emailVerified });
        const isGuest = isGuestUser({ uid, email });
        return {
          uid,
          email,
          emailVerified,
          isAnonymous,
          isOwner,
          isGuest
        };
      }
      return null;
    } catch (err) {
      console.error('Server token verification failed:', err);
      return null;
    }
  }

  async function resolveUserAccess(
    req: express.Request,
    token: string,
    user: NonNullable<Awaited<ReturnType<typeof verifyFirebaseToken>>>
  ) {
    let isInvitedGuest = false;
    let isPaid = user.isOwner || user.isGuest;

    if (!isPaid) {
      const guestPassToken = extractGuestPassFromReq(req);
      const parsedPass = verifyGuestPassSignature(guestPassToken, user.uid);
      if (parsedPass) {
        const stillActive = await isInviteHashActive(parsedPass.tokenHash, token);
        if (stillActive) {
          isInvitedGuest = true;
          isPaid = true;
        }
      }
    }

    if (!isPaid && !user.isAnonymous) {
      try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DB_ID}/documents/users/${user.uid}`;
        const fsRes = await fetch(firestoreUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const fsData = await fsRes.json() as any;
        isPaid = fsData?.fields?.isPaid?.booleanValue === true;
      } catch {
        isPaid = false;
      }
    }

    return {
      isPaid,
      isInvitedGuest,
      isGuest: user.isGuest || isInvitedGuest
    };
  }

  // Session verification endpoint for verified client access
  app.get('/api/auth/verify-session', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) {
        return res.status(401).json({ authenticated: false, error: 'No token provided' });
      }
      const user = await verifyFirebaseToken(token);
      if (!user) {
        return res.status(401).json({ authenticated: false, error: 'Invalid or expired token' });
      }

      const access = await resolveUserAccess(req, token, user);

      return res.json({
        authenticated: true,
        user: {
          uid: user.uid,
          email: user.email || null,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          isOwner: user.isOwner,
          isGuest: access.isGuest,
          isInvitedGuest: access.isInvitedGuest,
          isPaid: access.isPaid
        }
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Server verification failed' });
    }
  });

  // Owner-only: Get current private guest invitation link (creates first link automatically if never initialized)
  app.get('/api/admin/guest-invite', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const user = await verifyFirebaseToken(token || undefined);
      if (!user || !user.isOwner || !token) {
        return res.status(403).json({ error: 'Unauthorized: Owner access required.' });
      }

      await restoreInviteFromFirestoreIfMissing(token);

      if (!inviteState.activeToken && inviteState.version === 0) {
        const newToken = crypto.randomBytes(24).toString('base64url');
        const newHash = sha256Hex(newToken);
        const nowIso = new Date().toISOString();
        inviteState = {
          ...inviteState,
          activeToken: newToken,
          activeTokenHash: newHash,
          version: 1,
          updatedAt: nowIso
        };
        saveInviteState(inviteState);
        inviteStatusCache.set(newHash, { active: true, expiresAt: Date.now() + 60_000 });
        await syncInviteToFirestore(token, newToken, newHash, null, 1);
      }

      return res.json({
        active: Boolean(inviteState.activeToken),
        inviteToken: inviteState.activeToken,
        inviteUrl: inviteState.activeToken ? `${LIVE_APP_URL}/?invite=${inviteState.activeToken}` : null,
        version: inviteState.version,
        updatedAt: inviteState.updatedAt
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to load guest invitation status.' });
    }
  });

  // Owner-only: Generate/Replace the private guest invitation link (immediately revokes the old link)
  app.post('/api/admin/guest-invite/rotate', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const user = await verifyFirebaseToken(token || undefined);
      if (!user || !user.isOwner || !token) {
        return res.status(403).json({ error: 'Unauthorized: Owner access required.' });
      }

      const previousHash = inviteState.activeTokenHash;
      if (previousHash) {
        inviteState.revokedHashes = [...inviteState.revokedHashes.slice(-99), previousHash];
        inviteStatusCache.set(previousHash, { active: false, expiresAt: Date.now() + 60_000 });
      }

      const newToken = crypto.randomBytes(24).toString('base64url');
      const newHash = sha256Hex(newToken);
      const nextVersion = (inviteState.version || 0) + 1;
      const nowIso = new Date().toISOString();

      inviteState = {
        ...inviteState,
        activeToken: newToken,
        activeTokenHash: newHash,
        version: nextVersion,
        updatedAt: nowIso
      };
      saveInviteState(inviteState);
      inviteStatusCache.set(newHash, { active: true, expiresAt: Date.now() + 60_000 });
      await syncInviteToFirestore(token, newToken, newHash, previousHash, nextVersion);

      return res.json({
        active: true,
        inviteToken: newToken,
        inviteUrl: `${LIVE_APP_URL}/?invite=${newToken}`,
        version: nextVersion,
        updatedAt: nowIso
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to replace guest invitation link.' });
    }
  });

  // Owner-only: Revoke the active guest invitation link without creating a new one
  app.post('/api/admin/guest-invite/revoke', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const user = await verifyFirebaseToken(token || undefined);
      if (!user || !user.isOwner || !token) {
        return res.status(403).json({ error: 'Unauthorized: Owner access required.' });
      }

      const previousHash = inviteState.activeTokenHash;
      if (previousHash) {
        inviteState.revokedHashes = [...inviteState.revokedHashes.slice(-99), previousHash];
        inviteStatusCache.set(previousHash, { active: false, expiresAt: Date.now() + 60_000 });
      }

      const nextVersion = Math.max(1, inviteState.version || 1);
      const nowIso = new Date().toISOString();
      inviteState = {
        ...inviteState,
        activeToken: null,
        activeTokenHash: null,
        version: nextVersion,
        updatedAt: nowIso
      };
      saveInviteState(inviteState);
      await syncInviteToFirestore(token, null, null, previousHash, nextVersion);

      return res.json({
        active: false,
        inviteToken: null,
        inviteUrl: null,
        version: nextVersion,
        updatedAt: nowIso
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to revoke guest invitation link.' });
    }
  });

  // Pre-check whether an invite token is active (used only when switching from an unpaid signed-in account)
  app.post('/api/guest/validate-invite', async (req, res) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const rec = inviteValidateChecks.get(ip);
    if (rec && rec.resetAt > now && rec.count >= 20) {
      return res.status(429).json({ valid: false, error: 'Too many invitation checks. Please wait a moment.' });
    }
    inviteValidateChecks.set(ip, {
      count: rec && rec.resetAt > now ? rec.count + 1 : 1,
      resetAt: rec && rec.resetAt > now ? rec.resetAt : now + 15 * 60 * 1000
    });

    const inviteToken = typeof req.body?.inviteToken === 'string' ? req.body.inviteToken.trim() : '';
    if (!inviteToken || inviteToken.length > 200) {
      return res.json({ valid: false });
    }
    const tokenHash = sha256Hex(inviteToken);
    if (inviteState.revokedHashes.includes(tokenHash)) {
      return res.json({ valid: false });
    }
    if (inviteState.activeTokenHash && inviteState.activeTokenHash === tokenHash) {
      return res.json({ valid: true });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
      const caller = await verifyFirebaseToken(token);
      if (caller) {
        const activeInFirestore = await isInviteHashActive(tokenHash, token);
        return res.json({ valid: activeInFirestore });
      }
    }

    return res.json({ valid: false });
  });

  // Redeem a private guest invitation link using the friend's Firebase Anonymous Auth token
  app.post('/api/guest/redeem', async (req, res) => {
    try {
      const ip = getClientIp(req);
      const now = Date.now();
      const failureRec = guestRedeemFailures.get(ip);
      if (failureRec && failureRec.resetAt > now && failureRec.count >= 10) {
        return res.status(429).json({
          error: 'Too many invalid invitation attempts. Please wait 15 minutes before trying again.'
        });
      }

      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const user = await verifyFirebaseToken(token || undefined);
      if (!user || !token) {
        return res.status(401).json({ error: 'A valid session is required to redeem an invitation.' });
      }

      const inviteToken = typeof req.body?.inviteToken === 'string' ? req.body.inviteToken.trim() : '';
      if (!inviteToken || inviteToken.length > 200) {
        guestRedeemFailures.set(ip, {
          count: failureRec && failureRec.resetAt > now ? failureRec.count + 1 : 1,
          resetAt: failureRec && failureRec.resetAt > now ? failureRec.resetAt : now + 15 * 60 * 1000
        });
        return res.status(403).json({ error: 'This guest invitation link is invalid or incomplete.' });
      }

      const tokenHash = sha256Hex(inviteToken);
      const isValid = await isInviteHashActive(tokenHash, token);
      if (!isValid) {
        guestRedeemFailures.set(ip, {
          count: failureRec && failureRec.resetAt > now ? failureRec.count + 1 : 1,
          resetAt: failureRec && failureRec.resetAt > now ? failureRec.resetAt : now + 15 * 60 * 1000
        });
        return res.status(403).json({
          error: 'This guest invitation link has been revoked or is no longer active.'
        });
      }

      const passPayload: GuestPassPayload = {
        uid: user.uid,
        tokenHash,
        version: inviteState.version || 1,
        iat: now,
        exp: now + GUEST_PASS_TTL_MS
      };
      const guestPass = signGuestPass(passPayload);
      setGuestPassCookie(req, res, guestPass);

      return res.json({
        success: true,
        guestPass,
        user: {
          uid: user.uid,
          isAnonymous: user.isAnonymous,
          isGuest: true,
          isInvitedGuest: true,
          isPaid: true
        }
      });
    } catch (err: any) {
      console.error('Guest invite redeem error:', err);
      return res.status(500).json({ error: err?.message || 'Could not validate guest invitation.' });
    }
  });

  app.post('/api/guest/signout', (req, res) => {
    clearGuestPassCookie(req, res);
    return res.json({ success: true });
  });

  // Admin-only endpoint: Reset WiseBloom Guest Data (strictly owner verified)
  app.post('/api/admin/reset-guest-data', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const user = await verifyFirebaseToken(token);
      if (!user || !user.isOwner) {
        return res.status(403).json({ error: 'Unauthorized: Owner access required to reset guest data' });
      }

      // Locate guest user in Firebase Auth via Identity Toolkit lookup if UID not provided
      let guestUid: string | null = req.body?.guestUid || null;
      if (!guestUid) {
        try {
          const lookupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: [GUEST_EMAIL] })
          });
          const lookupData = await lookupRes.json() as any;
          if (lookupData.users && lookupData.users.length > 0) {
            guestUid = lookupData.users[0].localId;
          }
        } catch (lookupErr) {
          console.warn('Identity toolkit guest lookup notice:', lookupErr);
        }
      }

      const dbId = 'ai-studio-themenopauseskin-fd8161d9-500d-4851-a59b-0a400cee5175';
      const nowIso = new Date().toISOString();

      if (guestUid) {
        // Reset the guest user document in Firestore using the owner's Bearer token
        try {
          const firestoreUrl = `https://firestore.googleapis.com/v1/projects/gen-lang-client-0969934764/databases/${dbId}/documents/users/${guestUid}?updateMask.fieldPaths=barrierType&updateMask.fieldPaths=concerns&updateMask.fieldPaths=recommendedIngredients&updateMask.fieldPaths=favorites&updateMask.fieldPaths=routine&updateMask.fieldPaths=notes&updateMask.fieldPaths=scans&updateMask.fieldPaths=lastResetAt&updateMask.fieldPaths=updatedAt`;
          await fetch(firestoreUrl, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                barrierType: { nullValue: null },
                concerns: { arrayValue: { values: [] } },
                recommendedIngredients: { arrayValue: { values: [] } },
                favorites: { arrayValue: { values: [] } },
                routine: { mapValue: { fields: {} } },
                notes: { arrayValue: { values: [] } },
                scans: { arrayValue: { values: [] } },
                lastResetAt: { stringValue: nowIso },
                updatedAt: { timestampValue: nowIso }
              }
            })
          });
        } catch (patchErr) {
          console.warn('Firestore patch notice on guest reset:', patchErr);
        }
      }

      return res.json({
        success: true,
        message: 'Guest account data successfully reset.',
        guestUid,
        resetAt: nowIso
      });
    } catch (err: any) {
      console.error('Reset guest data error:', err);
      return res.status(500).json({ error: err?.message || 'Failed to reset guest data' });
    }
  });

  // API router endpoint: Analyze ingredient list from photo or text
  app.post('/api/analyze-ingredients', async (req, res) => {
    try {
      // Server-side identity verification: Ensure requester is authenticated
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const user = await verifyFirebaseToken(token || undefined);
      if (!user || !token) {
        return res.status(401).json({
          error: 'Authentication required. Please sign in to analyze ingredients.'
        });
      }

      // Server-side payment / invited-guest check:
      const access = await resolveUserAccess(req, token, user);
      if (!access.isPaid) {
        return res.status(403).json({
          error: 'Customer access required. Please purchase The Menopause Skincare Decoder or use an active guest invitation link to analyze ingredients.'
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your Secrets panel inside AI Studio Settings.'
        });
      }

      const { text, image, userProfile, routine } = req.body;

      if (!text && !image) {
        return res.status(400).json({
          error: 'Please provide either raw ingredients text or an image payload to analyze.'
        });
      }

      if (typeof text === 'string' && text.length > 15000) {
        return res.status(400).json({
          error: 'Ingredient list text is too long. Please keep pasted ingredient text under 15,000 characters.'
        });
      }

      if (typeof image === 'string' && image.length > 15 * 1024 * 1024) {
        return res.status(413).json({
          error: 'Image is too large. Please try a smaller image.'
        });
      }

      // Safeguards and rate limits for AI ingredient scans
      const now = Date.now();
      const uidRecord = scanUsageByUid.get(user.uid) || {
        burstCount: 0,
        burstResetAt: now + GUEST_SCAN_BURST_WINDOW_MS,
        dailyCount: 0,
        dailyResetAt: now + DAY_MS
      };
      if (uidRecord.burstResetAt <= now) {
        uidRecord.burstCount = 0;
        uidRecord.burstResetAt = now + GUEST_SCAN_BURST_WINDOW_MS;
      }
      if (uidRecord.dailyResetAt <= now) {
        uidRecord.dailyCount = 0;
        uidRecord.dailyResetAt = now + DAY_MS;
      }

      if (access.isGuest) {
        const ip = getClientIp(req);
        const ipRecord = guestScanUsageByIp.get(ip) || { dailyCount: 0, dailyResetAt: now + DAY_MS };
        if (ipRecord.dailyResetAt <= now) {
          ipRecord.dailyCount = 0;
          ipRecord.dailyResetAt = now + DAY_MS;
        }

        if (uidRecord.burstCount >= GUEST_SCAN_BURST_LIMIT) {
          const waitMins = Math.max(1, Math.ceil((uidRecord.burstResetAt - now) / 60000));
          return res.status(429).json({
            error: `Guest scan cooldown active (up to ${GUEST_SCAN_BURST_LIMIT} scans per 10 minutes). Please try again in about ${waitMins} minute${waitMins === 1 ? '' : 's'}.`
          });
        }
        if (uidRecord.dailyCount >= GUEST_SCAN_DAILY_LIMIT || ipRecord.dailyCount >= GUEST_SCAN_IP_DAILY_LIMIT) {
          return res.status(429).json({
            error: `You have reached the complimentary guest limit of ${GUEST_SCAN_DAILY_LIMIT} AI ingredient scans per 24 hours. All ingredient guides, barrier tools, and routine builders remain available.`
          });
        }

        uidRecord.burstCount += 1;
        uidRecord.dailyCount += 1;
        ipRecord.dailyCount += 1;
        scanUsageByUid.set(user.uid, uidRecord);
        guestScanUsageByIp.set(ip, ipRecord);
      } else {
        if (uidRecord.dailyCount >= STANDARD_SCAN_DAILY_LIMIT) {
          return res.status(429).json({
            error: 'Daily scan safety limit reached (60 scans per 24 hours). Please try again tomorrow.'
          });
        }
        uidRecord.dailyCount += 1;
        scanUsageByUid.set(user.uid, uidRecord);
      }

      // Initialize the Google GenAI client with correct headers for AI Studio environment
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Prepare a list of our database ingredients for Gemini context matching
      const knownIngredientsContext = INGREDIENTS_DATA.map((ing) => ({
        id: ing.id,
        name: ing.ingredient,
        role: ing.role || 'Barrier Repair',
        stage: ing.stage,
        suitabilityAMPM: ing.suitabilityAMPM || 'AM or PM',
        whatToKnow: ing.whatToKnow || ''
      }));

      const routineContext = routine && Object.keys(routine).length > 0
        ? Object.entries(routine).map(([ingId, slot]) => {
            const ing = INGREDIENTS_DATA.find((i) => i.id === ingId);
            return ing ? `${ing.ingredient} [Role: ${ing.role || 'Active'}, Stage: ${ing.stage}] (${String(slot).toUpperCase()} Routine)` : `${ingId} (${String(slot).toUpperCase()})`;
          }).join(', ')
        : 'None currently set';

      const profileContext = userProfile ? `
User Profile Context:
- Barrier Type: ${userProfile.barrierType || 'Unknown'} (Moisture-Impaired, Inflammation-Reactive, Lipid-Depleted, or Unknown)
- Current Concerns: ${userProfile.concerns?.join(', ') || 'None specified'}
- Saved / Recommended Ingredients: ${userProfile.recommendedIngredients?.join(', ') || 'None'}
- Existing Daily Routine: ${routineContext}
` : `Existing Daily Routine: ${routineContext}`;

      // Base assistant prompt strictly adopting the menopausal skin routine and ingredient-layering guidelines
      const textPrompt = `You are the Menopausal Skin Routine and Ingredient-Layering Assistant.
Your job is to create simple, safe AM/PM skincare layering guidance using only the ingredient information provided in the app’s ingredient database. Do not invent ingredient benefits, percentages, warnings, or product claims that are not supported by the database.

The app is designed for menopausal and perimenopausal skin, where the main priorities are barrier support, dryness, sensitivity, pigmentation, dullness, loss of firmness, fine lines, hormonal breakouts, and congestion.

${profileContext}

CORE RULES:
1. Always prioritise barrier comfort first, especially for menopausal skin.
2. Build routines by product role, not by random ingredient lists.
   Ingredient roles: Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, or Formulation Support.
3. Recommend a maximum of 3 core ingredients plus 1 treatment focus unless the user asks for more detail.
4. Keep advice short, practical, and easy to understand.
5. Do not say an ingredient is present at an effective percentage unless the product clearly states the percentage.
6. If ingredient strength is unknown, say “contains” or “look for,” not “this will deliver.”
7. Never diagnose skin conditions or promise medical results.
8. For severe acne, rosacea, eczema, melasma, sudden irritation, infection, swelling, or persistent symptoms, recommend advice from a qualified clinician.
9. If the user is pregnant, breastfeeding, trying to conceive, or unsure, avoid retinoids and advise checking with a clinician.

LAYERING SAFETY RULES:
- Do not recommend retinoids and exfoliating acids in the same routine for sensitive, dry, reactive, or menopausal barrier-impaired skin.
- Do not recommend multiple exfoliating acids in the same routine.
- Do not recommend strong acids with kojic acid for sensitive or reactive skin.
- Do not recommend strong vitamin C, acids, and retinoids together in one routine.
- If the user reports stinging, burning, new redness, peeling, or irritation, activate Recovery Mode.
  In Recovery Mode: pause retinoids, exfoliating acids, kojic acid, strong vitamin C, and aggressive breakout treatments.
  Recommend soothing and barrier ingredients only (Glycerin, Panthenol, Ceramides, Cholesterol, Fatty Acids, Squalane, Dimethicone, Petrolatum, Colloidal Oatmeal, Allantoin, Centella Asiatica, Madecassoside, low-strength Niacinamide if tolerated).
- Exfoliating acids should usually be suggested 1–3 nights weekly, not every night.
- Retinoids should usually start 1–2 nights weekly and increase only if tolerated.
- SPF is essential every morning, especially when using retinoids, acids, vitamin C, azelaic acid, tranexamic acid, alpha arbutin, kojic acid, or pigmentation-focused routines.

WHEN ANALYSING THIS SCANNED PRODUCT:
1. Identify product name/brand or use "Skincare Treatment".
2. Match detected ingredients against the Core Database (${knownIngredientsContext.length} ingredients).
   Assign each detected ingredient its role (Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, or Formulation Support).
3. Evaluate compatibility:
   - "Good Match": Product supports barrier health and matches user concerns without conflicting with current routine.
   - "Possible Match": Beneficial, but requires mindful placement or alternate-day scheduling.
   - "Use With Care": Contains ingredients that may irritate the user's barrier type or clash with their existing routine.
4. Recommend where the product fits in the routine: AM, PM, treatment step, moisturiser step, SPF step, occasional use (1–3 nights/week), or avoid for now.
5. Provide a practical Layering Tip.
6. Provide structured AM and PM suggested step sequences based on layering order:
   - Morning Routine (AM): 
     Step 1: Gentle Cleanse or water rinse
     Step 2: Hydrating / soothing water-based step (Glycerin, Panthenol, Hyaluronic Acid)
     Step 3: Antioxidant or brightening step (Vitamin C, Niacinamide)
     Step 4: Barrier moisturiser (Ceramides, Squalane)
     Step 5: Moisture seal / oil (only if needed on dry areas)
     Step 6: SPF (Broad Spectrum Sunscreen - essential final step)
   - Evening Protocol Sequence (PM) MUST ALWAYS CONTAIN ALL 5 STEPS in exact order:
     Step 1: Cleanse (Gentle thorough cleanse to remove SPF/makeup)
     Step 2: Hydrating / soothing step (Glycerin, Panthenol, Hyaluronic Acid)
     Step 3: One treatment active only (if calm) — place scanned product here if it is an active treatment/serum
     Step 4: Barrier Cream (Ceramides + Fatty Acids & Cholesterol) — essential to restore barrier lipids
     Step 5: Moisture Seal / Balm (Squalane, lipid oil, or barrier balm) — seals dry/tight areas overnight.
     NEVER return only 2 or 3 steps for the evening protocol. All 5 steps must be explicitly listed so the user sees the complete regimen.`;

      const contents: any[] = [];

      if (image) {
        // Parse base64 image data URL
        const regex = /^data:(image\/\w+);base64,(.+)$/;
        const matches = image.match(regex);
        if (matches) {
          const mimeType = matches[1];
          const data = matches[2];
          contents.push({
            inlineData: { mimeType, data }
          });
        } else {
          return res.status(400).json({ error: 'Invalid base64 image data URL format.' });
        }
      }

      contents.push({ text: textPrompt + (text ? `\n\nAnalyzable Raw Ingredient Text:\n${text}` : '') });

      // Call Gemini 3.5-flash model with a highly structured JSON response schema
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: {
                type: Type.STRING,
                description: "Brand name or product title, e.g. 'Olay Regenerist Serum' or 'Skincare Treatment'"
              },
              matchLevel: {
                type: Type.STRING,
                enum: ['Good Match', 'Possible Match', 'Use With Care'],
                description: "Compatibility classification for this user"
              },
              routinePlacement: {
                type: Type.STRING,
                description: "Recommended placement, e.g. 'AM Routine · Hydrate / Soothe step' or 'PM Routine · Treatment step (1–2 nights weekly)'"
              },
              overallSummary: {
                type: Type.STRING,
                description: "Warm, reassuring, practical cosmetic review using the specified tone and rules"
              },
              goodMatches: {
                type: Type.OBJECT,
                properties: {
                  ingredientNames: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Helpful ingredients detected" },
                  bestFor: { type: Type.STRING, description: "Short summary of benefits supported by database" }
                },
                required: ['ingredientNames', 'bestFor']
              },
              useWithCare: {
                type: Type.OBJECT,
                properties: {
                  ingredientNames: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Caution ingredients or potential conflicts" },
                  reason: { type: Type.STRING, description: "Gentle reason based on user's barrier type or existing routine" }
                },
                required: ['ingredientNames', 'reason']
              },
              layeringTip: {
                type: Type.STRING,
                description: "One simple, practical, relevant layering tip adhering to assistant guidelines"
              },
              isRecoveryModeRecommended: {
                type: Type.BOOLEAN,
                description: "True if user reports stinging, burning, or product is unsuitable for compromised barrier"
              },
              recoveryModeAdvice: {
                type: Type.STRING,
                description: "Recovery mode message if applicable"
              },
              ingredientsFound: {
                type: Type.ARRAY,
                description: "Array of detected skincare ingredients with role and database linkage",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING, description: "Ingredient role (Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, Formulation Support)" },
                    isMatchInDatabase: { type: Type.BOOLEAN },
                    matchedIngredientId: { type: Type.STRING },
                    percentage: { type: Type.STRING }
                  },
                  required: ['name', 'isMatchInDatabase']
                }
              },
              suggestedAMRoutine: {
                type: Type.ARRAY,
                description: "Step-by-step morning layering guide",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    stepName: { type: Type.STRING },
                    productOrActive: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'stepName', 'productOrActive', 'reason']
                }
              },
              suggestedPMRoutine: {
                type: Type.ARRAY,
                description: "Step-by-step evening layering guide",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    stepName: { type: Type.STRING },
                    productOrActive: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'stepName', 'productOrActive', 'reason']
                }
              }
            },
            required: [
              'productName',
              'matchLevel',
              'routinePlacement',
              'overallSummary',
              'goodMatches',
              'useWithCare',
              'layeringTip',
              'ingredientsFound',
              'suggestedAMRoutine',
              'suggestedPMRoutine'
            ]
          }
        }
      });

      const responseText = response.text || '{}';
      const analysisResult = JSON.parse(responseText.trim());

      // Ensure Evening Protocol Sequence ALWAYS contains all 5 steps:
      // 1. Cleanse, 2. Hydrating/Soothing, 3. One Treatment Active, 4. Barrier Cream (Ceramides + Fatty Acids), 5. Moisture Seal / Balm (Squalane etc.)
      if (!Array.isArray(analysisResult.suggestedPMRoutine) || analysisResult.suggestedPMRoutine.length < 4) {
        const existingSteps = Array.isArray(analysisResult.suggestedPMRoutine) ? analysisResult.suggestedPMRoutine : [];
        const activeStep = existingSteps.find((s: any) => 
          /active|treatment|serum|retin|acid|peptid/i.test(s.stepName || '') || 
          /active|treatment|serum|retin|acid|peptid/i.test(s.productOrActive || '')
        ) || existingSteps[1] || {
          stepNumber: 3,
          stepName: 'Target Active Treatment',
          productOrActive: analysisResult.productName || 'One treatment active only (if skin is calm)',
          reason: 'Introduce slowly 1–3 nights weekly to avoid sensitizing menopausal skin.'
        };

        analysisResult.suggestedPMRoutine = [
          {
            stepNumber: 1,
            stepName: 'Gentle Cleanse',
            productOrActive: 'Gentle hydrating or cream cleanser',
            reason: 'Removes daily impurities, pollutants, and SPF without disrupting barrier lipids.'
          },
          {
            stepNumber: 2,
            stepName: 'Hydrating / Soothing Step',
            productOrActive: 'Glycerin, Panthenol, or Hyaluronic Acid serum',
            reason: 'Water-based humectants replenish dermal hydration before applying treatment.'
          },
          {
            stepNumber: 3,
            stepName: activeStep.stepName || 'Target Active Treatment',
            productOrActive: activeStep.productOrActive || analysisResult.productName || 'One treatment active only',
            reason: activeStep.reason || 'Use maximum 1–3 nights weekly; avoid layering conflicting acids or retinoids.'
          },
          {
            stepNumber: 4,
            stepName: 'Barrier Cream',
            productOrActive: 'Ceramides + Fatty Acids & Cholesterol',
            reason: 'Essential physiological lipid replacement to seal the skin barrier and prevent trans-epidermal moisture loss.'
          },
          {
            stepNumber: 5,
            stepName: 'Moisture Seal / Balm',
            productOrActive: 'Squalane, lipid oil, or rich barrier balm',
            reason: 'Optional final occlusive layer to soothe dry or tight areas overnight.'
          }
        ];
      } else {
        // Verify Step 4 (Barrier Cream) and Step 5 (Moisture Seal / Balm) are explicitly present
        const hasBarrierCream = analysisResult.suggestedPMRoutine.some((s: any) => 
          /barrier|ceramide|fatty acid|moisturi/i.test(s.stepName + ' ' + s.productOrActive)
        );
        const hasMoistureSeal = analysisResult.suggestedPMRoutine.some((s: any) => 
          /seal|balm|squalane|oil|occlusive/i.test(s.stepName + ' ' + s.productOrActive)
        );

        if (!hasBarrierCream) {
          analysisResult.suggestedPMRoutine.splice(3, 0, {
            stepNumber: 4,
            stepName: 'Barrier Cream',
            productOrActive: 'Ceramides + Fatty Acids & Cholesterol',
            reason: 'Crucial for menopausal skin to replenish lipid architecture and fortify against moisture loss.'
          });
        }
        if (!hasMoistureSeal) {
          analysisResult.suggestedPMRoutine.push({
            stepNumber: analysisResult.suggestedPMRoutine.length + 1,
            stepName: 'Moisture Seal / Balm',
            productOrActive: 'Squalane, facial oil, or occlusive balm',
            reason: 'Final protective lipid seal for extra dry, sensitive, or flaky patches overnight.'
          });
        }
        // Re-number steps sequentially 1..N
        analysisResult.suggestedPMRoutine.forEach((step: any, idx: number) => {
          step.stepNumber = idx + 1;
        });
      }

      res.json({ success: true, result: analysisResult });
    } catch (error: any) {
      console.error('Ingredient analysis error:', error);
      res.status(500).json({
        error: error?.message || 'An error occurred during ingredient analysis. Please try again.'
      });
    }
  });

  // Setup Vite development server or production environment
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve SPA index.html for unknown routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Menopause Skincare Decoder server running at http://localhost:${PORT}`);
  });
}

startServer();
