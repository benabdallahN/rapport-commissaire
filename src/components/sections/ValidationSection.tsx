import React, { useRef, useState } from 'react';
import { FullReport, Language } from '../../types';
import { exportReportToPdf } from '../../utils/pdfExporter';
import { exportReportToExcel, exportReportToWord } from '../../utils/documentExporters';
import { sendValidationEmailViaResend, ResendEmailPayload } from '../../lib/resendService';
import {
  Send,
  FileText,
  Download,
  Mail,
  CheckCircle2,
  HardDrive,
  Eraser,
  PenTool,
  FileSpreadsheet,
  X,
  ExternalLink
} from 'lucide-react';

interface ValidationSectionProps {
  report: FullReport;
  onChange: (updated: Partial<FullReport>) => void;
  lang: Language;
}

export const ValidationSection: React.FC<ValidationSectionProps> = ({
  report,
  onChange,
  lang,
}) => {
  const isAR = lang === 'AR';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [resendLog, setResendLog] = useState<ResendEmailPayload | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Signature drawing pad handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      onChange({ signatureDataUrl: dataUrl });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    onChange({ signatureDataUrl: undefined });
  };

  const handleValidateAndSend = async () => {
    setIsSending(true);
    const driveLink = `https://drive.google.com/file/d/rapport_${report.code.toLowerCase()}_${Date.now()}/view`;
    
    onChange({
      status: 'VALIDATED',
      drivePdfUrl: driveLink,
    });

    try {
      const payload = await sendValidationEmailViaResend(report, driveLink);
      setResendLog(payload);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isAR ? 'المصادقة النهائية، التوقيع وتصدير التقرير' : 'Validation, Signature & Export du Rapport'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAR
                ? 'توقيع التقرير إلكترونياً، الحفظ، إرسال إشعار بالبريد وتوليد ملفات PDF / Excel / Word'
                : 'Signature électronique, validation officielle, notification Resend et exports'}
            </p>
          </div>
        </div>

        {/* Form Inputs for Signature Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAR ? 'اسم ولقب المراقب' : 'Nom du Commissaire'}
            </label>
            <input
              type="text"
              value={report.commissaireName}
              onChange={(e) => onChange({ commissaireName: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAR ? 'البريد الإلكتروني' : 'Email du Commissaire'}
            </label>
            <input
              type="email"
              value={report.commissaireEmail}
              onChange={(e) => onChange({ commissaireEmail: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAR ? 'حرر بـ' : 'Fait à (Ville)'}
            </label>
            <input
              type="text"
              value={report.citySignature}
              onChange={(e) => onChange({ citySignature: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        {/* Signature Pad */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <PenTool className="w-4 h-4 text-teal-600" />
              <span>{isAR ? 'التوقيع الإلكتروني لمراقب المباراة' : 'Signature Électronique du Commissaire'}</span>
            </div>
            <button
              onClick={clearSignature}
              className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 flex items-center gap-1"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>{isAR ? 'مسح التوقيع' : 'Effacer'}</span>
            </button>
          </div>

          <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-950 p-1 flex justify-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={120}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="cursor-crosshair w-full max-w-lg touch-none rounded-lg"
            />
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            {isAR ? 'ارسم توقيعك أعلاه باستخدام الماوس أو اللمس' : 'Dessinez votre signature dans le cadre ci-dessus.'}
          </p>
        </div>

        {/* Notification Toast */}
        {resendLog && (
          <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-lg flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-100" />
              <div>
                <p className="font-bold text-sm">
                  {isAR ? 'تمت المصادقة وإرسال الإشعار بنجاح!' : 'Rapport Validé & Notification Envoyée !'}
                </p>
                <p className="text-xs text-emerald-100 font-mono">
                  ID Resend: {resendLog.id} | Envoyer à: {resendLog.to.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Validate & Send */}
          <button
            disabled={isSending}
            onClick={handleValidateAndSend}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{isAR ? 'المصادقة والإرسال الرسمي' : 'Valider & Archiver (Resend)'}</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={() => exportReportToPdf(report, lang)}
            className="p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isAR ? 'تحميل التقرير (PDF)' : 'Télécharger PDF'}</span>
          </button>

          {/* Export Excel (.xlsx) */}
          <button
            onClick={() => exportReportToExcel(report)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>{isAR ? 'تصدير Excel (.xlsx)' : 'Export Excel (.xlsx)'}</span>
          </button>

          {/* Export Word (.docx) */}
          <button
            onClick={() => exportReportToWord(report)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>{isAR ? 'تصدير Word (.docx)' : 'Export Word (.docx)'}</span>
          </button>

        </div>

        {/* Resend Dispatched Email Modal / Log */}
        {resendLog && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-emerald-400">
                    {isAR ? 'تم إرسال البريد الإلكتروني عبر Resend' : 'Notification Resend expédiée avec succès !'}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID Message: {resendLog.id} | Date: {new Date(resendLog.sentAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResendLog(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">Expéditeur (Resend):</span>
                <span className="font-mono text-cyan-300">{resendLog.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">Destinataires:</span>
                <span className="font-mono text-emerald-300">{resendLog.to.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">Sujet:</span>
                <span className="font-semibold text-amber-200">{resendLog.subject}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Lien Sécurisé Google Drive généré:
              </span>
              <a
                href={resendLog.driveLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{resendLog.driveLink}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Drive Storage Simulator Banner */}
        {report.drivePdfUrl && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>
                {isAR
                  ? 'رابط النسخة المرفوعة على Google Drive:'
                  : 'Lien Google Drive du PDF généré:'}
              </span>
            </div>
            <a
              href={report.drivePdfUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-cyan-400 hover:underline truncate max-w-xs"
            >
              {report.drivePdfUrl}
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
