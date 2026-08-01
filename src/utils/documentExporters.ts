import { FullReport, Language } from '../types';
import * as XLSX from 'xlsx';

/**
 * Export a single report or list of reports to Excel (.xlsx)
 */
export function exportReportToExcel(reports: FullReport | FullReport[], filename?: string) {
  const reportList = Array.isArray(reports) ? reports : [reports];

  const excelRows = reportList.map((r) => ({
    'Code Rapport': r.code,
    'Saison': r.season,
    'Compétition': r.competition,
    'Journée': r.matchDay,
    'Date Match': r.matchDate,
    'Heure': r.matchTime,
    'Stade / Ville': `${r.stadium} (${r.city})`,
    'Équipe A': r.teamA,
    'Équipe B': r.teamB,
    'Score Final': `${r.scoreFinalA} - ${r.scoreFinalB}`,
    'Niveau Difficulté': r.difficultyLevel,
    'Arbitre Central': r.officials.find((o) => o.role === 'REFEREE')?.name || 'N/A',
    'Assistant 1': r.officials.find((o) => o.role === 'ASSISTANT_1')?.name || 'N/A',
    'Assistant 2': r.officials.find((o) => o.role === 'ASSISTANT_2')?.name || 'N/A',
    '4ème Officiel': r.officials.find((o) => o.role === 'FOURTH')?.name || 'N/A',
    'Commissaire': r.commissaireName,
    'Note Arbitre Central': r.calculatedRefereeScore,
    'Appréciation FR': r.calculatedPerformanceFR,
    'Appréciation AR': r.calculatedPerformanceAR,
    'Cartons Jaunes': r.cards.filter((c) => c.cardType === 'YELLOW').length,
    'Cartons Rouges': r.cards.filter((c) => c.cardType === 'RED' || c.cardType === 'SECOND_YELLOW').length,
    'Statut': r.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapports DNA');

  const name = filename || (reportList.length === 1 ? `${reportList[0].code}_Rapport.xlsx` : `Rapports_DNA_Export_${Date.now()}.xlsx`);
  XLSX.writeFile(workbook, name);
}

/**
 * Export a report to Microsoft Word (.docx)
 */
export function exportReportToWord(report: FullReport) {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Rapport d'Inspection ${report.code}</title>
      <style>
        body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.4; margin: 20px; }
        h1 { color: #1e293b; font-size: 16pt; text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 5px; }
        h2 { color: #0f172a; font-size: 13pt; margin-top: 15px; background: #f1f5f9; padding: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10pt; }
        th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
        th { background-color: #e2e8f0; font-weight: bold; }
        .score-box { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 10px; font-size: 12pt; font-weight: bold; color: #92400e; margin-top: 15px; }
        .footer { margin-top: 30px; font-size: 9pt; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div style="text-align: center; font-weight: bold; font-size: 14pt;">FÉDÉRATION TUNISIENNE DE FOOTBALL</div>
      <div style="text-align: center; font-size: 11pt; color: #64748b; font-weight: bold;">DIRECTION NATIONALE DE L'ARBITRAGE - DNA</div>
      
      <h1>RAPPORT COMMISSAIRE DES ARBITRES — ${report.code}</h1>

      <h2>1. INFORMATIONS GÉNÉRALES DU MATCH</h2>
      <table>
        <tr>
          <th>Rencontre</th>
          <td><strong>${report.teamA} (${report.teamAAbbr})</strong> vs <strong>${report.teamB} (${report.teamBAbbr})</strong></td>
        </tr>
        <tr>
          <th>Compétition & Journée</th>
          <td>${report.competition} (Journée ${report.matchDay}) — Saison ${report.season}</td>
        </tr>
        <tr>
          <th>Date & Heure</th>
          <td>${report.matchDate} à ${report.matchTime}</td>
        </tr>
        <tr>
          <th>Stade & Ville</th>
          <td>${report.stadium} (${report.city})</td>
        </tr>
        <tr>
          <th>Scores</th>
          <td>Mi-Temps: ${report.scoreHalfA} - ${report.scoreHalfB} | Score Final: ${report.scoreFinalA} - ${report.scoreFinalB}</td>
        </tr>
        <tr>
          <th>Niveau de Difficulté</th>
          <td><strong>${report.difficultyLevel}</strong></td>
        </tr>
      </table>

      <h2>2. TRIO ET CORPS ARBITRAL DESIGNÉ</h2>
      <table>
        <thead>
          <tr>
            <th>Rôle</th>
            <th>Nom et Prénom</th>
            <th>Ligue Régionale</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          ${report.officials.map(o => `
            <tr>
              <td>${o.role}</td>
              <td><strong>${o.name || 'Non renseigné'}</strong></td>
              <td>${o.league}</td>
              <td>${o.grade}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="score-box">
        NOTE GLOBALE DE L'ARBITRE CENTRAL: ${report.calculatedRefereeScore} / 10.0<br/>
        Appréciation: ${report.calculatedPerformanceFR} (${report.calculatedPerformanceAR})
      </div>

      <h2>3. ÉVALUATION DÉTAILLÉE DU PRESTATAIRE</h2>
      <table>
        <thead>
          <tr>
            <th>Catégorie d'Évaluation</th>
            <th>Note (/10)</th>
            <th>Aspects Positifs</th>
            <th>Points à Améliorer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Personnalité & Autorité</strong></td>
            <td>${report.evaluations.personality.score}</td>
            <td>${report.evaluations.personality.positiveAspects.map(a => a.textFR).join(', ') || '---'}</td>
            <td>${report.evaluations.personality.improvementPoints.map(a => a.textFR).join(', ') || '---'}</td>
          </tr>
          <tr>
            <td><strong>Condition Physique & Placement</strong></td>
            <td>${report.evaluations.physical.score}</td>
            <td>${report.evaluations.physical.positiveAspects.map(a => a.textFR).join(', ') || '---'}</td>
            <td>${report.evaluations.physical.improvementPoints.map(a => a.textFR).join(', ') || '---'}</td>
          </tr>
          <tr>
            <td><strong>Application des Lois du Jeu</strong></td>
            <td>${report.evaluations.laws.score}</td>
            <td>${report.evaluations.laws.positiveAspects.map(a => a.textFR).join(', ') || '---'}</td>
            <td>${report.evaluations.laws.improvementPoints.map(a => a.textFR).join(', ') || '---'}</td>
          </tr>
        </tbody>
      </table>

      <h2>4. INCIDENTS DISCIPLINAIRES ET AVERTISSEMENTS</h2>
      <p>Cartons distribués au cours de la rencontre: <strong>${report.cards.length}</strong> (Avertissements / Expulsions)</p>

      <h2>5. REMARQUES GÉNÉRALES & CONCLUSION</h2>
      <p>${report.generalComments || 'Aucune remarque particulière formulée par l inspecteur.'}</p>

      <div class="footer">
        Rapport établi et signé par le Commissaire: <strong>${report.commissaireName}</strong> (${report.commissaireEmail})<br/>
        Fait à ${report.citySignature}, le ${report.dateSignature} | Statut: ${report.status}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.code}_Rapport_Official.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
