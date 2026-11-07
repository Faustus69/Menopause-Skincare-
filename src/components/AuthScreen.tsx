/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  signInWithEmail, 
  registerWithEmail, 
  resetPassword, 
  signInWithGoogle, 
  getAuthErrorMessage 
} from '../firebase';

interface AuthScreenProps {
  onSuccess: () => void;
  onBackToWelcome?: () => void;
}

type AuthMode = 'signin' | 'register' | 'forgot_password';

export default function AuthScreen({ onSuccess, onBackToWelcome }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      onSuccess();
    } catch (err: any) {
      console.warn('Sign in notice:', err?.code || err?.message || err);
      setErrorMsg(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password);
      setSuccessMsg('Account created! A verification link has been sent to your email.');
      onSuccess();
    } catch (err: any) {
      console.warn('Registration notice:', err?.code || err?.message || err);
      setErrorMsg(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address to receive a reset link.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg(`We have sent a password reset link to ${email.trim()}. Please check your inbox and spam folder.`);
    } catch (err: any) {
      console.warn('Password reset notice:', err?.code || err?.message || err);
      setErrorMsg(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      console.warn('Google sign in notice:', err?.code || err?.message || err);
      setErrorMsg(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-full bg-[#F9F7F3] text-[#1A2622] relative overflow-hidden px-3.5 py-5 sm:px-4 sm:py-6"
    >
      {/* Decorative watercolor blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] max-w-[220px] h-[50vw] max-h-[220px] rounded-full bg-[#E2C7C1] opacity-25 blur-[70px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[45vw] max-w-[200px] h-[45vw] max-h-[200px] rounded-full bg-[#C9D6C3] opacity-35 blur-[70px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[60vw] max-w-[240px] h-[60vw] max-h-[240px] rounded-full bg-[#E2C7C1] opacity-20 blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-full sm:max-w-[380px] mx-auto flex-1 flex flex-col justify-center relative z-10">
        
        {/* Top Back Navigation if available */}
        {onBackToWelcome && (
          <div className="mb-3 sm:mb-4">
            <button
              onClick={onBackToWelcome}
              className="inline-flex items-center gap-1.5 text-xs text-[#556953] hover:text-[#1A2622] font-medium transition-colors cursor-pointer py-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        )}

        {/* Brand Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#D1DEC8] mb-2.5 sm:mb-3 shadow-xs">
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75] text-[#4A5D48]" />
          </div>
          <h1 className="font-serif text-[26px] sm:text-[30px] font-medium tracking-tight text-[#1A2622] leading-tight">
            The Menopause<br />Skincare Decoder
          </h1>
          <p className="font-serif italic text-[15px] sm:text-[17px] text-[#CD8B80] mt-1">
            Customer Account Access
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-[#F6F4EE] border border-[#EBE7DF] rounded-[22px] sm:rounded-[24px] p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative">
          
          {/* Tabs for Sign In vs Register (Hidden in Forgot Password mode) */}
          {mode !== 'forgot_password' && (
            <div className="flex bg-[#ECE8DF] p-1 rounded-full mb-5 select-none">
              <button
                type="button"
                onClick={() => { setMode('signin'); clearMessages(); }}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                  mode === 'signin' 
                    ? 'bg-white text-[#1A2622] shadow-xs' 
                    : 'text-[#6D8A68] hover:text-[#1A2622]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); clearMessages(); }}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-white text-[#1A2622] shadow-xs' 
                    : 'text-[#6D8A68] hover:text-[#1A2622]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Feedback Alerts */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col gap-2 leading-relaxed"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">
                    <span>{errorMsg}</span>
                  </div>
                </div>

                {(errorMsg.includes('Firebase Console') || errorMsg.includes('Email/Password')) && (
                  <div className="mt-1 pt-2 border-t border-amber-200/70 text-[11px] text-amber-800 space-y-1.5">
                    <p className="font-semibold text-amber-950">Quick One-Time Setup Step:</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-amber-900/90 pl-0.5">
                      <li>Open Firebase Console &gt; Authentication &gt; Sign-in method.</li>
                      <li>Click &ldquo;Email/Password&rdquo;, toggle to Enable, and click Save.</li>
                    </ol>
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href="https://console.firebase.google.com/project/gen-lang-client-0969934764/authentication/providers"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#556953] hover:underline"
                      >
                        <span>Open Firebase Console</span>
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{successMsg}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6D8A68] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#556953]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-white border border-[#DDD8CD] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#1A2622] placeholder-[#8A9586]/60 focus:outline-none focus:ring-2 focus:ring-[#67795E]/30 focus:border-[#67795E]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6D8A68]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot_password'); clearMessages(); }}
                    className="text-xs text-[#CD8B80] hover:text-[#B66F64] font-medium transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#556953]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-white border border-[#DDD8CD] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1A2622] placeholder-[#8A9586]/60 focus:outline-none focus:ring-2 focus:ring-[#67795E]/30 focus:border-[#67795E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#556953]/60 hover:text-[#1A2622] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#67795E] hover:bg-[#5A6A52] text-white py-3 px-4 rounded-xl font-medium text-sm tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0DBCF]"></div>
                </div>
                <span className="relative bg-[#F6F4EE] px-3 text-[11px] uppercase tracking-wider text-[#7C9075] font-semibold">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-[#FAF8F5] border border-[#DDD8CD] text-[#1A2622] py-2.5 px-4 rounded-xl font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </form>
          )}

          {/* 2. CREATE ACCOUNT FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6D8A68] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#556953]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-white border border-[#DDD8CD] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#1A2622] placeholder-[#8A9586]/60 focus:outline-none focus:ring-2 focus:ring-[#67795E]/30 focus:border-[#67795E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6D8A68] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#556953]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    className="w-full bg-white border border-[#DDD8CD] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1A2622] placeholder-[#8A9586]/60 focus:outline-none focus:ring-2 focus:ring-[#67795E]/30 focus:border-[#67795E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#556953]/60 hover:text-[#1A2622] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6D8A68] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#556953]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className="w-full bg-white border border-[#DDD8CD] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#1A2622] placeholder-[#8A9586]/60 focus:outline-none focus:ring-2 focus:ring-[#67795E]/30 focus:border-[#67795E]"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#556953] bg-[#E9EFE6] p-2.5 rounded-lg flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#556953] shrink-0 mt-0.5" />
                <span>Creating an account keeps your skin quiz profile, saved scans, and daily routine securely saved across all your devices.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#67795E] hover:bg-[#5A6A52] text-white py-3 px-4 rounded-xl font-medium text-sm tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0DBCF]"></div>
                </div>
                <span className="relative bg-[#F6F4EE] px-3 text-[11px] uppercase tracking-wider text-[#7C9075] font-semibold">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-[#FAF8F5] border border-[#DDD8CD] text-[#1A2622] py-2.5 px-4 rounded-xl font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Sign up with Google
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#E2C7C1]/40 flex items-center justify-center text-[#CD8B80]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1A2622]">Reset Password</h3>
                  <p className="text-xs text-[#556953]">Enter your email for reset instructions.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6D8A68] mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#556953]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-white border border-[#DDD8CD] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#1A2622] placeholder-[#8A9586]/60 focus:outline-none focus:ring-2 focus:ring-[#67795E]/30 focus:border-[#67795E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#67795E] hover:bg-[#5A6A52] text-white py-3 px-4 rounded-xl font-medium text-sm tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); clearMessages(); }}
                  className="text-xs text-[#556953] hover:text-[#1A2622] font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer reassurance */}
        <div className="mt-6 text-center text-xs text-[#556953]/80">
          <p>WiseBloom &bull; Private, Secure & Evidence-Based</p>
        </div>

      </div>
    </motion.div>
  );
}
