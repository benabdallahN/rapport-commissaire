import React, { useState } from 'react';
import { FullReport, Language } from '../types';
import { exportReportToPdf } from '../utils/pdfExporter';
import {
  FolderOpen,
  X,
  Search,
  Download,
  Trash2,
  Copy,
  Edit,
  UserCheck,
  ShieldCheck,
  Users
} from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: FullReport[];
  onSelectReport: (report: FullReport) => void;
  onDeleteReport: (id: string) => void;
  onDuplicateReport: (report: FullReport) => void;
  lang: Language;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onDeleteReport,
  onDuplicateReport,
  lang,
}) => {
  const isAR = lang === 'AR';
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = reports.filter(
    (r) =>
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.teamA.toLowerCase().includes(search.toLowerCase()) ||
      r.teamB.toLowerCase().includes(search.toLowerCase()) ||
      r.commissaireName.toLowerCase().includes(search.toLowerCase()) ||
      r.competition.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to count how many reports exist for the same match
  const countReportsForMatch = (report: FullReport) => {
    return reports.filter(
      (r) =>
        r.matchDate === report.matchDate &&
        r.competition === report.competition &&
        r.teamA.toLowerCase() === report.teamA.toLowerCase() &&
        r.teamB.toLowerCase() === report.teamB.toLowerCase()
    ).length;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isAR ? 'مكتبة التقارير المحفوظة (Les Rapports)' : 'Bibliothèque des Rapports de Match'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAR ? 'بحث بالرمز، الفريق، المراقب...' : 'Rechercher un rapport...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-8">
              {isAR ? 'لا يوجد تقارير محفوظة مطابقة' : 'Aucun rapport enregistré.'}
            </p>
          ) : (
            filtered.map((r) => {
              const sameMatchCount = countReportsForMatch(r);
              const isDualCommissaireMatch = sameMatchCount > 1;

              return (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                        {r.code}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        r.status === 'VALIDATED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 text-amber-300'
                      }`}>
                        {r.status === 'VALIDATED' ? (isAR ? 'مصادق عليه' : 'Validé') : (isAR ? 'مسودة' : 'Brouillon')}
                      </span>

                      {isDualCommissaireMatch && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                          <Users className="w-3 h-3 text-indigo-600" />
                          <span>{isAR ? '2 مراقبين (تقريرين مستقلين)' : '2 Commissaires (2 rapports autonomes)'}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {r.teamA} ({r.scoreFinalA}) vs ({r.scoreFinalB}) {r.teamB}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                      <span>{r.competition} ({r.matchDay}) — {r.matchDate}</span>
                      <span>Note: <b className="text-amber-600 font-mono">{r.calculatedRefereeScore.toFixed(2)}</b></span>
                      {r.commissaireName && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Rapporteur: {r.commissaireName}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        onSelectReport(r);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{isAR ? 'فتح' : 'Ouvrir'}</span>
                    </button>

                    <button
                      onClick={() => onDuplicateReport(r)}
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                      title={isAR ? 'نسخ' : 'Dupliquer'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => exportReportToPdf(r, lang)}
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 text-emerald-600"
                      title="PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteReport(r.id)}
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-rose-50 text-rose-600"
                      title={isAR ? 'حذف' : 'Supprimer'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
