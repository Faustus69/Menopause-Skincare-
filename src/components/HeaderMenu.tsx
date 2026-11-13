/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Home, ShieldCheck, Sparkles, BookOpen, Heart, Camera, FileText, Info, Leaf, SunMoon, ChevronLeft,
  LogOut, User as UserIcon, RotateCcw, ChevronRight, Link2, Copy, Check, RefreshCw, Ban
} from 'lucide-react';
import { Screen } from '../types';
import { User } from 'firebase/auth';
import { 
  getGuestInviteStatus, 
  rotateGuestInviteLink, 
  revokeGuestInviteLink, 
  GuestInviteStatus 
} from '../firebase';

interface HeaderMenuProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onGoBack?: () => void;
  hasBarrierQuizAnswers: boolean;
  user?: User | null;
  isOwner?: boolean;
  onSignOut?: () => void;
  onSignInClick?: () => void;
  onResetGuestData?: () => Promise<void>;
}

export default function HeaderMenu({ 
  currentScreen, 
  onNavigate, 
  onGoBack, 
  hasBarrierQuizAnswers,
  user,
  isOwner,
  onSignOut,
  onSignInClick,
  onResetGuestData
}: HeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const [inviteStatus, setInviteStatus] = useState<GuestInviteStatus | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'live' | 'preview' | null>(null);
  const [pendingInviteAction, setPendingInviteAction] = useState<'rotate' | 'revoke' | null>(null);

  useEffect(() => {
    if (isOpen && isOwner && !inviteStatus && !inviteLoading) {
      setInviteLoading(true);
      setInviteError(null);
      getGuestInviteStatus()
        .then((status) => setInviteStatus(status))
        .catch((err: any) => setInviteError(err?.message || 'Unable to load invitation link.'))
        .finally(() => setInviteLoading(false));
    }
  }, [isOpen, isOwner, inviteStatus, inviteLoading]);

  const handleCopyUrl = async (url: string, kind: 'live' | 'preview') => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedType(kind);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      setInviteError('Could not copy automatically. Please copy the link manually.');
    }
  };

  // High-level navigation links defined under the Design System guideline
  const navItems = [
    { 
      id: 'welcome', 
      label: 'Welcome', 
      screen: 'welcome' as Screen, 
      icon: Info,
      isActive: currentScreen === 'welcome'
    },
    { 
      id: 'home', 
      label: 'Home', 
      screen: 'home' as Screen, 
      icon: Home,
      isActive: currentScreen === 'home'
    },
    { 
      id: 'barriers', 
      label: 'Skin Barriers', 
      screen: 'barrier_quiz' as Screen, // Point 2: Always goes to the main quiz/barrier page, not the last results
      icon: ShieldCheck,
      isActive: ['barrier_quiz', 'barrier_results'].includes(currentScreen)
    },
    { 
      id: 'concerns', 
      label: 'Skin Concerns', 
      screen: 'concern_list' as Screen, 
      icon: Sparkles,
      isActive: ['concern_list', 'concern_results'].includes(currentScreen)
    },
    { 
      id: 'az', 
      label: 'A-Z Ingredients', 
      screen: 'ingredient_az' as Screen, 
      icon: BookOpen,
      isActive: ['ingredient_az', 'ingredient_detail'].includes(currentScreen)
    },
    { 
      id: 'favorites', 
      label: 'Favourites', 
      screen: 'favorites' as Screen, 
      icon: Heart,
      isActive: currentScreen === 'favorites'
    },
    { 
      id: 'routine_builder', 
      label: 'Routine Builder', 
      screen: 'routine_builder' as Screen, 
      icon: SunMoon,
      isActive: currentScreen === 'routine_builder'
    },
    
    { 
      id: 'saved_scans', 
      label: 'Saved Scans', 
      screen: 'saved_scans' as Screen, 
      icon: FileText,
      isActive: currentScreen === 'saved_scans'
    },
    {
      id: 'scanner', 
      label: 'Scanner', 
      screen: 'product_analyzer' as Screen, 
      icon: Camera,
      isActive: currentScreen === 'product_analyzer'
    },
    { 
      id: 'notes', 
      label: 'Notes', 
      screen: 'notes' as Screen, 
      icon: FileText,
      isActive: currentScreen === 'notes'
    },
  ];

  const handleLinkClick = (screen: Screen) => {
    onNavigate(screen);
    setIsOpen(false);
  };

  return (
    <div 
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 shrink-0"
      id="global_header_wrapper"
    >
      <div className="h-16 px-4 flex items-center justify-between select-none">
        
        {/* Left Side: Small back link with < + Brand Logo */}
        <div className="flex items-center gap-2">
          {/* Back button on all pages except welcome - enlarged for mobile readability */}
          <button
            onClick={onGoBack || (() => onNavigate('home'))}
            className="flex items-center gap-1 text-primary hover:text-primary/80 active:scale-95 transition-all px-3.5 py-2 -ml-1 rounded-xl cursor-pointer font-sans text-base font-bold bg-secondary/90 hover:bg-secondary border border-border/60 shadow-2xs"
            title="Go Back"
            id="global_top_back_link"
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
            <span className="text-sm sm:text-base font-bold tracking-tight">Back</span>
          </button>

          {/* Logo Block inside the Header */}
          <div 
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 cursor-pointer active:scale-98 transition-transform"
            id="global_logo_block"
          >
            {/* Logo Circle */}
            <div className="h-8 w-8 rounded-full bg-secondary font-serif flex items-center justify-center text-[13px] font-bold tracking-tight shadow-2xs shrink-0 select-none">
              <Leaf className="w-4 h-4 stroke-[1.5] text-[#556953] fill-[#556953]" />
            </div>
            {/* Logo Text Block */}
            <div className="flex flex-col select-none hidden xs:flex">
              <span className="font-serif text-xs font-bold tracking-tight text-primary leading-tight">
                Skincare Decoder
              </span>
              <span className="text-[8px] uppercase tracking-[0.18em] text-muted-foreground leading-none mt-0.5">
                Wise Bloom
              </span>
            </div>
          </div>
        </div>

        {/* Favourites Shortcut + Hamburger Menu Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Heart Favourites Button from Design System (Section 9) - hidden on ingredient_az */}
          {currentScreen !== 'ingredient_az' && (
            <button
              onClick={() => handleLinkClick('favorites')}
              className={`p-2 rounded-full transition-all duration-300 active:scale-90 cursor-pointer ${
                currentScreen === 'favorites'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-primary hover:bg-primary/10'
              }`}
              title="View Saved Favourites"
            >
              <Heart className={`w-4 h-4 ${currentScreen === 'favorites' ? 'fill-white' : ''}`} />
            </button>
          )}

          {/* Hamburger Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 rounded-full bg-secondary text-primary flex items-center justify-center hover:bg-secondary-foreground/10 active:scale-95 transition-all cursor-pointer shadow-3xs"
            id="mobile_hamburger_trigger"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border/40 bg-background"
            id="mobile_menu_panel"
          >
            <div className="px-4 py-3 pb-5 flex flex-col gap-1.5 bg-background shadow-lg">
              <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-sans font-bold px-3 mb-1 select-none">
                Navigation
              </span>
              
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.screen)}
                    className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer active:scale-98 ${
                      item.isActive
                        ? 'bg-secondary text-primary border-l-3 border-primary font-bold shadow-3xs'
                        : 'text-foreground hover:bg-secondary/40 hover:text-primary'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${item.isActive ? 'text-primary stroke-[2.2]' : 'text-muted-foreground'}`} />
                    <span className="font-sans text-[13px]">{item.label}</span>
                  </button>
                );
              })}

              {/* Account & Session Controls */}
              <div className="mt-2 pt-3 border-t border-border/50 flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-sans font-bold px-3 mb-0.5 select-none">
                  Customer Account
                </span>
                {user ? (
                  <div className="px-3 py-2 bg-secondary/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs text-foreground truncate max-w-[170px]" title={user.email || 'WiseBloom Guest Pass'}>
                        {user.email || 'WiseBloom Guest Pass'}
                      </span>
                    </div>
                    {onSignOut && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onSignOut();
                        }}
                        className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer ml-2 shrink-0 py-1 px-1.5 rounded hover:bg-rose-50"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                ) : (
                  onSignInClick && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onSignInClick();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold text-primary bg-secondary/60 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-primary" />
                      <span>Sign In / Register</span>
                    </button>
                  )
                )}
              </div>

              {/* Owner Controls: Guest Invitation Link & Reset Guest Data */}
              {isOwner && (
                <div className="mt-2 pt-3 border-t border-border/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-[#CD8B80] font-sans font-bold select-none flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#CD8B80]" />
                      Owner Controls
                    </span>
                    <span className="text-[10px] bg-[#E2C7C1]/30 text-[#8E4D43] font-semibold px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  </div>

                  {/* Friend Guest Invitation Link Card */}
                  <div className="w-full p-3 rounded-xl bg-[#F6F4EE] border border-[#E0DBCF] flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#67795E]/15 flex items-center justify-center text-[#556953] shrink-0">
                          <Link2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-[#1A2622]">Friend Guest Link</span>
                      </div>
                      {inviteLoading ? (
                        <span className="text-[10px] text-[#556953]">Loading...</span>
                      ) : inviteStatus?.active ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                          Revoked
                        </span>
                      )}
                    </div>

                    {inviteError && (
                      <p className="text-[11px] text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg leading-snug">
                        {inviteError}
                      </p>
                    )}

                    {inviteStatus?.active && inviteStatus.inviteUrl ? (
                      <>
                        <div className="bg-white border border-[#E0DBCF] rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-[#1A2622] break-all select-all">
                          {inviteStatus.inviteUrl}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(inviteStatus.inviteUrl!, 'live')}
                            className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#67795E] hover:bg-[#5A6A52] text-white text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            {copiedType === 'live' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedType === 'live' ? 'Copied!' : 'Copy Share Link'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPendingInviteAction('rotate')}
                            disabled={inviteBusy}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#DDD8CD] text-[#1A2622] text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                            title="Replace with a brand-new link"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Replace</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPendingInviteAction('revoke')}
                            disabled={inviteBusy}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                            title="Disable this link"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Revoke</span>
                          </button>
                        </div>

                        {typeof window !== 'undefined' &&
                          window.location.origin !== 'https://app.wisebloom.co.uk' &&
                          inviteStatus.inviteToken && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyUrl(
                                  `${window.location.origin}/?invite=${inviteStatus.inviteToken}`,
                                  'preview'
                                )
                              }
                              className="text-[10px] text-[#556953] hover:text-[#1A2622] underline underline-offset-2 text-left cursor-pointer"
                            >
                              {copiedType === 'preview'
                                ? 'Preview test link copied!'
                                : 'Copy preview test link (for testing here before deploy)'}
                            </button>
                          )}
                      </>
                    ) : !inviteLoading ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] text-[#556953] leading-snug">
                          No active invitation link. Any older links are disabled.
                        </p>
                        <button
                          type="button"
                          disabled={inviteBusy}
                          onClick={async () => {
                            try {
                              setInviteBusy(true);
                              setInviteError(null);
                              const updated = await rotateGuestInviteLink();
                              setInviteStatus(updated);
                            } catch (err: any) {
                              setInviteError(err?.message || 'Could not create link.');
                            } finally {
                              setInviteBusy(false);
                            }
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#67795E] hover:bg-[#5A6A52] text-white text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>{inviteBusy ? 'Creating...' : 'Create New Invitation Link'}</span>
                        </button>
                      </div>
                    ) : null}

                    {pendingInviteAction && (
                      <div className="mt-1 p-2.5 rounded-lg bg-white border border-[#E0DBCF] text-[11px] space-y-2">
                        <p className="text-[#1A2622] leading-snug">
                          {pendingInviteAction === 'rotate'
                            ? 'Replace this link? The old link will stop working immediately and a new one will be created.'
                            : 'Revoke this link? Nobody using this invitation link will be able to access the app.'}
                        </p>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPendingInviteAction(null)}
                            disabled={inviteBusy}
                            className="px-2.5 py-1 rounded text-[#556953] hover:bg-black/5 font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={inviteBusy}
                            onClick={async () => {
                              try {
                                setInviteBusy(true);
                                setInviteError(null);
                                const updated =
                                  pendingInviteAction === 'rotate'
                                    ? await rotateGuestInviteLink()
                                    : await revokeGuestInviteLink();
                                setInviteStatus(updated);
                                setPendingInviteAction(null);
                              } catch (err: any) {
                                setInviteError(err?.message || 'Action failed.');
                              } finally {
                                setInviteBusy(false);
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-[#CD8B80] hover:bg-[#B66F64] text-white font-semibold cursor-pointer disabled:opacity-50"
                          >
                            {inviteBusy
                              ? 'Updating...'
                              : pendingInviteAction === 'rotate'
                              ? 'Yes, Replace Link'
                              : 'Yes, Revoke Link'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {onResetGuestData && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setResetStatus(null);
                          setShowResetConfirm(true);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F6F4EE] hover:bg-[#EFECE3] border border-[#E0DBCF] text-left transition-all cursor-pointer active:scale-98"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-[#CD8B80]/15 flex items-center justify-center text-[#CD8B80]">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-[#1A2622]">Reset Guest Data</span>
                            <span className="text-[10px] text-[#556953]">Clear shared guest routines, notes & scans</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8A9A86]" />
                      </button>

                      {resetStatus && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg leading-snug">
                          {resetStatus}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Resetting Guest Data */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#F9F7F3] rounded-2xl max-w-[340px] w-full p-5 border border-[#E0DBCF] shadow-xl text-left"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A2622] leading-tight">
                    Reset Guest Data?
                  </h3>
                  <p className="text-[11px] text-[#556953]">WiseBloom Guest (guest@wisebloom.co.uk)</p>
                </div>
              </div>

              <p className="text-xs text-[#556953] leading-relaxed mb-4">
                This will clear all saved <strong>routines, favourites, recommended actives, notes, and scans</strong> for the guest account.
                <br /><br />
                The guest login credentials and its complimentary access will <strong>remain active</strong>. Your owner data and other customer data will not be affected.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBE7DF]">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  disabled={isResetting}
                  className="px-3 py-1.5 text-xs font-semibold text-[#556953] hover:text-[#1A2622] rounded-lg hover:bg-black/5 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsResetting(true);
                      if (onResetGuestData) {
                        await onResetGuestData();
                      }
                      setShowResetConfirm(false);
                      setResetStatus('Guest account data has been successfully reset.');
                      setTimeout(() => setResetStatus(null), 5000);
                    } catch (err: any) {
                      setResetStatus(err?.message || 'Failed to reset guest data.');
                    } finally {
                      setIsResetting(false);
                    }
                  }}
                  disabled={isResetting}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#CD8B80] hover:bg-[#B66F64] text-white rounded-lg shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isResetting ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Yes, Reset Guest Data</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
