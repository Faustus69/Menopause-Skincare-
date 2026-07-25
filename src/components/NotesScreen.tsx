/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Plus, Trash2, Edit2, Calendar, 
  Sparkles, Smile, CloudLightning, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { Screen } from '../types';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  dryness: number; // 1-5 scale
  warmth: number;  // 1-5 scale (hot flashes / flush tracking)
}

interface NotesScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
}

export default function NotesScreen({ onNavigate, onGoBack }: NotesScreenProps) {
  // Load journal entries from localStorage
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('boots_skin_decoder_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sample_1',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          title: 'Initial Skin Log & Retinol Response',
          content: 'Started using Retinol in the evening two days ago as suggested for sagging & wrinkles. Experiencing very mild skin dryness, but the barrier repair cream with Ceramides is keeping it under control. Loving the skin A-Z tips!',
          dryness: 3,
          warmth: 2
        },
        {
          id: 'sample_2',
          date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          title: 'Hormonal breakout calmed with Niacinamide',
          content: 'Used Niacinamide this morning. The redness and small congestion around the jawline is noticeably calmer. Best combination seems to be Niacinamide + Squalane for barrier comfort.',
          dryness: 2,
          warmth: 4
        }
      ];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dryness, setDryness] = useState(2);
  const [warmth, setWarmth] = useState(2);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Persist entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('boots_skin_decoder_notes', JSON.stringify(entries));
    } catch (err) {
      console.error('Failed to save notes to localStorage', err);
    }
  }, [entries]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      // Edit mode
      setEntries((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, title: title.trim(), content: content.trim(), dryness, warmth }
            : item
        )
      );
      setEditingId(null);
      setSuccessMessage('Entry updated successfully!');
    } else {
      // Add mode
      const newEntry: JournalEntry = {
        id: 'entry_' + Date.now(),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        title: title.trim(),
        content: content.trim(),
        dryness,
        warmth
      };
      setEntries((prev) => [newEntry, ...prev]);
      setSuccessMessage('Entry logged successfully!');
    }

    // Reset fields
    setTitle('');
    setContent('');
    setDryness(2);
    setWarmth(2);
    setShowForm(false);

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleEdit = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setDryness(entry.dryness);
    setWarmth(entry.warmth);
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this log entry?')) {
      setEntries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-full"
    >
      {/* Decorative Elegant Soft Spots */}
      <div className="absolute top-12 right-0 w-32 h-32 bg-[#F3E1D3]/50 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-28 h-28 bg-[#E9D5C4]/30 rounded-full blur-2xl pointer-events-none"></div>

      {/* Screen Header */}
      <div className="p-6 pb-2 select-none z-10">
        <h1 className="text-3xl font-serif font-light text-[#1B263B]">
          Daily Skin <span className="text-[#C5A059] italic font-semibold">Notes & Logs</span>
        </h1>
        <p className="text-xs text-[#DAA89B] font-sans font-bold uppercase tracking-widest mt-1.5">
          Track active routine updates, skin comfort & warmth
        </p>
      </div>

      <div className="px-6 pb-24 z-10 select-text flex-1 flex flex-col gap-5">
        
        {/* Save feedback block */}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-sans font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* Dynamic button key components to toggle log form */}
        {!showForm ? (
          <button
            onClick={() => {
              setEditingId(null);
              setTitle('');
              setContent('');
              setDryness(2);
              setWarmth(2);
              setShowForm(true);
            }}
            className="w-full bg-[#1B263B] text-white p-4 rounded-xl flex items-center justify-center gap-2 text-[13px] font-sans font-semibold tracking-wider uppercase transition-all hover:bg-[#253447] active:scale-98 cursor-pointer shadow-md"
          >
            <Plus className="w-5 h-5 text-[#DAA89B]" /> 
            <span>Create New Skin Log Entry</span>
          </button>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave}
            className="bg-white p-5 rounded-2xl border-2 border-[#E2B4BD]/30 shadow-xs flex flex-col gap-4 font-sans"
          >
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <span className="text-[11px] text-[#DAA89B] font-bold uppercase tracking-wider">
                {editingId ? 'Edit Log Entry' : 'New Journal Entry'}
              </span>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-stone-400 hover:text-stone-600"
              >
                Cancel
              </button>
            </div>

            {/* Title field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Log Title:</label>
              <input
                type="text"
                placeholder="e.g. Muted Retinol Redness, AM Hydration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-[#1B263B] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Skin Metrics: Dryness & Flushes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-blue-400" /> Dryness Feel:
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400">Low</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={dryness}
                    onChange={(e) => setDryness(Number(e.target.value))}
                    className="flex-1 accent-[#C5A059]"
                  />
                  <span className="text-xs font-mono font-bold text-[#C5A059]">{dryness}/5</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide flex items-center gap-1">
                  <CloudLightning className="w-3.5 h-3.5 text-amber-500" /> Hot Flushes/Flush:
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400">Low</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={warmth}
                    onChange={(e) => setWarmth(Number(e.target.value))}
                    className="flex-1 accent-[#C5A059]"
                  />
                  <span className="text-xs font-mono font-bold text-[#C5A059]">{warmth}/5</span>
                </div>
              </div>
            </div>

            {/* Note Text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Journal Details / Observations:</label>
              <textarea
                rows={4}
                placeholder="Write your notes here... list current active ingredients and how your skin reacted, sunscreen response, or barrier status."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={600}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-[#1B263B] focus:outline-none focus:border-[#C5A059] leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1B263B] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#253447] cursor-pointer"
            >
              {editingId ? 'Save Changes' : 'Append to Logs'}
            </button>
          </motion.form>
        )}

        {/* Notes Timeline / History Entries list */}
        <div className="flex flex-col gap-4 mt-2">
          {entries.length === 0 ? (
            <div className="p-8 bg-white/70 border border-stone-200/40 rounded-2xl text-center flex flex-col items-center justify-center select-none shadow-3xs">
              <BookOpen className="w-8 h-8 text-stone-300 stroke-[1.5] mb-2" />
              <span className="text-xs text-stone-500 font-medium">No skin log entries recorded yet.</span>
              <span className="text-[10px] text-stone-400 mt-1 max-w-xs">Start logging daily notes to spot skincare compatibility and safeguard your midlife stage!</span>
            </div>
          ) : (
            entries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                className="bg-white p-5 rounded-2xl border border-stone-200/45 shadow-3xs hover:shadow-2xs transition-shadow flex flex-col gap-3 font-sans relative"
              >
                {/* Header title area of card */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] text-[#DAA89B] font-bold uppercase font-sans flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#DAA89B]" /> {entry.date}
                    </span>
                    <h3 className="text-sm font-bold text-[#1B263B] font-sans mt-1 leading-snug">
                      {entry.title}
                    </h3>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(entry)}
                      title="Edit Log Entry"
                      className="p-1.5 text-stone-400 hover:text-[#C5A059] hover:bg-[#FAF9F6] rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      title="Delete Entry"
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main description text */}
                <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-wrap font-medium">
                  {entry.content}
                </p>

                {/* Bottom skin level badges */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2 items-center text-[10px] text-stone-400">
                  <span className="font-semibold text-stone-500">Recorded metrics:</span>
                  <div className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center gap-1">
                    <span>Dryness: {entry.dryness}/5</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 flex items-center gap-1">
                    <span>Flush level: {entry.warmth}/5</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
