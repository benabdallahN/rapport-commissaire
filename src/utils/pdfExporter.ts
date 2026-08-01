import { FullReport, Language } from '../types';
import { jsPDF } from 'jspdf';
import { getPerformanceLabel } from './calculations';
import { getStoredDnaAxes } from '../data/dnaAxesData';
import { AMIRI_FONT_BASE64 } from '../assets/fonts/amiriFont';

function loadLogoImage(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/Logo.jpg';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const img2 = new Image();
      img2.src = 'Logo.jpg';
      img2.onload = () => resolve(img2);
      img2.onerror = () => resolve(null);
    };
  });
}

function loadHeaderBannerImage(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/Header.jpg';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const img2 = new Image();
      img2.src = '/HeaderBanner.jpg';
      img2.onload = () => resolve(img2);
      img2.onerror = () => resolve(null);
    };
  });
}

/**
 * Generate High-Resolution FTF Header Banner (French, Emblem, Arabic)
 * Identical to the official FTF Direction Nationale d'Arbitrage document header.
 */
function createFTFHeaderCanvasDataUrl(lang: Language = 'FR', logoImg?: HTMLImageElement | null, bannerImg?: HTMLImageElement | null): string | null {
  try {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1900;
    canvas.height = 920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Clear background (White)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1900, 920);

    if (bannerImg) {
      ctx.drawImage(bannerImg, 0, 0, 1900, 920);
      return canvas.toDataURL('image/png');
    }

    // ==========================================
    // LEFT COLUMN TEXT (FRENCH)
    // ==========================================
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000000';

    ctx.font = 'bold 32px Arial, Helvetica, sans-serif';
    ctx.fillText('FÉDÉRATION TUNISIENNE DE FOOTBALL', 0, 36);

    ctx.font = 'bold 26px Arial, Helvetica, sans-serif';
    ctx.fillText("DIRECTION NATIONALE D'ARBITRAGE", 0, 75);

    ctx.fillStyle = '#333333';
    ctx.font = 'italic 22px Arial, Helvetica, sans-serif';
    ctx.fillText("Stade Annexe d'El Menzah", 45, 125);
    ctx.fillText('Cité Olympique 1003 - Tunis', 28, 168);
    ctx.fillText('Tél : 71 948 291 / 71 948 031', 35, 210);
    ctx.fillText('Fax : 71 948 592', 90, 252);

    // ==========================================
    // CENTER COLUMN: OFFICIAL FTF EMBLEM / BADGE
    // ==========================================
    const centerX = 950;
    const centerY = 135;
    const outerRadius = 125;

    if (logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, centerX - outerRadius, centerY - outerRadius, outerRadius * 2, outerRadius * 2);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#c8102e';
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#c8102e';
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = "bold 26px Arial, sans-serif";
      ctx.fillText('TUNISIE', centerX, centerY - outerRadius + 38);

      const redRadius = 82;
      const redCenterY = centerY + 8;
      ctx.beginPath();
      ctx.arc(centerX, redCenterY, redRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#c8102e';
      ctx.fill();

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#ffffff';

      ctx.beginPath();
      ctx.moveTo(centerX - 10, redCenterY - 35);
      ctx.bezierCurveTo(centerX - 50, redCenterY - 65, centerX - 90, redCenterY - 60, centerX - 118, redCenterY - 55);
      ctx.bezierCurveTo(centerX - 112, redCenterY - 40, centerX - 98, redCenterY - 20, centerX - 82, redCenterY - 10);
      ctx.bezierCurveTo(centerX - 55, redCenterY - 5, centerX - 30, redCenterY - 10, centerX - 10, redCenterY - 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 10, redCenterY - 35);
      ctx.bezierCurveTo(centerX + 50, redCenterY - 65, centerX + 90, redCenterY - 60, centerX + 118, redCenterY - 55);
      ctx.bezierCurveTo(centerX + 112, redCenterY - 40, centerX + 98, redCenterY - 20, centerX + 82, redCenterY - 10);
      ctx.bezierCurveTo(centerX + 55, redCenterY - 5, centerX + 30, redCenterY - 10, centerX + 10, redCenterY - 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const flagRadius = 52;
      const flagCenterY = redCenterY + 22;

      ctx.beginPath();
      ctx.arc(centerX, flagCenterY, flagRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, flagCenterY, flagRadius - 4, 0, Math.PI * 2);
      ctx.fillStyle = '#c8102e';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, flagCenterY, flagRadius * 0.65, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX + 10, flagCenterY - 2, flagRadius * 0.52, 0, Math.PI * 2);
      ctx.fillStyle = '#c8102e';
      ctx.fill();

      const starX = centerX - 8;
      const starY = flagCenterY;
      ctx.beginPath();
      ctx.fillStyle = '#c8102e';
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = starX + Math.cos(angle) * 11;
        const y = starY + Math.sin(angle) * 11;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, redCenterY - 45, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - 10, redCenterY - 50);
      ctx.quadraticCurveTo(centerX - 24, redCenterY - 48, centerX - 20, redCenterY - 38);
      ctx.quadraticCurveTo(centerX - 10, redCenterY - 42, centerX - 8, redCenterY - 44);
      ctx.fillStyle = '#000000';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX - 4, redCenterY - 48, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = "bold 15px 'Arial Black', Arial, sans-serif";
      ctx.fillText('FÉDÉRATION TUNISIENNE DE FOOTBALL', centerX, centerY + outerRadius - 12);
    }

    // ==========================================
    // RIGHT COLUMN TEXT (ARABIC)
    // ==========================================
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000000';

    ctx.font = "bold 36px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText('الجامعة التونسية لكرة القدم', 1900, 36);

    ctx.font = "bold 31px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText('الإدارة الوطنية للتحكيم', 1900, 78);

    ctx.fillStyle = '#333333';
    ctx.font = "22px 'Segoe UI', Tahoma, Arial, sans-serif";
    ctx.fillText('الملعب الفرعي بالمنزه - الحي الأولمبي 1003 تونس', 1900, 128);
    ctx.fillText('(216+) 71 948 031 / (216+) 71 948 291 : الهاتف', 1900, 172);
    ctx.fillText('(216+) 71 948 592 : الفاكس', 1900, 216);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Error generating FTF header canvas:', err);
    return null;
  }
}

