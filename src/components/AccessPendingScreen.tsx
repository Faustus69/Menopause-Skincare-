/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  ExternalLink, 
  Mail,
  ShieldCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { logout, resendVerificationEmail } from '../firebase';

interface RefreshResult {
  emailVerified: boolean;
  isPaid: boolean;
  email: string | null;
  timestamp: string;
}

interface AccessPendingScreenProps {
  user: User;
  onRefreshStatus?: () => Promise<RefreshResult | null>;
}

export default function AccessPendingScreen({ 
  user,
  onRefreshStatus
}: AccessPendingScreenProps) {
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  // Trigger silent refresh once on initial mount only
  const hasCheckedMount = React.useRef(false);
  React.useEffect(() => {
    if (onRefreshStatus && !user.emailVerified && !hasCheckedMount.current) {
      hasCheckedMount.current = true;
      onRefreshStatus().catch(() => {});
    }
  }, [onRefreshStatus, user.emailVerified]);

  const handleResend = async () => {
    try {
      setResendingEmail(true);
      setEmailNotice(null);
      await resendVerificationEmail(user);
      setEmailNotice('A fresh verification link has been sent to your email.');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('too-many-requests')) {
        setEmailNotice('A verification email was recently dispatched. Please check your inbox or wait a moment.');
      } else {
        setEmailNotice('Could not send verification email: ' + (err?.message || 'Please try again later.'));
      }
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col min-h-full w-full bg-[#F9F7F3] text-[#1A2622] relative overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 box-border select-none"
    >
      {/* Decorative watercolor blobs (fully constrained to avoid mobile overflow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] max-w-[200px] h-[50vw] max-h-[200px] rounded-full bg-[#E2C7C1] opacity-25 blur-[50px] pointer-events-none"></div>
      <div className="absolute top-[35%] right-[-10%] w-[40vw] max-w-[180px] h-[40vw] max-h-[180px] rounded-full bg-[#C9D6C3] opacity-30 blur-[50px] pointer-events-none"></div>

      <div className="w-full max-w-[460px] mx-auto flex-1 flex flex-col justify-center relative z-10 box-border">

        {/* Brand Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#D1DEC8] mb-2 sm:mb-3 shadow-2xs">
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75] text-[#4A5D48]" />
          </div>
          <h1 className="font-serif text-[24px] sm:text-[28px] font-medium tracking-tight text-[#1A2622] leading-tight">
            The Menopause<br />Skincare Decoder
          </h1>
          <p className="font-serif italic text-[15px] sm:text-[16px] text-[#CD8B80] mt-1">
            WiseBloom Customer Access
          </p>
        </div>

        {/* Status Card */}
        <div className="w-full bg-[#F6F4EE] border border-[#EBE7DF] rounded-2xl sm:rounded-[24px] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center relative overflow-hidden box-border">
          
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E2C7C1]/40 mx-auto flex items-center justify-center text-[#CD8B80] mb-2.5">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
          </div>

          <div className="inline-block bg-[#E9EFE6] text-[#4A5D48] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full mb-2 max-w-full truncate">
            Purchase Required
          </div>

          <h2 className="font-serif text-lg sm:text-xl font-medium text-[#1A2622] mb-1">
            Account Status
          </h2>

          <p className="text-xs text-[#556953] leading-relaxed mb-3.5 break-words">
            Logged in as <span className="text-[#1A2622] font-semibold break-all inline-block">{user.email}</span>.
          </p>

          {/* Email Verification Card */}
          <div className="p-3 rounded-xl bg-white border border-[#E0DBCF] text-left text-xs mb-3.5 w-full overflow-hidden box-border">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="font-semibold text-[#1A2622] flex items-center gap-1.5 shrink-0 text-xs">
                <Mail className="w-3.5 h-3.5 text-[#556953]" />
                Email Status
              </span>
              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-700 font-bold shrink-0 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] text-amber-700 font-semibold shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Pending Verification
                </span>
              )}
            </div>

            {user.emailVerified ? (
              <p className="text-[11px] text-emerald-800 leading-snug mt-1">
                Your email address has been verified. Complete your purchase below to activate your lifetime access.
              </p>
            ) : (
              <div className="mt-2 pt-2 border-t border-[#F0ECE2] flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-[11px] text-[#6D8A68]">Need a new link?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendingEmail}
                  className="text-[11px] font-semibold text-[#CD8B80] hover:text-[#B66F64] cursor-pointer underline underline-offset-2 shrink-0 disabled:opacity-50"
                >
                  {resendingEmail ? 'Sending...' : 'Resend Link'}
                </button>
              </div>
            )}

            {emailNotice && (
              <p className="mt-2 text-[11px] text-[#556953] leading-snug bg-[#F9F7F3] p-2 rounded-lg border border-[#EBE7DF]">
                {emailNotice}
              </p>
            )}
          </div>

          {/* Access Step Information */}
          <div className="p-3 rounded-xl bg-[#EBF1E8] border border-[#CFDCC9] text-left text-xs mb-3.5 w-full overflow-hidden box-border">
            <div className="flex items-center gap-1.5 font-semibold text-[#2F442E] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4A5D48] shrink-0" />
              <span>Full App Access</span>
            </div>
            <p className="text-[11px] text-[#2F442E]/90 leading-relaxed">
              Access to the Barrier Profiler, Ingredient A–Z Decoder, and Routine Builder unlocks automatically for verified purchasers.
            </p>
          </div>

          {/* Primary Action Button: Link to WiseBloom */}
          <div className="w-full">
            <a
              href="https://wisebloom.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#67795E] hover:bg-[#5A6A52] text-white py-3.5 px-4 rounded-xl font-medium text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <span>Unlock Access on WiseBloom</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          {/* Sign Out */}
          <div className="mt-3.5 pt-3 border-t border-[#EBE7DF]">
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center justify-center max-w-full gap-1.5 text-xs text-[#556953] hover:text-[#1A2622] font-semibold py-1 px-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[200px]">Sign Out ({user.email})</span>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-[#556953]/80">
          <p>WiseBloom &bull; The Menopause Skincare Decoder</p>
        </div>

      </div>
    </motion.div>
  );
}
