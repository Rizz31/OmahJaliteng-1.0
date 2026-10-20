import React from 'react';
import { business, whatsappVerified } from '../../content.config';
import { isValidDirectUrl, trackEvent } from '../../utils/helpers';
import { getAssetUrl } from '../../utils/asset';
import { Mascot } from '../Mascot/Mascot';
import './Footer.css';

export const Footer: React.FC = () => {
  const hasGoFood = isValidDirectUrl(business.goFoodUrl, 'gofood.co.id');
  const hasInsta = isValidDirectUrl(business.instagramUrl, 'instagram.com');
  const year = new Date().getFullYear();

  return (
    <>
      {/* CTA Section */}
      <section id="pesan" className="cta-section" aria-label="Pesan sekarang">
        {/* Background */}
        <div className="cta-bg" aria-hidden="true">
          <img
            src={getAssetUrl('assets/scene-cta.jpg')}
            alt=""
            className="cta-bg-img"
            loading="lazy"
            aria-hidden="true"
          />
          <div className="cta-overlay" />
        </div>

        {/* Mascot peeking from bottom */}
        <div className="cta-mascot-wrap" aria-hidden="true">
          <Mascot pose="thumbsup" section="cta" className="cta-mascot" />
        </div>

        <div className="container cta-content">
          <h2 className="cta-headline">
            Malam ini, yuk nongkrong di Jaliteng!
          </h2>
          <p className="cta-subtext">
            Wedang hangat, tahu petis renyah, suasana nyaman.<br />
            Pesan sekarang, kami siapkan untukmu.
          </p>

          <div className="cta-buttons">
            {/* Show both buttons, Telepon is primary while whatsappVerified=false */}
            {!whatsappVerified ? (
              <>
                <a
                  href={`tel:${business.phone}`}
                  className="btn-enamel btn-tel cta-btn-primary"
                  onClick={() => trackEvent('tel_cta_click')}
                  aria-label={`Telepon Jaliteng di ${business.phone}`}
                >
                  📞 Telepon Sekarang (Utama)
                </a>
                <a
                  href={business.whatsappUrl}
                  className="btn-enamel btn-secondary cta-btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_cta_click')}
                  aria-label="Pesan via WhatsApp"
                >
                  💬 WhatsApp
                </a>
              </>
            ) : (
              <>
                <a
                  href={business.whatsappUrl}
                  className="btn-enamel btn-wa cta-btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_cta_click')}
                  aria-label="Pesan via WhatsApp"
                >
                  💬 Pesan via WhatsApp
                </a>
                <a
                  href={`tel:${business.phone}`}
                  className="btn-enamel btn-secondary cta-btn-secondary"
                  onClick={() => trackEvent('tel_cta_click')}
                  aria-label={`Telepon Jaliteng di ${business.phone}`}
                >
                  📞 Telepon
                </a>
              </>
            )}

            {hasGoFood && (
              <a
                href={business.goFoodUrl}
                className="btn-enamel btn-gold cta-btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('gofood_cta_click')}
                aria-label="Pesan antar via GoFood"
              >
                🛵 GoFood
              </a>
            )}
          </div>

          {/* Enamel sign decoration */}
          <div className="cta-enamel-sign" aria-hidden="true">
            <span className="enamel-sign-text">JALITENG</span>
            <span className="enamel-sign-sub">Wedangan & Kuliner Malam Semarang</span>
          </div>
        </div>

        {/* Torn paper edge */}
        <div className="cta-torn" aria-hidden="true" />
      </section>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Jaliteng</span>
            <p className="footer-tagline">{business.tagline}</p>
          </div>

          <div className="footer-links">
            <nav aria-label="Menu navigasi footer">
              <a href="#hero">Beranda</a>
              <a href="#menu">Menu</a>
              <a href="#cerita">Cerita</a>
              <a href="#lokasi">Lokasi</a>
              <a href="/qr">Cetak QR Meja</a>
            </nav>

            <div className="footer-socials">
              {hasInsta && (
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('instagram_footer_click')}
                  aria-label="Instagram Jaliteng"
                  className="social-link"
                >
                  <InstaIcon /> Instagram
                </a>
              )}
              {hasGoFood && (
                <a
                  href={business.goFoodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('gofood_footer_click')}
                  aria-label="GoFood Jaliteng"
                  className="social-link"
                >
                  🛵 GoFood
                </a>
              )}
              <a
                href={business.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_footer_click')}
                aria-label="WhatsApp Jaliteng"
                className="social-link"
              >
                <WAIcon /> WhatsApp
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">
              &copy; {year} Jaliteng. {business.address}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

const InstaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const WAIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default Footer;
