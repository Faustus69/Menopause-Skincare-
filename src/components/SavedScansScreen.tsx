import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowLeft, Download, Trash2, Edit2, Loader2, Check } from 'lucide-react';
import { Screen } from '../types';
import jsPDF from 'jspdf';

interface SavedScansScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function SavedScansScreen({ onNavigate }: SavedScansScreenProps) {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    try {
      const savedScansStr = localStorage.getItem('boots_skin_decoder_scans');
      const savedScans = savedScansStr ? JSON.parse(savedScansStr) : [];
      setScans(savedScans);
    } catch (e) {
      console.error("Error reading scans from localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = (scanId: string) => {
    try {
      const updatedScans = scans.filter(scan => scan.id !== scanId);
      setScans(updatedScans);
      localStorage.setItem('boots_skin_decoder_scans', JSON.stringify(updatedScans));
    } catch (err) {
      console.error("Error deleting scan", err);
    }
  };

  const handleUpdateName = (scanId: string) => {
    if (!editName.trim()) return;
    try {
      const updatedScans = scans.map(scan => {
        if (scan.id === scanId) {
          return {
            ...scan,
            productName: editName.trim(),
            updatedAt: new Date().toISOString()
          };
        }
        return scan;
      });
      setScans(updatedScans);
      localStorage.setItem('boots_skin_decoder_scans', JSON.stringify(updatedScans));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating scan name", err);
    }
  };

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text('My Saved Skincare Scans', 14, 22);
    
    let y = 35;
    pdf.setFontSize(12);
    
    scans.forEach((scan, index) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${scan.productName || 'Unnamed Product'}`, 14, y);
      y += 7;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      
      const ingredients = scan.ingredients?.map((i: any) => i.name).join(', ') || 'No ingredients listed';
      const lines = pdf.splitTextToSize(`Ingredients: ${ingredients}`, 180);
      pdf.text(lines, 14, y);
      y += (lines.length * 5) + 5;
      
      if (scan.summary) {
        const summaryLines = pdf.splitTextToSize(`Summary: ${scan.summary}`, 180);
        pdf.text(summaryLines, 14, y);
        y += (summaryLines.length * 5) + 5;
      }
      
      pdf.setFontSize(12);
      y += 5;
    });
    
    pdf.save('skincare-scans-report.pdf');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-full bg-[#FAF9F6] pb-10"
    >
      <div className="sticky top-0 z-10 bg-[#FAF9F6]/90 backdrop-blur-md px-5 py-4 border-b border-[#E2B4BD]/20 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 -ml-2 rounded-full hover:bg-white text-[#1B263B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-serif font-bold text-[#1B263B]">Saved Scans</h1>
        <div className="w-9" />
      </div>

      <div className="px-5 mt-6 mb-4 flex items-center justify-between">
        <p className="text-sm text-stone-600 font-sans">
          You have <span className="font-bold text-[#1B263B]">{scans.length}</span> saved product{scans.length !== 1 && 's'}.
        </p>
        {scans.length > 0 && (
          <button
            onClick={exportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059]/20 rounded-lg text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        )}
      </div>

      <div className="px-5 flex flex-col gap-4">
        {scans.length === 0 ? (
          <div className="bg-white border border-stone-100 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-sm text-stone-500">No saved scans yet.</p>
          </div>
        ) : (
          scans.map((scan) => (
            <div key={scan.id} className="bg-white border border-[#E2B4BD]/30 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-2">
                {editingId === scan.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-[#C5A059] rounded-lg text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                      autoFocus
                    />
                    <button onClick={() => handleUpdateName(scan.id)} className="p-1.5 bg-[#C5A059] text-white rounded-lg">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <h3 className="text-base font-serif font-bold text-[#1B263B] truncate">
                      {scan.productName || 'Unnamed Product'}
                    </h3>
                    <button 
                      onClick={() => { setEditingId(scan.id); setEditName(scan.productName || ''); }}
                      className="p-1 text-stone-400 hover:text-[#C5A059]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(scan.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-stone-600 font-sans mb-3 line-clamp-3">
                {scan.summary}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {scan.ingredients?.slice(0, 5).map((ing: any, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-[#FAF9F6] border border-[#E2B4BD]/40 rounded text-[10px] text-stone-600">
                    {ing.name}
                  </span>
                ))}
                {scan.ingredients?.length > 5 && (
                  <span className="px-2 py-0.5 bg-[#FAF9F6] border border-[#E2B4BD]/40 rounded text-[10px] text-stone-600">
                    +{scan.ingredients.length - 5} more
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
