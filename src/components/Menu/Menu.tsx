import React, { useState, useCallback } from 'react';
import { menu, featuredIds, type MenuItem as MenuItemType } from '../../content.config';
import { formatPrice, makeCartKey } from '../../store/cartStore';
import { useCart } from '../../hooks/useCart';
import { todayDayName, trackEvent } from '../../utils/helpers';
import { Mascot } from '../Mascot/Mascot';
import './Menu.css';

function getAllItems(): MenuItemType[] {
  return menu.flatMap(c => c.items);
}

function getFeaturedItems(): MenuItemType[] {
  const all = getAllItems();
  return featuredIds.map(id => all.find(item => item.id === id)!).filter(Boolean);
}

// ── MenuItem Card ────────────────────────────────────────────
interface MenuCardProps {
  item: MenuItemType;
  isFeatured?: boolean;
  onAdd: (
    item: MenuItemType,
    opts: Record<string, string>,
    variant: { label: string; price: number } | null,
    addOns: { label: string; priceAdd: number }[],
    note: string
  ) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, isFeatured, onAdd }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<{ label: string; price: number } | null>(
    item.variants?.[0] || null
  );
  const [selectedAddOns, setSelectedAddOns] = useState<{ label: string; priceAdd: number }[]>([]);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [adding, setAdding] = useState(false);
  const today = todayDayName();

  const isUnavailable = item.availableDays && !(item.availableDays as readonly string[]).includes(today);

  const requiredMissing = item.options?.filter(o => o.required && !selectedOptions[o.id]) || [];
  const canAdd = !isUnavailable && requiredMissing.length === 0 && (item.price !== null || selectedVariant !== null);

  const handleAdd = () => {
    if (!canAdd) return;
    setAdding(true);
    onAdd(item, selectedOptions, selectedVariant, selectedAddOns, note);
    setTimeout(() => setAdding(false), 800);
  };

  const toggleAddOn = (addOn: { label: string; priceAdd: number }) => {
    setSelectedAddOns(prev =>
      prev.some(a => a.label === addOn.label)
        ? prev.filter(a => a.label !== addOn.label)
        : [...prev, addOn]
    );
  };

  const priceDisplay = () => {
    if (item.variants) {
      const min = Math.min(...item.variants.map(v => v.price));
      const max = Math.max(...item.variants.map(v => v.price));
      if (min === max) return formatPrice(min);
      return `${formatPrice(min)} – ${formatPrice(max)}`;
    }
    return formatPrice(item.price || 0);
  };

  return (
    <div
      className={`menu-card ${isFeatured ? 'menu-card-featured' : ''} ${isUnavailable ? 'menu-card-unavailable' : ''}`}
      id={`menu-item-${item.id}`}
    >
      {isFeatured && <span className="badge badge-andalan">⭐ Andalan Jaliteng</span>}

      <div className="menu-card-header">
        <div>
          <h3 className="menu-item-name">{item.name}</h3>
          {item.description && <p className="menu-item-desc">{item.description}</p>}
        </div>
        <div className="menu-item-price">
          <span className="price">{priceDisplay()}</span>
        </div>
      </div>

      {/* Printed notes from vintage recipe card */}
      {item.printedNotes && item.printedNotes.length > 0 && (
        <div className="menu-printed-notes">
          {item.printedNotes.map((n, i) => (
            <span key={i} className="printed-note">📝 {n}</span>
          ))}
        </div>
      )}

      {/* Unavailable days message */}
      {isUnavailable && (
        <div className="menu-unavailable">
          ⏳ Hanya tersedia hari Sabtu &amp; Minggu
        </div>
      )}

      {!isUnavailable && (
        <>
          {/* Variant picker (e.g. Teh Manis Es / Hangat) */}
          {item.variants && (
            <div className="menu-options-group">
              <span className="options-label">Pilihan sajian:</span>
              <div className="options-chips">
                {item.variants.map(v => (
                  <button
                    key={v.label}
                    type="button"
                    className={`option-chip ${selectedVariant?.label === v.label ? 'selected' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                    aria-pressed={selectedVariant?.label === v.label}
                  >
                    {v.label} <span className="chip-price">{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Required single-choice options (e.g. Kuah Jahe/Santan) */}
          {item.options?.map(opt => (
            <div key={opt.id} className="menu-options-group">
              <span className="options-label">
                {opt.label}{opt.required && <span className="required-star"> (wajib pilih)</span>}:
              </span>
              <div className="options-chips">
                {opt.choices.map(choice => (
                  <button
                    key={choice.label}
                    type="button"
                    className={`option-chip ${selectedOptions[opt.id] === choice.label ? 'selected' : ''}`}
                    onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.id]: choice.label }))}
                    aria-pressed={selectedOptions[opt.id] === choice.label}
                  >
                    {choice.label}
                    {choice.priceAdd ? <span className="chip-price">+{formatPrice(choice.priceAdd)}</span> : null}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Optional add-ons (per biji) */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="menu-options-group">
              <span className="options-label">Tambahan isian:</span>
              <div className="options-chips">
                {item.addOns.map(addOn => (
                  <button
                    key={addOn.label}
                    type="button"
                    className={`option-chip ${selectedAddOns.some(a => a.label === addOn.label) ? 'selected' : ''}`}
                    onClick={() => toggleAddOn(addOn)}
                    aria-pressed={selectedAddOns.some(a => a.label === addOn.label)}
                  >
                    {addOn.label}
                    <span className="chip-price">+{formatPrice(addOn.priceAdd)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Per-line free-text note */}
          {item.noteEnabled && (
            <div className="menu-note">
              <button
                type="button"
                className="note-toggle"
                onClick={() => setShowNote(s => !s)}
                aria-expanded={showNote}
              >
                {showNote ? '✕ Tutup catatan' : '✏️ Tambah catatan pesanan'}
              </button>
              {showNote && (
                <input
                  type="text"
                  className="note-input"
                  placeholder="Misal: jangan terlalu manis, kuah dipisah..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  maxLength={100}
                  aria-label={`Catatan untuk ${item.name}`}
                />
              )}
            </div>
          )}

          {/* Required selection notice */}
          {requiredMissing.length > 0 && (
            <p className="required-warning">
              ⚠️ Silakan pilih {requiredMissing.map(o => o.label).join(', ')} terlebih dahulu
            </p>
          )}
        </>
      )}

      <button
        type="button"
        className={`btn-enamel btn-primary menu-add-btn ${adding ? 'adding' : ''}`}
        onClick={handleAdd}
        disabled={!canAdd}
        aria-label={`Tambah ${item.name} ke keranjang`}
      >
        {adding ? '✓ Ditambahkan ke Pesanan!' : isUnavailable ? 'Hanya Sabtu & Minggu' : 'Tambah ke Pesanan'}
      </button>
    </div>
  );
};

// ── Main Menu Section ────────────────────────────────────────
export const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('wedang');
  const { addItem } = useCart();

  const handleAdd = useCallback((
    item: MenuItemType,
    opts: Record<string, string>,
    variant: { label: string; price: number } | null,
    addOns: { label: string; priceAdd: number }[],
    note: string
  ) => {
    const unitPrice = variant
      ? variant.price + addOns.reduce((s, a) => s + a.priceAdd, 0)
      : (item.price || 0) + addOns.reduce((s, a) => s + a.priceAdd, 0);

    const cartKey = makeCartKey(item.id, opts, variant?.label);

    addItem({
      cartKey,
      id: item.id,
      name: item.name + (variant ? ` (${variant.label})` : ''),
      qty: 1,
      unitPrice,
      selectedOptions: Object.keys(opts).length > 0 ? opts : undefined,
      selectedVariant: variant || undefined,
      selectedAddOns: addOns.length > 0 ? addOns : undefined,
      note: note || undefined,
    });

    trackEvent('add_to_cart', { item: item.name });

    // Trigger mascot thumbsup & cheer
    window.dispatchEvent(new CustomEvent('jaliteng:cart-add'));
  }, [addItem]);

  const featuredItems = getFeaturedItems();
  const currentCategory = menu.find(c => c.id === activeCategory);
  const currentItems = currentCategory?.items || [];

  return (
    <section id="menu" className="menu-section" aria-label="Menu Jaliteng">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <div className="ornament-divider">
            <span>✦</span>
            <h2 className="section-title">Papan Menu Jaliteng</h2>
            <span>✦</span>
          </div>
          <p className="section-subtitle">
            Mulai dari Tahu Petis Semarang renyah hingga Wedang Ronde hangat autentik. Monggo dipilih!
          </p>
        </div>

        {/* Mascot blangkon carrying ronde */}
        <div className="menu-mascot-wrap" aria-hidden="true">
          <Mascot pose="blangkon" section="menu" className="menu-mascot" />
        </div>

        {/* TOP OF MENU: ANDALAN STRIP */}
        <div className="andalan-strip-section" aria-label="Menu Andalan Jaliteng">
          <div className="andalan-strip-header">
            <span className="andalan-strip-title">🔥 Menu Andalan (Paling Dicari)</span>
            <span className="andalan-strip-sub">Resep autentik khas Semarang</span>
          </div>
          <div className="andalan-strip-grid">
            {featuredItems.map(item => (
              <MenuCard
                key={`featured-${item.id}`}
                item={item}
                isFeatured={true}
                onAdd={handleAdd}
              />
            ))}
          </div>
        </div>

        {/* CATEGORY TABS */}
        <nav className="menu-tabs" role="tablist" aria-label="Kategori menu">
          {menu.map(cat => (
            <button
              key={cat.id}
              role="tab"
              type="button"
              className={`menu-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              aria-selected={activeCategory === cat.id}
              id={`tab-${cat.id}`}
            >
              {cat.label} ({cat.items.length})
            </button>
          ))}
        </nav>

        {/* CATEGORY ITEMS GRID */}
        <div
          className="menu-grid"
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory}`}
        >
          {currentItems.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              isFeatured={item.featured}
              onAdd={handleAdd}
            />
          ))}
        </div>

        {/* Note about ordering */}
        <div className="menu-note-footer-card">
          <p className="menu-note-footer">
            💬 <strong>Cara Pemesanan:</strong> Pilih menu di atas, lalu kirim ke WhatsApp untuk konfirmasi pesanan (ambil di tempat / dine-in). Untuk layanan antar, silakan pesan via GoFood.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Menu;
