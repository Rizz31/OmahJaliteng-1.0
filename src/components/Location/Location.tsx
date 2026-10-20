import React, { useState, useEffect } from 'react';
import { business, whatsappVerified } from '../../content.config';
import { isOpen, todayDayName, trackEvent, isValidDirectUrl } from '../../utils/helpers';
import { getAssetUrl } from '../../utils/asset';
import './Location.css';

export const Location: React.FC = () => {
  const [openStatus, setOpenStatus] = useState(isOpen());
  const today = todayDayName();

  useEffect(() => {
    const t = setInterval(() => setOpenStatus(isOpen()), 60000);
    return () => clearInterval(t);
  }, []);

  const hasGoFood = isValidDirectUrl(business.goFoodUrl, 'gofood.co.id');
  const hasInsta = isValidDirectUrl(business.instagramUrl, 'instagram.com');

  const handleMapClick = () => trackEvent('maps_click');
  const handleWAClick = () => trackEvent('whatsapp_location_click');
  const handleTelClick = () => trackEvent('tel_click');
  const handleGoFoodClick = () => trackEvent('gofood_click');
  const handleInstaClick = () => trackEvent('instagram_click');

  return (
    <section id="lokasi" className="location-section" aria-label="Lokasi dan jam buka Jaliteng">
      <div className="container">
        <div className="ornament-divider" style={{ marginBottom: 'var(--space-12)' }}>
          <span>✦</span>
          <h2 className="section-title">Lokasi &amp; Jam Buka</h2>
          <span>✦</span>
        </div>

        <div className="location-grid">
          {/* Map embed / address card */}
          <div className="location-map-card parchment-card">
            <div className="location-map-preview">
              <img
                src={getAssetUrl('assets/hero-poster.jpg')}
                alt="Lokasi Jaliteng di Semarang"
                className="map-preview-img"
                loading="lazy"
              />
              <div className="map-overlay">
                <a
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-enamel btn-gold map-btn"
                  onClick={handleMapClick}
                  aria-label="Buka di Google Maps"
                >
                  🗺️ Buka Google Maps
                </a>
              </div>
            </div>

            <div className="location-address">
              <h3 className="location-address-title">📍 Alamat</h3>
              <address className="location-address-text">
                {business.address}
              </address>
            </div>
          </div>

          {/* Hours & contacts */}
          <div className="location-info">
            {/* Hours */}
            <div className="parchment-card location-hours-card">
              <h3 className="location-hours-title">🕐 Jam Operasional</h3>
              <div className={`open-badge ${openStatus ? 'badge-open' : 'badge-closed'}`}
                style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
                <span className="status-dot" />
                {openStatus ? 'Buka sekarang' : `Sedang tutup · buka jam ${String(business.hours.open).padStart(2,'0')}.00`}
              </div>

              <table className="hours-table">
                <tbody>
                  {business.hours.days.map(day => (
                    <tr key={day} className={day === today ? 'hours-today' : ''}>
                      <td className="hours-day">{day}</td>
                      <td className="hours-time">
                        {String(business.hours.open).padStart(2,'0')}.00 – {String(business.hours.close).padStart(2,'0')}.00
                      </td>
                      {day === today && <td className="hours-today-label">← Hari ini</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Contacts */}
            <div className="parchment-card location-contacts-card">
              <h3 className="location-contacts-title">📞 Hubungi Kami</h3>

              <div className="contact-buttons">
                {/* When whatsappVerified is false, Telepon is PRIMARY button */}
                {!whatsappVerified ? (
                  <>
                    <a
                      href={`tel:${business.phone}`}
                      className="btn-enamel btn-tel contact-btn"
                      onClick={handleTelClick}
                      aria-label={`Telepon ${business.phone}`}
                    >
                      <PhoneIcon />
                      Telepon Langsung (Utama)
                    </a>
                    <a
                      href={business.whatsappUrl}
                      className="btn-enamel btn-secondary contact-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWAClick}
                      aria-label="Hubungi via WhatsApp"
                    >
                      <WAIcon />
                      WhatsApp
                      <span className="contact-badge">Belum terverifikasi</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={business.whatsappUrl}
                      className="btn-enamel btn-wa contact-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWAClick}
                      aria-label="Hubungi via WhatsApp"
                    >
                      <WAIcon />
                      WhatsApp (Utama)
                    </a>
                    <a
                      href={`tel:${business.phone}`}
                      className="btn-enamel btn-secondary contact-btn"
                      onClick={handleTelClick}
                      aria-label={`Telepon ${business.phone}`}
                    >
                      <PhoneIcon />
                      Telepon
                    </a>
                  </>
                )}

                {hasGoFood && (
                  <a
                    href={business.goFoodUrl}
                    className="btn-enamel btn-gold contact-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleGoFoodClick}
                    aria-label="Pesan di GoFood"
                  >
                    🛵 GoFood
                  </a>
                )}

                {hasInsta && (
                  <a
                    href={business.instagramUrl}
                    className="btn-enamel btn-secondary contact-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleInstaClick}
                    aria-label="Instagram Jaliteng"
                  >
                    <InstaIcon />
                    Instagram
                  </a>
                )}
              </div>

              <p className="contact-number">
                <span className="contact-label">No. Telpon / WA:</span>
                <a href={`tel:${business.phone}`} className="contact-phone-link">{business.phone}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WAIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127 1.025.37 2.03.72 3-.275.733-.085 1.58.495 2.16l1.27 1.27a16 16 0 006.29 6.29l1.27 1.27c.58.58 1.427.77 2.16.495.97.35 1.975.592 3 .72A2 2 0 0122 16.92z"/>
  </svg>
);

const InstaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default Location;
