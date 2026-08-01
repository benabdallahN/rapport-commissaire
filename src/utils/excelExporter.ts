import { FullReport } from '../types';

export function exportReportToCSV(report: FullReport) {
  const rows = [
    ['Code Rapport', report.code],
    ['Saison', report.season],
    ['Competition', report.competition],
    ['Journée', report.matchDay],
    ['Date', report.matchDate],
    ['Heure', report.matchTime],
    ['Stade', report.stadium],
    ['Ville', report.city],
    ['Équipe A', report.teamA],
    ['Équipe B', report.teamB],
    ['Score Mi-Temps', `${report.scoreHalfA} - ${report.scoreHalfB}`],
    ['Score Final', `${report.scoreFinalA} - ${report.scoreFinalB}`],
    ['Degré de difficulté', report.difficultyLevel],
    ['Note Finale Arbitre', report.calculatedRefereeScore],
    ['Appréciation FR', report.calculatedPerformanceFR],
    ['Appréciation AR', report.calculatedPerformanceAR],
    ['Commissaire Name', report.commissaireName],
    ['Commissaire Email', report.commissaireEmail],
    ['Statut', report.status]
  ];

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + rows.map(e => e.map(x => `"${x}"`).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${report.code}_Rapport.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportReportToWord(report: FullReport) {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>Rapport Commissaire ${report.code}</title></head>
    <body style="font-family: Arial, sans-serif;">
      <h2 style="text-align: center; color: #0f172a;">FEDERATION TUNISIENNE DE FOOTBALL</h2>
      <h3 style="text-align: center; color: #1e293b;">DIRECTION NATIONALE DE L'ARBITRAGE</h3>
      <hr/>
      <h4>RAPPORT COMMISSAIRE DES ARBITRES - ${report.code}</h4>
      <p><b>Match:</b> ${report.teamA} (${report.teamAAbbr}) vs ${report.teamB} (${report.teamBAbbr})</p>
      <p><b>Compétition:</b> ${report.competition} (Journée ${report.matchDay})</p>
      <p><b>Date:</b> ${report.matchDate} @ ${report.matchTime} - ${report.stadium} (${report.city})</p>
      <p><b>Score Mi-Temps:</b> ${report.scoreHalfA} - ${report.scoreHalfB} | <b>Score Final:</b> ${report.scoreFinalA} - ${report.scoreFinalB}</p>
      <hr/>
      <h3>Résultats de l'évaluation</h3>
      <p><b>Note globale Arbitre:</b> ${report.calculatedRefereeScore} / 10</p>
      <p><b>Appréciation:</b> ${report.calculatedPerformanceFR} / ${report.calculatedPerformanceAR}</p>
      <hr/>
      <p><i>Fait par ${report.commissaireName} à ${report.citySignature} le ${report.dateSignature}</i></p>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + content], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report.code}_Rapport.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
