export interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  webViewLink: string;
  reportCode: string;
}

export const GOOGLE_DRIVE_ACCOUNT = 'assesseurstunisie@gmail.com';
export const GOOGLE_DRIVE_FOLDER = '/FTF_DNA_Rapports_2025_2026/';

export const INITIAL_DRIVE_FILES: DriveFileMetadata[] = [
  {
    id: 'file_sousse_001',
    name: 'Rapport_RAP-2026-001_ESS_EST.pdf',
    mimeType: 'application/pdf',
    size: '1.2 MB',
    createdTime: '2026-03-15T18:30:00Z',
    webViewLink: 'https://drive.google.com/file/d/rapport_sousse_001/view',
    reportCode: 'RAP-2026-001',
  },
  {
    id: 'file_rades_002',
    name: 'Rapport_RAP-2026-002_CA_ST.pdf',
    mimeType: 'application/pdf',
    size: '980 KB',
    createdTime: '2026-03-16T17:15:00Z',
    webViewLink: 'https://drive.google.com/file/d/rapport_rades_002/view',
    reportCode: 'RAP-2026-002',
  },
];

export const simulateDriveUpload = (reportCode: string, reportTitle: string): DriveFileMetadata => {
  const fileId = `drive_${Date.now()}`;
  return {
    id: fileId,
    name: `Rapport_${reportCode}_${reportTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
    mimeType: 'application/pdf',
    size: '1.1 MB',
    createdTime: new Date().toISOString(),
    webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
    reportCode,
  };
};
