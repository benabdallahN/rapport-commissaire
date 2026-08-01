import { FullReport } from '../types';

export interface ResendEmailPayload {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  sentAt: string;
  driveLink: string;
}

export const RESEND_CONFIG = {
  apiKey: 're_dna_ftf_2026_secure_key',
  senderEmail: 'notifications@dna.ftf.org.tn',
  dnaAdminEmail: 'dna.admin@ftf.org.tn',
};

export const sendValidationEmailViaResend = async (
  report: FullReport,
  driveLink: string
): Promise<ResendEmailPayload> => {
  const recipients = [
    report.commissaireEmail || 'assesseurstunisie@gmail.com',
    RESEND_CONFIG.dnaAdminEmail,
  ];

  const subject = `[FTF-DNA] Validation du Rapport de Match ${report.code} (${report.teamA} vs ${report.teamB})`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; color: #ef4444; font-size: 18px;">FÉDÉRATION TUNISIENNE DE FOOTBALL</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;">Direction Nationale de l'Arbitrage (DNA)</p>
      </div>

      <div style="padding: 24px; color: #1e293b; font-size: 14px; line-height: 1.6;">
        <p>Bonjour,</p>
        <p>Votre rapport d'inspection du match <strong>${report.teamA} vs ${report.teamB}</strong> (${report.competition}, ${report.matchDay}) a été dûment <strong>validé et enregistré</strong> avec succès.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #0f172a;">Résumé des Performances :</p>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Code Rapport :</strong> ${report.code}</li>
            <li><strong>Date & Lieu :</strong> ${report.matchDate} à ${report.city}</li>
            <li><strong>Score Final :</strong> ${report.teamA} ${report.scoreFinalA} - ${report.scoreFinalB} ${report.teamB}</li>
            <li><strong>Note de l'Arbitre Central :</strong> <span style="color: #d97706; font-weight: bold;">${report.calculatedRefereeScore} / 10.0</span> (${report.calculatedPerformanceFR})</li>
            <li><strong>Commissaire Rédacteur :</strong> ${report.commissaireName}</li>
          </ul>
        </div>

        <p>Vous pouvez consulter le document PDF officiel archivé en cliquant sur le lien sécurisé Google Drive ci-dessous :</p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${driveLink}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
             Consulter le Rapport sur Google Drive
          </a>
        </div>

        <p style="font-size: 12px; color: #64748b;">Lien direct : <a href="${driveLink}" style="color: #2563eb;">${driveLink}</a></p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          Direction Nationale de l'Arbitrage — Fédération Tunisienne de Football (FTF)
        </p>
      </div>
    </div>
  `;

  // Simulate Resend API latency
  await new Promise((res) => setTimeout(res, 800));

  const payload: ResendEmailPayload = {
    id: `msg_resend_${Date.now()}`,
    from: RESEND_CONFIG.senderEmail,
    to: recipients,
    subject,
    html: htmlBody,
    sentAt: new Date().toISOString(),
    driveLink,
  };

  return payload;
};
