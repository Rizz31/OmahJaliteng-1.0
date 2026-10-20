import React, { useState, useCallback } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../store/cartStore';
import { business, whatsappVerified } from '../../content.config';
import { isValidDirectUrl, trackEvent } from '../../utils/helpers';
import { getAssetUrl } from '../../utils/asset';
import './Cart.css';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ORDER_TYPES = [
  { id: 'ambil', label: 'Ambil / Makan di tempat' },
];

export const Cart: React.FC<CartProps> = ({ isOpen: isCartOpen, onClose }) => {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const [orderType, setOrderType] = useState('ambil');
  const [customerName, setCustomerName] = useState('');
  const [sending, setSending] = useState(false);

  const hasGoFood = isValidDirectUrl(business.goFoodUrl, 'gofood.co.id');

  const buildWAMessage = useCallback(() => {
    const lines: string[] = [];
    lines.push(`*Pesanan Jaliteng* 🍽️`);
    lines.push(`Nama: ${customerName || 'Tidak disebutkan'}`);
    lines.push(`Jenis: ${orderType === 'ambil' ? 'Ambil / Makan di tempat' : 'Antar (GoFood)'}`);
    lines.push('');
    lines.push('*Detail Pesanan:*');

    items.forEach((item, i) => {
      let line = `${i + 1}. ${item.name} x${item.qty} — ${formatPrice(item.unitPrice * item.qty)}`;
      if (item.selectedOptions) {
        const opts = Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ');
        line += `\n   _(${opts})_`;
      }
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        const adds = item.selectedAddOns.map(a => a.label).join(', ');
        line += `\n   _+Tambahan: ${adds}_`;
      }
      if (item.note) {
        line += `\n   _📝 Catatan: ${item.note}_`;
      }
      lines.push(line);
    });

    lines.push('');
    lines.push(`*Total: ${formatPrice(totalPrice)}*`);
    lines.push('');
    lines.push('Terima kasih, Kulo nuwun! 🙏');

    return encodeURIComponent(lines.join('\n'));
  }, [items, customerName, orderType, totalPrice]);

  const handleSendWA = () => {
    if (items.length === 0) return;
    setSending(true);
    trackEvent('whatsapp_order', { items: String(totalItems) });
    const msg = buildWAMessage();
    window.open(`${business.whatsappUrl}?text=${msg}`, '_blank');
    setTimeout(() => setSending(false), 1500);
  };

  const handleGoFood = () => {
    trackEvent('gofood_click');
    window.open(business.goFoodUrl, '_blank');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="cart-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="cart-drawer"
        role="complementary"
        aria-label="Keranjang pesanan"
        aria-modal="true"
      >
        <div className="cart-header">
          <h2 className="cart-title">
            <span>🛒</span> Pesanan Kamu
          </h2>
          <button
            className="cart-close"
            onClick={onClose}
            aria-label="Tutup keranjang"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <img
              src={getAssetUrl('assets/mascot/mascot-peek.png')}
              alt="Keranjang kosong"
              className="cart-empty-img"
            />
            <p>Keranjangnya masih kosong nih...</p>
            <p className="cart-empty-sub">Yuk, pilih menu dulu!</p>
          </div>
        ) : (
          <>
            <div className="cart-items" role="list">
              {items.map((item) => (
                <div key={item.cartKey} className="cart-item" role="listitem">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    {item.selectedOptions && (
                      <span className="cart-item-meta">
                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </span>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <span className="cart-item-meta">
                        +{item.selectedAddOns.map(a => a.label).join(', ')}
                      </span>
                    )}
                    {item.note && (
                      <span className="cart-item-note">📝 {item.note}</span>
                    )}
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.cartKey, item.qty - 1)}
                        aria-label={`Kurangi ${item.name}`}
                      >−</button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.cartKey, item.qty + 1)}
                        aria-label={`Tambah ${item.name}`}
                      >+</button>
                    </div>
                    <span className="cart-item-price">
                      {formatPrice(item.unitPrice * item.qty)}
                    </span>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.cartKey)}
                      aria-label={`Hapus ${item.name}`}
                    >🗑</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order details */}
            <div className="cart-footer">
              {/* Customer name */}
              <div className="cart-field">
                <label htmlFor="customer-name" className="cart-label">Nama kamu:</label>
                <input
                  id="customer-name"
                  type="text"
                  className="cart-input"
                  placeholder="Misal: Mas Budi"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  maxLength={50}
                />
              </div>

              {/* Order type */}
              <div className="cart-field">
                <span className="cart-label">Jenis pesanan:</span>
                <div className="order-types">
                  {ORDER_TYPES.map(t => (
                    <button
                      key={t.id}
                      className={`order-type-btn ${orderType === t.id ? 'selected' : ''}`}
                      onClick={() => setOrderType(t.id)}
                      aria-pressed={orderType === t.id}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="cart-total">
                <span>Total ({totalItems} item):</span>
                <span className="cart-total-price">{formatPrice(totalPrice)}</span>
              </div>

              <p className="cart-note">
                💬 Pesanan dikonfirmasi lewat WhatsApp. Bayar saat ambil/makan di tempat.
              </p>

              {/* CTA buttons */}
              <div className="cart-actions">
                <button
                  type="button"
                  className="btn-enamel btn-primary cart-wa-btn"
                  onClick={handleSendWA}
                  disabled={sending}
                  aria-label="Kirim pesanan ke WhatsApp"
                >
                  <WAIcon /> {sending ? 'Membuka WhatsApp...' : 'Kirim ke WhatsApp'}
                </button>

                {!whatsappVerified && (
                  <a
                    href={`tel:${business.phone}`}
                    className="btn-enamel btn-tel"
                    onClick={() => trackEvent('tel_click')}
                    aria-label="Telepon Jaliteng"
                  >
                    <PhoneIcon /> Telepon
                  </a>
                )}

                {hasGoFood && (
                  <button
                    className="btn-enamel btn-gold"
                    onClick={handleGoFood}
                    aria-label="Pesan antar via GoFood"
                  >
                    🛵 Pesan Antar via GoFood
                  </button>
                )}
              </div>

              <button
                className="cart-clear"
                onClick={clearCart}
                aria-label="Hapus semua pesanan"
              >
                Kosongkan keranjang
              </button>
            </div>
          </>
        )}
      </aside>
    </>
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

export default Cart;
