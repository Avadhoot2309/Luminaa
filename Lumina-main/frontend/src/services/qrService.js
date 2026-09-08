/**
 * QR SERVICE
 * Generates and parses QR codes for student login.
 */

import QRCode from 'qrcode';

/**
 * Generates the raw QR data string for Lumina login.
 * Uses current web origin so any mobile phone camera or scanner can immediately open it.
 * @param {string} studentId - The student's ID
 * @param {string} pin - The 4-digit PIN
 * @returns {string} The QR URL string format
 */
export const generateQRData = (studentId, pin) => {
  const origin = (typeof window !== 'undefined' && window.location?.origin)
    ? window.location.origin
    : 'http://localhost:3000';
  return `${origin}/login?pin=${pin}&studentId=${studentId}`;
};

/**
 * Generates a base64 image string of the QR code.
 * @param {string} studentId - The student's ID
 * @param {string} pin - The 4-digit PIN
 * @returns {Promise<string>} Base64 image data URL
 */
export const generateQRCode = async (studentId, pin) => {
  const data = generateQRData(studentId, pin);
  return await QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'H'
  });
};

/**
 * Generates HTML for a printable QR card.
 * Designed to be printed and stuck on a child's desk.
 * @param {Object} studentProfile - The student's profile data
 * @param {string} pin - The 4-digit PIN
 * @returns {Promise<string>} HTML string
 */
export const generatePrintableQR = async (studentProfile, pin) => {
  const idToUse = studentProfile.userId || studentProfile.studentId || studentProfile.id;
  const qrImage = await generateQRCode(idToUse, pin);
  const name = studentProfile.name || studentProfile.firstName || 'Student';
  
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; border: 2px solid #1976d2; border-radius: 12px; padding: 24px; width: 320px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: #ffffff;">
      <h2 style="color: #1976d2; margin-bottom: 4px;">Lumina</h2>
      <h3 style="margin-top: 0; color: #333;">${name}</h3>
      <img src="${qrImage}" alt="QR Code" style="width: 200px; height: 200px; margin: 10px 0;" />
      <div style="background: #FFF9F0; border: 1.5px dashed #E8920C; border-radius: 8px; padding: 8px; margin: 8px 0;">
        <span style="font-size: 11px; font-weight: 800; color: #E8920C; display: block;">4-DIGIT PIN</span>
        <span style="font-size: 26px; font-weight: bold; letter-spacing: 6px; color: #000;">${pin}</span>
      </div>
      <p style="color: #666; font-size: 13px; font-weight: 500; margin-top: 8px;">Scan with camera or enter PIN to start learning!</p>
    </div>
  `;
};

/**
 * Parses a Lumina QR data string back into a PIN and studentId.
 * Supports both web URL (http/https), custom scheme (lumina://), and direct PIN.
 * @param {string} qrString - The raw QR string
 * @returns {{ pin: string|null, studentId: string|null }}
 */
export const parseQRData = (qrString) => {
  try {
    if (!qrString) return { pin: null, studentId: null };

    if (qrString.startsWith('http://') || qrString.startsWith('https://') || qrString.startsWith('lumina://')) {
      const url = new URL(qrString);
      return {
        pin: url.searchParams.get('pin'),
        studentId: url.searchParams.get('studentId')
      };
    }

    if (/^\d{4}$/.test(qrString.trim())) {
      return { pin: qrString.trim(), studentId: null };
    }
  } catch (e) {
    console.warn('Invalid QR String parsed.', e);
  }
  return { pin: null, studentId: null };
};