/**
 * FTF Official PDF Report Generator
 * Compliant with FTF (Fédération Tunisienne de Football) & DNA Standards
 */
export async function exportReportToPdf(report: FullReport, lang: Language = 'FR') {
  const [logoImg, bannerImg] = await Promise.all([
    loadLogoImage(),
    loadHeaderBannerImage()
  ]);
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const isAR = lang === 'AR';
  const perf = getPerformanceLabel(report.calculatedRefereeScore, lang);

  // Register Amiri font for Arabic PDF export
  try {
    doc.addFileToVFS('Amiri-Regular.ttf', AMIRI_FONT_BASE64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
  } catch (e) {
    console.warn('Could not register Amiri font:', e);
  }

  // Set font for Arabic mode
  if (isAR) {
    doc.setFont('Amiri', 'normal');
  } else {
    doc.setFont('helvetica', 'normal');
  }

  // Helper to process Arabic text using doc.processArabic
  function processAr(text: string): string {
    if (!text) return '';
    try {
      if (typeof (doc as any).processArabic === 'function') {
        return (doc as any).processArabic(text);
      }
    } catch (e) {
      console.warn('Error processing Arabic text:', e);
    }
    return text;
  }

  // Helper to set font family depending on language
  function setPdfFont(fontStyle: 'normal' | 'bold' | 'italic' = 'normal') {
    if (isAR) {
      doc.setFont('Amiri', 'normal');
    } else {
      doc.setFont('helvetica', fontStyle);
    }
  }

  // Helper to write text with processArabic applied in Arabic mode
  function writeText(text: string, x: number, y: number, options?: any) {
    if (isAR) {
      doc.setFont('Amiri', 'normal');
      const processed = processAr(text);
      doc.text(processed, x, y, options);
    } else {
      doc.text(text, x, y, options);
    }
  }

  // Active DNA Axes
  const activeAxes = report.axesSnapshot && report.axesSnapshot.length > 0
    ? report.axesSnapshot.filter((a) => a.isActive).sort((a, b) => a.displayOrder - b.displayOrder)
    : getStoredDnaAxes().filter((a) => a.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

  let currentY = 8;
  const pageHeight = 297;
  const marginBottom = 20;
  const printableMaxY = pageHeight - marginBottom;

  // Check Page Break helper
  function checkPageBreak(neededHeight: number) {
    if (currentY + neededHeight > printableMaxY) {
      doc.addPage();
      currentY = 15;
      drawSubsequentHeader();
      currentY += 12;
    }
  }

  // Draw Header on Subsequent Pages
  function drawSubsequentHeader() {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(10, 8, 190, 7, 'F');
    doc.setTextColor(255, 255, 255);
    setPdfFont('bold');
    doc.setFontSize(8);
    if (isAR) {
      writeText('الجامعة التونسية لكرة القدم — DNA', 14, 12.5);
      const teamStr = `${report.teamAAbbr || report.teamA} ضد ${report.teamBAbbr || report.teamB}`;
      writeText(`تقرير ${report.code} | مباراة : ${teamStr}`, 196, 12.5, { align: 'right' });
    } else {
      doc.text('FÉDÉRATION TUNISIENNE DE FOOTBALL — DNA', 14, 12.5);
      const teamStr = `${report.teamAAbbr || report.teamA} vs ${report.teamBAbbr || report.teamB}`;
      doc.text(`Rapport ${report.code} | Match : ${teamStr}`, 196, 12.5, { align: 'right' });
    }
    doc.setDrawColor(200, 16, 46);
    doc.setLineWidth(0.5);
    doc.line(10, 15, 200, 15);
  }

  // Helper for Wrapped Text printing
  function printWrappedText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 13,
    fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
    textColor: [number, number, number] = [30, 41, 59]
  ): number {
    setPdfFont(fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...textColor);

    if (isAR) {
      doc.setFont('Amiri', 'normal');
      const processed = processAr(text);
      const lines = doc.splitTextToSize(processed, maxWidth);
      const lineHeight = fontSize * 0.42;
      lines.forEach((line: string, idx: number) => {
        doc.text(line, x, y + idx * lineHeight);
      });
      return lines.length * lineHeight;
    } else {
      const lines = doc.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.42;
      lines.forEach((line: string, idx: number) => {
        doc.text(line, x, y + idx * lineHeight);
      });
      return lines.length * lineHeight;
    }
  }

  // Sanitize String to prevent any weird garbage characters
  function cleanStr(str: string): string {
    if (!str) return '';
    return str.replace(/[\u00FE\u00FE\u00FD\u00FC\u00FB]/g, '').trim();
  }

  // =========================================================================
  // PAGE 1: EN-TÊTE OFFICIEL DE LA FÉDÉRATION TUNISIENNE DE FOOTBALL
  // =========================================================================
  const headerImage = createFTFHeaderCanvasDataUrl(lang, logoImg, bannerImg);

  if (headerImage) {
    doc.addImage(headerImage, 'PNG', 10, currentY, 190, 62);
    currentY += 34;
  } else {
    // Fallback vector drawing if canvas fails
    doc.setTextColor(15, 23, 42);
    setPdfFont('bold');
    doc.setFontSize(12);
    if (isAR) {
      writeText('الجامعة التونسية لكرة القدم', 10, currentY + 5);
      doc.setFontSize(10);
      writeText('الإدارة الوطنية للتحكيم', 10, currentY + 10);
    } else {
      doc.text('FÉDÉRATION TUNISIENNE DE FOOTBALL', 10, currentY + 5);
      doc.setFontSize(10);
      doc.text("DIRECTION NATIONALE D'ARBITRAGE", 10, currentY + 10);
    }
    currentY += 20;
  }

  // Divider Line
  doc.setDrawColor(200, 16, 46); // FTF Red
  doc.setLineWidth(0.8);
  doc.line(10, currentY, 200, currentY);

  currentY += 6;

  // =========================================================================
  // TITRE DU RAPPORT
  // =========================================================================
  const teamAAbbr = cleanStr(report.teamAAbbr) || cleanStr(report.teamA);
  const teamBAbbr = cleanStr(report.teamBAbbr) || cleanStr(report.teamB);

  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(5, currentY, 200, 12, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  setPdfFont('bold');
  doc.setFontSize(13);
  const titleText = isAR
    ? `تقرير مقيم الحكام – مباراة : ${teamAAbbr} ضد ${teamBAbbr}`
    : `RAPPORT COMMISSAIRE – Match : ${teamAAbbr} vs ${teamBAbbr}`;

  writeText(
    titleText,
    104,
    currentY + 8,
    { align: 'center' }
  );

  currentY += 17;

  // =========================================================================
  // 1. INFORMATIONS GÉNÉRALES DU MATCH
  // =========================================================================
  checkPageBreak(50);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(10, currentY, 188, 48, 2, 2, 'FD');

  doc.setFillColor(226, 232, 240);
  doc.rect(10, currentY, 188, 7, 'F');
  doc.setTextColor(15, 23, 42);
  setPdfFont('bold');
  doc.setFontSize(11);
  writeText(
    isAR ? '1. معلومات المباراة العامة' : '1. Informations Générales du Match',
    14,
    currentY + 5
  );

  let infoY = currentY + 13;

  // Line 1: Teams & Score
  doc.setFontSize(10);
  setPdfFont('bold');
  doc.setTextColor(15, 23, 42);
  if (isAR) {
    writeText(
      `الفريق المستضيف : ${cleanStr(report.teamA)}  [ ${report.scoreFinalA} - ${report.scoreFinalB} ]  الفريق الضيف : ${cleanStr(report.teamB)}`,
      14,
      infoY
    );
  } else {
    doc.text(
      `Équipe Recevante : ${cleanStr(report.teamA)}  [ ${report.scoreFinalA} - ${report.scoreFinalB} ]  Équipe Visiteuse : ${cleanStr(report.teamB)}`,
      14,
      infoY
    );
  }

  infoY += 7;

  // Line 2: Half Time & Season & Competition
  doc.setFontSize(10);
  setPdfFont('normal');
  doc.setTextColor(30, 41, 59);
  if (isAR) {
    writeText(`الموسم : ${report.season}   |   المسابقة : ${report.competition}   |   الجولة : ${report.matchDay}`, 14, infoY);
    writeText(`(الشوط الأول : ${report.scoreHalfA} - ${report.scoreHalfB})`, 140, infoY);
  } else {
    doc.text(`Saison : ${report.season}   |   Compétition : ${report.competition}   |   Journée : ${report.matchDay}`, 14, infoY);
    doc.text(`(Score Mi-Temps : ${report.scoreHalfA} - ${report.scoreHalfB})`, 140, infoY);
  }

  infoY += 6;

  // Line 3: Date, Time & Location
  if (isAR) {
    writeText(`التاريخ والوقت : ${report.matchDate} على الساعة ${report.matchTime}`, 14, infoY);
    writeText(`الملعب / المدينة : ${cleanStr(report.stadium)} (${cleanStr(report.city)})`, 110, infoY);
  } else {
    doc.text(`Date & Heure : ${report.matchDate} à ${report.matchTime}`, 14, infoY);
    doc.text(`Stade / Ville : ${cleanStr(report.stadium)} (${cleanStr(report.city)})`, 110, infoY);
  }

  infoY += 6;

  // Line 4: Difficulty Level & Commissaire
  const diffTxtFR = report.difficultyLevel === 'ELEVEE' ? 'Élevée' : report.difficultyLevel === 'FACILE' ? 'Facile' : 'Moyenne';
  const diffTxtAR = report.difficultyLevel === 'ELEVEE' ? 'صعبة' : report.difficultyLevel === 'FACILE' ? 'سهلة' : 'متوسطة';

  if (isAR) {
    writeText(`مستوى الصعوبة : ${diffTxtAR}`, 14, infoY);
    writeText(`رقم التقرير : ${report.code}`, 110, infoY);
  } else {
    doc.text(`Niveau de Difficulté : ${diffTxtFR}`, 14, infoY);
    doc.text(`Rapport N° : ${report.code}`, 110, infoY);
  }

  infoY += 6;

  // Line 5: Commissaires
  setPdfFont('bold');
  if (isAR) {
    writeText(`مقيم الحكام : ${cleanStr(report.commissaireName)}`, 14, infoY);
    if (report.isJointEvaluation && report.secondCommissaireName) {
      writeText(`| المقيم المشارك : ${cleanStr(report.secondCommissaireName)}`, 110, infoY);
    }
  } else {
    doc.text(`Commissaire : ${cleanStr(report.commissaireName)}`, 14, infoY);
    if (report.isJointEvaluation && report.secondCommissaireName) {
      doc.text(`| Co-Commissaire : ${cleanStr(report.secondCommissaireName)}`, 110, infoY);
    }
  }

  currentY += 52;

  // =========================================================================
  // 2. OFFICIELS DE LA RENCONTRE
  // =========================================================================
  checkPageBreak(42);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(10, currentY, 188, 40, 2, 2, 'FD');

  doc.setFillColor(241, 245, 249);
  doc.rect(10, currentY, 188, 7, 'F');
  doc.setTextColor(15, 23, 42);
  setPdfFont('bold');
  doc.setFontSize(11);
  writeText(
    isAR ? '2. طاقم تحكيم المباراة' : '2. Officiels de la Rencontre',
    14,
    currentY + 5
  );

  let offY = currentY + 13;

  const rolesOrdered = isAR ? [
    { key: 'REFEREE', label: 'حكم ساحة' },
    { key: 'ASSISTANT_1', label: 'حكم مساعد 1' },
    { key: 'ASSISTANT_2', label: 'حكم مساعد 2' },
    { key: 'FOURTH', label: 'الحكم الرابع' },
    { key: 'VAR', label: 'حكم الفيديو (VAR)' },
    { key: 'AVAR', label: 'مساعد حكم الفيديو (AVAR)' },
  ] : [
    { key: 'REFEREE', label: 'Arbitre Central' },
    { key: 'ASSISTANT_1', label: 'Arbitre Assistant n°1' },
    { key: 'ASSISTANT_2', label: 'Arbitre Assistant n°2' },
    { key: 'FOURTH', label: 'Quatrième Officiel' },
    { key: 'VAR', label: 'Arbitre VAR' },
    { key: 'AVAR', label: 'Assistant VAR' },
  ];

  rolesOrdered.forEach((roleItem, idx) => {
    const official = report.officials.find((o) => o.role === roleItem.key);
    const xPos = idx % 2 === 0 ? 14 : 105;

    setPdfFont('bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    writeText(`${roleItem.label} : `, xPos, offY);

    setPdfFont('normal');
    const offName = isAR ? (official?.nameAR || official?.name) : (official?.name || official?.nameAR);
    if (official && offName) {
      writeText(`${cleanStr(offName)} (${official.league || '-'}, ${official.grade || '-'})`, xPos + 48, offY);
    } else {
      doc.setTextColor(148, 163, 184);
      writeText(isAR ? 'غير معين' : 'Non désigné', xPos + 48, offY);
    }

    if (idx % 2 === 1 || idx === rolesOrdered.length - 1) {
      offY += 6;
    }
  });

  currentY += 44;

  // =========================================================================
  // 3. DÉTAILS DES ÉVALUATIONS – ARBITRE CENTRAL
  // =========================================================================
  checkPageBreak(22);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(10, currentY, 188, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  setPdfFont('bold');
  doc.setFontSize(11);
  writeText(
    isAR ? '3. تفاصيل التقييمات – حكم الساحة' : '3. DÉTAILS DES ÉVALUATIONS – Arbitre central',
    14,
    currentY + 5.5
  );

  currentY += 12;

  activeAxes.forEach((axis, idx) => {
    const evalData = report.evaluations[axis.id] || report.evaluations[axis.code.toLowerCase()] || {
      score: 8.0,
      positiveAspects: [],
      improvementPoints: [],
      comments: '',
    };

    const hasPositives = evalData.positiveAspects && evalData.positiveAspects.length > 0;
    const hasImprovements = evalData.improvementPoints && evalData.improvementPoints.length > 0;
    const hasComments = !!evalData.comments;

    let boxHeight = 16;
    if (hasPositives) boxHeight += evalData.positiveAspects.length * 6 + 4;
    if (hasImprovements) boxHeight += evalData.improvementPoints.length * 6 + 4;
    if (hasComments) boxHeight += 12;

    checkPageBreak(boxHeight + 4);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(10, currentY, 188, boxHeight, 2, 2, 'FD');

    // Axis Subheader
    doc.setFillColor(241, 245, 249);
    doc.rect(10, currentY, 188, 7, 'F');

    setPdfFont('bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    const axisTitle = isAR ? (axis.titleAR || axis.titleFR) : axis.titleFR;
    writeText(`${idx + 1}. ${axisTitle}`, 14, currentY + 5);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    writeText(isAR ? `(المعامل : x${axis.coefficient})` : `(Coef : x${axis.coefficient})`, 95, currentY + 5);

    doc.setFontSize(11);
    setPdfFont('bold');
    doc.setTextColor(180, 83, 9);
    writeText(isAR ? `العدد : ${evalData.score.toFixed(1)} / 10` : `Note : ${evalData.score.toFixed(1)} / 10`, 165, currentY + 5);

    let itemY = currentY + 12;

    // Positive Aspects
    if (hasPositives) {
      setPdfFont('bold');
      doc.setFontSize(9.5);
      doc.setTextColor(16, 185, 129); // Emerald
      writeText(isAR ? '  + النقاط الإيجابية :' : '  + Aspects Positifs :', 14, itemY);
      itemY += 5;

      evalData.positiveAspects.forEach((obs) => {
        const text = isAR ? (obs.textAR || obs.textFR) : obs.textFR;
        const minStr = obs.minute ? (isAR ? ` (د ${obs.minute})` : ` (Min ${obs.minute}')`) : '';
        itemY += printWrappedText(
          `     • ${cleanStr(text)}${minStr}`,
          18,
          itemY,
          175,
          13,
          'normal',
          [30, 41, 59]
        );
      });
      itemY += 2;
    }

    // Improvement Points
    if (hasImprovements) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(225, 29, 72); // Rose
      writeText(isAR ? '  - نقاط التحسين :' : '  - Points à Améliorer :', 14, itemY);
      itemY += 5;

      evalData.improvementPoints.forEach((obs) => {
        const text = isAR ? (obs.textAR || obs.textFR) : obs.textFR;
        const minStr = obs.minute ? (isAR ? ` (د ${obs.minute})` : ` (Min ${obs.minute}')`) : '';
        itemY += printWrappedText(
          `     • ${cleanStr(text)}${minStr}`,
          18,
          itemY,
          175,
          13,
          'normal',
          [30, 41, 59]
        );
      });
      itemY += 2;
    }

    // Comments
    if (hasComments) {
      setPdfFont('bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      writeText(isAR ? '  ملاحظات وتوصيات :' : '  Observations & Remarques :', 14, itemY);
      itemY += 5;

      itemY += printWrappedText(
        cleanStr(evalData.comments),
        18,
        itemY,
        175,
        13,
        'italic',
        [71, 85, 105]
      );
    }

    currentY += boxHeight + 5;
  });

  // =========================================================================
  // 4. DÉTAILS DES ÉVALUATIONS – ARBITRE ASSISTANT N°1
  // =========================================================================
  const ast1Off = report.officials.find((o) => o.role === 'ASSISTANT_1');
  const ast1Eval = report.evaluations.assistant1;

  if (ast1Eval) {
    checkPageBreak(25);

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(10, currentY, 188, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    setPdfFont('bold');
    doc.setFontSize(11);
    writeText(
      isAR ? '4. تفاصيل التقييمات – الحكم المساعد الأول' : '4. DÉTAILS DES ÉVALUATIONS – Arbitre assistant n°1',
      14,
      currentY + 5.5
    );

    currentY += 12;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(10, currentY, 188, 20, 2, 2, 'FD');

    setPdfFont('bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    const ast1Name = isAR ? (ast1Off?.nameAR || ast1Off?.name) : ast1Off?.name;
    const nameStr = ast1Name ? cleanStr(ast1Name) : (isAR ? 'غير محدد' : 'Non spécifié');
    writeText(
      isAR ? `الاسم : ${nameStr} (${ast1Off?.league || '-'})` : `Nom : ${nameStr} (${ast1Off?.league || '-'})`,
      14,
      currentY + 6
    );

    doc.setTextColor(180, 83, 9);
    writeText(
      isAR ? `العدد النهائي : ${ast1Eval.score.toFixed(1)} / 10` : `Note Finale : ${ast1Eval.score.toFixed(1)} / 10`,
      155,
      currentY + 6
    );

    if (ast1Eval.comments) {
      printWrappedText(
        isAR ? `ملاحظات : ${cleanStr(ast1Eval.comments)}` : `Observations : ${cleanStr(ast1Eval.comments)}`,
        14,
        currentY + 12,
        180,
        13,
        'normal',
        [71, 85, 105]
      );
    } else {
      doc.setFontSize(13);
      setPdfFont('italic');
      doc.setTextColor(100, 116, 139);
      writeText(
        isAR ? 'أداء مطابق للشروط والقوانين بدون ملاحظات رئيسية.' : 'Prestation conforme aux exigences réglementaires sans remarque majeure.',
        14,
        currentY + 13
      );
    }

    currentY += 24;
  }

  // =========================================================================
  // 5. DÉTAILS DES ÉVALUATIONS – ARBITRE ASSISTANT N°2
  // =========================================================================
  const ast2Off = report.officials.find((o) => o.role === 'ASSISTANT_2');
  const ast2Eval = report.evaluations.assistant2;

  if (ast2Eval) {
    checkPageBreak(25);

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(10, currentY, 188, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    setPdfFont('bold');
    doc.setFontSize(11);
    writeText(
      isAR ? '5. تفاصيل التقييمات – الحكم المساعد الثاني' : '5. DÉTAILS DES ÉVALUATIONS – Arbitre assistant n°2',
      14,
      currentY + 5.5
    );

    currentY += 12;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(10, currentY, 188, 20, 2, 2, 'FD');

    setPdfFont('bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    const ast2Name = isAR ? (ast2Off?.nameAR || ast2Off?.name) : ast2Off?.name;
    const nameStr = ast2Name ? cleanStr(ast2Name) : (isAR ? 'غير محدد' : 'Non spécifié');
    writeText(
      isAR ? `الاسم : ${nameStr} (${ast2Off?.league || '-'})` : `Nom : ${nameStr} (${ast2Off?.league || '-'})`,
      14,
      currentY + 6
    );

    doc.setTextColor(180, 83, 9);
    writeText(
      isAR ? `العدد النهائي : ${ast2Eval.score.toFixed(1)} / 10` : `Note Finale : ${ast2Eval.score.toFixed(1)} / 10`,
      155,
      currentY + 6
    );

    if (ast2Eval.comments) {
      printWrappedText(
        isAR ? `ملاحظات : ${cleanStr(ast2Eval.comments)}` : `Observations : ${cleanStr(ast2Eval.comments)}`,
        14,
        currentY + 12,
        180,
        13,
        'normal',
        [71, 85, 105]
      );
    } else {
      doc.setFontSize(13);
      setPdfFont('italic');
      doc.setTextColor(100, 116, 139);
      writeText(
        isAR ? 'أداء مطابق للشروط والقوانين بدون ملاحظات رئيسية.' : 'Prestation conforme aux exigences réglementaires sans remarque majeure.',
        14,
        currentY + 13
      );
    }

    currentY += 24;
  }

  // =========================================================================
  // 6. DÉTAILS DES ÉVALUATIONS – QUATRIÈME OFFICIEL
  // =========================================================================
  const fourthOff = report.officials.find((o) => o.role === 'FOURTH');
  const fourthEval = report.evaluations.fourthOfficial;

  if (fourthEval && fourthEval.score) {
    checkPageBreak(25);

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(10, currentY, 188, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    setPdfFont('bold');
    doc.setFontSize(11);
    writeText(
      isAR ? '6. تفاصيل التقييمات – الحكم الرابع' : '6. DÉTAILS DES ÉVALUATIONS – Quatrième officiel',
      14,
      currentY + 5.5
    );

    currentY += 12;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(10, currentY, 188, 20, 2, 2, 'FD');

    setPdfFont('bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    const fourthName = isAR ? (fourthOff?.nameAR || fourthOff?.name) : fourthOff?.name;
    const nameStr = fourthName ? cleanStr(fourthName) : (isAR ? 'غير محدد' : 'Non spécifié');
    writeText(
      isAR ? `الاسم : ${nameStr} (${fourthOff?.league || '-'})` : `Nom : ${nameStr} (${fourthOff?.league || '-'})`,
      14,
      currentY + 6
    );

    doc.setTextColor(180, 83, 9);
    writeText(
      isAR ? `العدد النهائي : ${fourthEval.score.toFixed(1)} / 10` : `Note Finale : ${fourthEval.score.toFixed(1)} / 10`,
      155,
      currentY + 6
    );

    if (fourthEval.comments) {
      printWrappedText(
        isAR ? `ملاحظات : ${cleanStr(fourthEval.comments)}` : `Observations : ${cleanStr(fourthEval.comments)}`,
        14,
        currentY + 12,
        180,
        13,
        'normal',
        [71, 85, 105]
      );
    } else {
      doc.setFontSize(13);
      setPdfFont('italic');
      doc.setTextColor(100, 116, 139);
      writeText(
        isAR ? 'إدارة دكة الاحتياط والتغييرات تمت بنجاح وبشكل ممتاز.' : 'Gestion du banc de touche et remplacements parfaitement exécutés.',
        14,
        currentY + 13
      );
    }

    currentY += 24;
  }

  // =========================================================================
  // 7. COMMENTAIRES GÉNÉRAUX & SYNTHÈSE GLOBALE DU MATCH
  // =========================================================================
  checkPageBreak(30);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(10, currentY, 188, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  setPdfFont('bold');
  doc.setFontSize(11);
  writeText(
    isAR ? '7. الملاحظات العامة والخلاصة الشاملة للمباراة' : '7. Commentaires généraux & Synthèse globale du match',
    14,
    currentY + 5.5
  );

  currentY += 12;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(10, currentY, 188, 22, 2, 2, 'FD');

  const defaultComment = isAR ? 'لا توجد ملاحظات إضافية مسجلة من قبل المقيم.' : 'Aucun commentaire complémentaire renseigné par le commissaire.';
  const genComments = cleanStr(report.generalComments) || defaultComment;

  printWrappedText(
    genComments,
    14,
    currentY + 6,
    180,
    13,
    'normal',
    [30, 41, 59]
  );

  currentY += 26;

  // =========================================================================
  // 8. RÉCAPITULATIF DES NOTES & ÉVALUATIONS
  // =========================================================================
  checkPageBreak(38);

  doc.setFillColor(254, 243, 199); // Amber tint
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(10, currentY, 188, 32, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  setPdfFont('bold');
  doc.setFontSize(12);
  writeText(
    isAR ? '8. ملخص الأعداد والتقييمات' : '8. Récapitulatif des Notes & Évaluations',
    14,
    currentY + 7
  );

  // Final Scores
  doc.setFontSize(13);
  doc.setTextColor(180, 83, 9);
  writeText(
    isAR ? `العدد النهائي لحكم الساحة : ${report.calculatedRefereeScore.toFixed(2)} / 10.0` : `NOTE FINALE ARBITRE CENTRAL : ${report.calculatedRefereeScore.toFixed(2)} / 10.0`,
    14,
    currentY + 15
  );

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  const perfLabel = isAR ? perf.textAR : perf.textFR;
  writeText(
    isAR ? `التقييم العام : ${perfLabel}` : `Appréciation Globale : ${perfLabel}`,
    14,
    currentY + 22
  );

  // Practical Exam Mention
  const refExam = report.practicalExams?.referee;
  if (refExam && refExam.isExam) {
    doc.setFontSize(10);
    setPdfFont('bold');
    doc.setTextColor(30, 58, 138); // Blue
    writeText(
      isAR ? `امتحان عملي : نعم — المستوى : ${refExam.examLevel || 'امتحان فدرالي'}` : `Mention Examen Pratique : OUI — Niveau : ${refExam.examLevel || 'Examen Fédéral'}`,
      14,
      currentY + 28
    );
  } else {
    doc.setFontSize(9);
    setPdfFont('normal');
    doc.setTextColor(100, 116, 139);
    writeText(
      isAR ? 'امتحان عملي : غير مدرج لهذه المباراة' : 'Mention Examen Pratique : Non applicable pour cette rencontre',
      14,
      currentY + 28
    );
  }

  currentY += 36;

  // =========================================================================
  // 9. FAITS DE MATCH
  // =========================================================================
  checkPageBreak(35);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(10, currentY, 188, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  setPdfFont('bold');
  doc.setFontSize(11);
  writeText(
    isAR ? '9. أحداث المباراة' : '9. Faits de match',
    14,
    currentY + 5.5
  );

  currentY += 12;

  // 9A. Remplacements / Substitutions
  if (report.substitutions && report.substitutions.length > 0) {
    checkPageBreak(12 + report.substitutions.length * 6);

    setPdfFont('bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    writeText(isAR ? '• التغييرات :' : '• Remplacements :', 14, currentY);

    currentY += 4;

    report.substitutions.forEach((sub) => {
      const teamName = sub.team === 'A' ? teamAAbbr : teamBAbbr;
      setPdfFont('normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      if (isAR) {
        writeText(
          `   د ${sub.minute}' - [${teamName}] دخول : ${cleanStr(sub.playerIn)}  <==>  خروج : ${cleanStr(sub.playerOut)}`,
          14,
          currentY
        );
      } else {
        doc.text(
          `   Min ${sub.minute}' - [${teamName}] Entrée : ${cleanStr(sub.playerIn)}  <==>  Sortie : ${cleanStr(sub.playerOut)}`,
          14,
          currentY
        );
      }
      currentY += 5;
    });

    currentY += 3;
  }

  // 9B. Disciplinary Cards
  if (report.cards && report.cards.length > 0) {
    checkPageBreak(15 + report.cards.length * 6);

    setPdfFont('bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    writeText(isAR ? '• البطاقات الصفراء والحمراء :' : '• Cartons Jaunes & Rouges :', 14, currentY);

    currentY += 5;

    doc.setFillColor(241, 245, 249);
    doc.rect(14, currentY, 180, 6, 'F');
    setPdfFont('bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    if (isAR) {
      writeText('الدقيقة', 17, currentY + 4.5);
      writeText('الفريق', 30, currentY + 4.5);
      writeText('اللاعب', 52, currentY + 4.5);
      writeText('العقوبة', 105, currentY + 4.5);
      writeText('السبب / الوصف', 140, currentY + 4.5);
    } else {
      doc.text('Min', 17, currentY + 4.5);
      doc.text('Équipe', 30, currentY + 4.5);
      doc.text('Joueur', 52, currentY + 4.5);
      doc.text('Sanction', 105, currentY + 4.5);
      doc.text('Motif / Description', 140, currentY + 4.5);
    }

    currentY += 7;

    report.cards.forEach((card, cIdx) => {
      setPdfFont('normal');
      doc.setFontSize(8.5);

      const teamName = card.team === 'A' ? teamAAbbr : teamBAbbr;
      const typeText = isAR
        ? (card.cardType === 'YELLOW' ? 'بطاقة صفراء' : card.cardType === 'RED' ? 'بطاقة حمراء مباشرة' : 'صفراء ثانية (حمراء)')
        : (card.cardType === 'YELLOW' ? 'Carton Jaune' : card.cardType === 'RED' ? 'Carton Rouge Direct' : '2ème Jaune (Rouge)');

      if (cIdx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY - 1, 180, 6, 'F');
      }

      if (isAR) {
        writeText(`${card.minute}'`, 17, currentY + 3.5);
        writeText(teamName, 30, currentY + 3.5);
        writeText(`N°${card.playerNumber} ${cleanStr(card.playerName || '')}`, 52, currentY + 3.5);
        writeText(typeText, 105, currentY + 3.5);
        writeText(cleanStr(card.reason) || 'خطأ لعب', 140, currentY + 3.5);
      } else {
        doc.text(`${card.minute}'`, 17, currentY + 3.5);
        doc.text(teamName, 30, currentY + 3.5);
        doc.text(`N°${card.playerNumber} ${cleanStr(card.playerName || '')}`, 52, currentY + 3.5);
        doc.text(typeText, 105, currentY + 3.5);
        doc.text(cleanStr(card.reason) || 'Faute de jeu', 140, currentY + 3.5);
      }

      currentY += 6;
    });

    currentY += 4;
  }

  // 9C. Staff Incidents
  if (report.staffIncidents && report.staffIncidents.length > 0) {
    checkPageBreak(12 + report.staffIncidents.length * 5);

    setPdfFont('bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    writeText(
      isAR ? '• مخالفات مسؤولي الفرق (دكة الاحتياط) :' : '• Infractions des Officiels d\'Équipe (Banc de touche) :',
      14,
      currentY
    );

    currentY += 4;

    report.staffIncidents.forEach((stf) => {
      const teamName = stf.team === 'A' ? teamAAbbr : teamBAbbr;
      setPdfFont('normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const minPrefix = isAR ? `د ${stf.minute}'` : `Min ${stf.minute}'`;
      if (isAR) {
        writeText(
          `   ${minPrefix} - [${teamName}] ${cleanStr(stf.name)} : ${stf.sanction} (${cleanStr(stf.reason)})`,
          14,
          currentY
        );
      } else {
        doc.text(
          `   ${minPrefix} - [${teamName}] ${cleanStr(stf.name)} : ${stf.sanction} (${cleanStr(stf.reason)})`,
          14,
          currentY
        );
      }
      currentY += 5;
    });

    currentY += 3;
  }

  // 9D. Crowd Incidents
  if (report.crowdIncidents && report.crowdIncidents.length > 0) {
    checkPageBreak(12 + report.crowdIncidents.length * 5);

    setPdfFont('bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    writeText(
      isAR ? '• أحداث الجمهور / المدرجات :' : '• Incidents du Public / Gradins :',
      14,
      currentY
    );

    currentY += 4;

    report.crowdIncidents.forEach((crd) => {
      const minStr = crd.minute ? (isAR ? `د ${crd.minute}' - ` : `Min ${crd.minute}' - `) : '';
      setPdfFont('normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      if (isAR) {
        writeText(
          `   • ${minStr}[الخطورة : ${crd.severity}] ${cleanStr(crd.description)}`,
          14,
          currentY
        );
      } else {
        doc.text(
          `   • ${minStr}[Gravité : ${crd.severity}] ${cleanStr(crd.description)}`,
          14,
          currentY
        );
      }
      currentY += 5;
    });

    currentY += 3;
  }

  if (
    (!report.substitutions || report.substitutions.length === 0) &&
    (!report.cards || report.cards.length === 0) &&
    (!report.staffIncidents || report.staffIncidents.length === 0) &&
    (!report.crowdIncidents || report.crowdIncidents.length === 0)
  ) {
    doc.setFontSize(13);
    setPdfFont('italic');
    doc.setTextColor(100, 116, 139);
    writeText(
      isAR ? 'لا توجد أحداث خاصة أو حوادث تذكر خلال هذه المباراة.' : 'Aucun fait de match particulier ou incident à signaler pour cette rencontre.',
      14,
      currentY
    );
    currentY += 8;
  }

  // =========================================================================
  // 10. VALIDATION ET SIGNATURE
  // =========================================================================
  checkPageBreak(40);

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(10, currentY, 188, 36, 2, 2, 'FD');

  setPdfFont('bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  writeText(
    isAR ? '10. المصادقة والتوقيع' : '10. Validation et Signature',
    14,
    currentY + 6
  );

  doc.setFontSize(9);
  setPdfFont('normal');
  const statusStr = report.status === 'VALIDATED'
    ? (isAR ? 'مصادق عليه رسمياً' : 'VALIDÉ OFFICIELLEMENT')
    : (isAR ? 'مسودة' : 'BROUILLON');

  if (isAR) {
    writeText(`اسم مقيم الحكام : ${cleanStr(report.commissaireName)}`, 14, currentY + 13);
    writeText(`تاريخ ووقت المصادقة : ${report.dateSignature || report.matchDate}`, 14, currentY + 18);
    writeText(`حالة التقرير : ${statusStr}`, 14, currentY + 23);
    writeText(`البريد الإلكتروني الرسمي : ${cleanStr(report.commissaireEmail)}`, 14, currentY + 28);
  } else {
    doc.text(`Nom du Commissaire : ${cleanStr(report.commissaireName)}`, 14, currentY + 13);
    doc.text(`Date & Heure de validation : ${report.dateSignature || report.matchDate}`, 14, currentY + 18);
    doc.text(`Statut du Rapport : ${statusStr}`, 14, currentY + 23);
    doc.text(`Email Officiel : ${cleanStr(report.commissaireEmail)}`, 14, currentY + 28);
  }

  // Digital Signature Image or Official Seal
  if (report.signatureDataUrl) {
    try {
      doc.addImage(report.signatureDataUrl, 'PNG', 130, currentY + 8, 40, 20);
    } catch {
      doc.setDrawColor(200, 16, 46);
      doc.roundedRect(125, currentY + 8, 65, 22, 2, 2, 'D');
      setPdfFont('bold');
      doc.setFontSize(8);
      doc.setTextColor(200, 16, 46);
      writeText(
        isAR ? 'توقيع رقمي معتمد' : 'SIGNATURE NUMÉRIQUE CERTIFIÉE',
        157.5,
        currentY + 15,
        { align: 'center' }
      );
      writeText(
        isAR ? 'الجامعة التونسية لكرة القدم' : 'FÉDÉRATION TUNISIENNE DE FOOTBALL',
        157.5,
        currentY + 20,
        { align: 'center' }
      );
    }
  } else {
    doc.setDrawColor(200, 16, 46);
    doc.roundedRect(125, currentY + 8, 65, 22, 2, 2, 'D');
    setPdfFont('bold');
    doc.setFontSize(8);
    doc.setTextColor(200, 16, 46);
    writeText(
      isAR ? 'ختم وتوقيع المقيم' : 'CACHET ET SIGNATURE DU COMMISSAIRE',
      157.5,
      currentY + 15,
      { align: 'center' }
    );
    setPdfFont('normal');
    doc.setFontSize(7);
    writeText(
      isAR ? 'وثيقة محولة للإدارة الوطنية للتحكيم' : 'Document transmis à la DNA',
      157.5,
      currentY + 20,
      { align: 'center' }
    );
  }

  // =========================================================================
  // FOOTER & PAGINATION AUTOMATIQUE SUR TOUTES LES PAGES
  // =========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(10, 283, 200, 283);

    setPdfFont('normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);

    if (isAR) {
      writeText(
        'الجامعة التونسية لكرة القدم — الإدارة الوطنية للتحكيم (DNA)',
        10,
        287
      );
      writeText(
        `صفحة ${i} من ${totalPages}`,
        200,
        287,
        { align: 'right' }
      );
    } else {
      doc.text(
        'Fédération Tunisienne de Football — Direction Nationale d\'Arbitrage (DNA)',
        10,
        287
      );
      doc.text(
        `Page ${i} sur ${totalPages}`,
        200,
        287,
        { align: 'right' }
      );
    }
  }

  // Download PDF file
  doc.save(`${report.code}_Rapport_Commissaire_FTF.pdf`);
}
