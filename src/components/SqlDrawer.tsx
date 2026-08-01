import React, { useState } from 'react';
import { FULL_SQL_SCRIPT_SUPABASE } from '../data/mockData';
import { Language } from '../types';
import { Database, Copy, Check, X, Shield, Terminal } from 'lucide-react';

interface SqlDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SqlDrawer: React.FC<SqlDrawerProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAR = lang === 'AR';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(FULL_SQL_SCRIPT_SUPABASE);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 text-slate-100 h-full shadow-2xl flex flex-col border-s border-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm">
              {isAR ? 'مخطط Supabase SQL الكامل (Database Schema)' : 'Schéma SQL Supabase PostgreSQL'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          <p className="text-slate-400 leading-relaxed">
            {isAR
              ? 'انسخ هذا النص البرمجي الكامل لتنفيذه في Supabase SQL Editor لإنشاء الجداول، الأنواع، ومستويات الأمان RLS.'
              : 'Copiez ce script SQL pour l exécuter directement dans le SQL Editor de votre projet Supabase.'}
          </p>

          <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAR ? 'تم النسخ!' : 'Copié !'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAR ? 'نسخ الكود' : 'Copier SQL'}</span>
                </>
              )}
            </button>

            <pre className="whitespace-pre-wrap">{FULL_SQL_SCRIPT_SUPABASE}</pre>
          </div>
        </div>

      </div>
    </div>
  );
};
