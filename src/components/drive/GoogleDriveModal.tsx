import React, { useState } from 'react';
import {
  DriveFileMetadata,
  GOOGLE_DRIVE_ACCOUNT,
  GOOGLE_DRIVE_FOLDER,
  INITIAL_DRIVE_FILES,
  simulateDriveUpload
} from '../../lib/googleDrive';
import { FullReport, Language } from '../../types';
import {
  HardDrive,
  X,
  Upload,
  FileText,
  ExternalLink,
  CheckCircle2,
  FolderCheck,
  Mail,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReport?: FullReport;
  lang: Language;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  currentReport,
  lang,
}) => {
  const isAR = lang === 'AR';
  const [files, setFiles] = useState<DriveFileMetadata[]>(INITIAL_DRIVE_FILES);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUploadCurrentReport = () => {
    if (!currentReport) return;
    setIsUploading(true);
    setUploadSuccess(false);

    setTimeout(() => {
      const newFile = simulateDriveUpload(currentReport.code, `${currentReport.teamA}_${currentReport.teamB}`);
      setFiles((prev) => [newFile, ...prev]);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-blue-300">
              <HardDrive className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  Google Drive Cloud Storage
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronisé
                </span>
              </div>
              <h2 className="text-lg font-black mt-0.5">
                {isAR ? 'تخزين المستندات والتقارير على Google Drive' : 'Stockage des Documents Google Drive'}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Account & Folder Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Compte Google Officiel
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                  {GOOGLE_DRIVE_ACCOUNT}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <FolderCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Dossier de Destination
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                  {GOOGLE_DRIVE_FOLDER}
                </span>
              </div>
            </div>
          </div>

          {/* Current Report Upload Shortcut */}
          {currentReport && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Rapport Actuel: {currentReport.code} ({currentReport.teamA} vs {currentReport.teamB})
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Sauvegarder immédiatement une copie PDF dans le Google Drive de {GOOGLE_DRIVE_ACCOUNT}
                </p>
              </div>

              <button
                onClick={handleUploadCurrentReport}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{isUploading ? 'Téléversement...' : 'Synchroniser sur Drive'}</span>
              </button>
            </div>
          )}

          {/* Notification */}
          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-blue-500 text-white shadow-md text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-blue-100 shrink-0" />
              <span>Document sauvegardé avec succès dans le Google Drive de {GOOGLE_DRIVE_ACCOUNT} !</span>
            </div>
          )}

          {/* Files List */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Fichiers archivés récemment</span>
              <span className="text-slate-400 font-mono font-normal">{files.length} fichiers</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(file.createdTime).toLocaleDateString('fr-FR')}
                        </span>
                      </span>
                    </div>
                  </div>

                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>Consulter</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
