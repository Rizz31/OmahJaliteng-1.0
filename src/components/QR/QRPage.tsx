import React from 'react';
import { business, seo } from '../../content.config';
import { getAssetUrl } from '../../utils/asset';
import './QRPage.css';

export const QRPage: React.FC = () => {
  const currentUrl = typeof window !== 'undefined' 
    ? (window.location.href.split('#')[0].replace(/\/qr\/?$/, '') || window.location.origin)
    : seo.siteUrl;
  
  // High-contrast clean SVG QR code pointing to the site
  // Encoded with google chart or vector QR representation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(currentUrl)}&color=3D2410&bgcolor=F1E6D0&qzone=1`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-page-container">
      <div className="qr-controls no-print">
        <a href="/" className="btn-enamel btn-secondary">
          ← Kembali ke Beranda
        </a>
        <button onClick={handlePrint} className="btn-enamel btn-primary">
          🖨️ Cetak Stiker Meja &amp; Kemasan
        </button>
      </div>

      <div className="qr-sticker-sheet">
        {/* Table sticker card 1 */}
        <div className="qr-sticker-card">
          <div className="sticker-header">
            <span className="sticker-badge">Kuliner Malam &amp; Wedangan</span>
            <h1 className="sticker-brand">JALITENG</h1>
            <p className="sticker-tagline">Tahu Petis &amp; Wedang Ronde Khas Semarang</p>
          </div>

          <div className="sticker-qr-wrap">
            <img
              src={qrSvgUrl}
              alt="Scan QR untuk pesan menu Jaliteng"
              className="sticker-qr-img"
              width={220}
              height={220}
            />
            <div className="sticker-mascot-badge">
              <img
                src={getAssetUrl('assets/mascot/mascot-blangkon.png')}
                alt="Maskot Jaliteng"
                className="sticker-mascot-img"
              />
            </div>
          </div>

          <div className="sticker-instructions">
            <p className="scan-callout">📲 SCAN DENGAN KAMERA HP</p>
            <p className="scan-desc">
              Buka menu digital, pilih pesananmu, dan pesan langsung dari mejamu!
            </p>
          </div>

          <div className="sticker-table-field">
            <span className="table-label">NOMOR MEJA:</span>
            <div className="table-box" />
          </div>

          <div className="sticker-footer">
            <span>{business.address.split(',')[0]}</span>
            <span>WA: {business.phone}</span>
          </div>
        </div>

        {/* Packaging sticker card 2 */}
        <div className="qr-sticker-card packaging-variant">
          <div className="sticker-header">
            <span className="sticker-badge">Hangat Dari Semarang</span>
            <h2 className="sticker-brand">JALITENG</h2>
            <p className="sticker-tagline">Tahu Petis Crispy &amp; Wedang Ronde Asli</p>
          </div>

          <div className="sticker-qr-wrap">
            <img
              src={qrSvgUrl}
              alt="Scan QR untuk pesan lagi"
              className="sticker-qr-img"
              width={200}
              height={200}
            />
            <div className="sticker-mascot-badge">
              <img
                src={getAssetUrl('assets/mascot/mascot-thumbsup.png')}
                alt="Maskot Jaliteng"
                className="sticker-mascot-img"
              />
            </div>
          </div>

          <div className="sticker-instructions">
            <p className="scan-callout">MATUR NUWUN! 🙏</p>
            <p className="scan-desc">
              Suka makanan kami? Scan untuk pesan lagi atau bagikan ke teman!
            </p>
          </div>

          <div className="sticker-footer">
            <span>Buka Setiap Hari: 09.00 - 22.00 WIB</span>
            <span>Pesan Online: {business.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPage;
