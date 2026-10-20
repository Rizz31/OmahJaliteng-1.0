# JALITENG — Progress & Project Roadmap

## 1. Short Architecture Plan
- **Single Source of Truth**: All business data, menu items, variant prices, required options, add-ons, business hours, and links live strictly in `src/content.config.ts`.
- **Art Direction**: "Warung Jawa Tempo Dulu" — aged parchment (`#F1E6D0`), teak wood (`#5B3A21`), terracotta (`#B5532F`), toast-gold (`#E8A838`), Fraunces serif display, Lora body, Plus Jakarta Sans UI.
- **Hero & Depth Parallax**:
  - Custom WebGL fragment shader displacing RGB scene texture using a grayscale depth map (`/assets/depth/scene-hero-depth.jpg`).
  - Edge-gap protection via 1.05x subtle zoom.
  - DevicePixelRatio capped at 1.5, lazy init after first paint (350ms delay).
  - Clean automatic fallback to plain video or poster on low-end devices, `saveData`, prefers-reduced-motion, or if depth map is missing.
- **Interactive Mascot System**:
  - 7 poses (`idle`, `lick`, `point`, `thumbsup`, `peek`, `jump`, `blangkon`) anchored consistently with shared foot-anchor (`footAnchorX: 22`, `footAnchorY: 88`) to eliminate jump on swaps.
  - Auto tongue-lick cycle every 6–10s.
  - Pointer & touch drag tilt toward cursor.
  - Click interaction: squish-bounce + crumb particles + soft synthesized acoustic sound (Web Audio API, mute toggle button).
  - Global cart event integration: thumbs-up cheer + speech bubble on add-to-cart.
  - `HERO_HAS_BAKED_MASCOT = true` flag: prevents duplicate hero mascot while keeping mascot active across all other sections.
- **Menu & Cart**:
  - Top "Andalan" strip with larger wooden menu cards for featured items (Tahu Petis & Wedang Ronde).
  - Complete menu schema: variant prices (Teh Manis / Tawar), required single-choice options (Kuah Jahe/Santan), optional add-ons (Ronde, Wijen Hitam, Kacang Merah), Saturday/Sunday availability rules (Sate Pisang), and per-line notes.
  - Cart drawer with persistent storage (`jaliteng_cart_v1`), quantity controls, order type selection, and pre-filled WhatsApp message generator.
- **Story & Location**:
  - Paper-cut layers over `scene-story.jpg` + positioning text + 3 points derived strictly from supplied facts.
  - Location table with live open status in Asia/Jakarta, Google Maps link, and Telepon priority when `whatsappVerified=false`.
- **Business-Ready & SEO**:
  - Indonesian title, Open Graph, Twitter cards, Schema.org `Restaurant` JSON-LD.
  - `/qr` printable page for table stickers and packaging.
  - `robots.txt` and `sitemap.xml`.
  - Indonesian owner README.

---

## 2. Phase Status

### Phase 1: Scaffold, Tokens, Config, Hero & Mascot System (COMPLETE)
- [x] Project scaffold with Vite + React 19 + TypeScript + GSAP.
- [x] Color tokens, typography, and paper grain aesthetics implemented in `index.css`.
- [x] Content config in `src/content.config.ts` with authentic Jaliteng data.
- [x] Hero with video loop (`hero-loop.mp4`) and poster fallback (`hero-poster.jpg`).
- [x] Custom WebGL depth parallax shader (`depthShader.ts`) with displacement and edge-gap protection.
- [x] Generated grayscale depth map (`scene-hero-depth.jpg`).
- [x] Mascot system (`Mascot.tsx`) with foot-anchor alignment, squish-bounce, crumb particles, touch tilt, and sound synthesizer.

### Phase 2: Menu + Cart + WhatsApp (COMPLETE)
- [x] Prominent "Andalan" strip at the top of the menu with larger cards for featured items (Tahu Petis, Ronde).
- [x] Category tabs for full menu navigation.
- [x] Required option chips, variant pricing, add-ons, and free-text notes.
- [x] Available days enforcement (Sate Pisang greyed out and blocked outside Saturday & Sunday).
- [x] Persistent cart drawer with localStorage.
- [x] Clean pre-filled WhatsApp message generator.
- [x] Direct link validator (`isValidDirectUrl`) to hide GoFood/Instagram until direct URLs are provided.

### Phase 3: Story, Location, Footer, SEO, Analytics & QR (COMPLETE)
- [x] Story section with layered paper-cut aesthetics, positioning text, and 3 authentic points.
- [x] Location section with live Asia/Jakarta open status, highlighted today row, Maps button, and contact buttons.
- [x] Telepon set as primary button while `whatsappVerified=false`.
- [x] Footer with final CTA, enamel sign, social links, and mascot thumbsup.
- [x] Dynamic "Siang ke Malam" scroll overlay shifting ambiance smoothly.
- [x] Indonesian SEO metadata, Open Graph, Twitter cards, and Schema.org Restaurant JSON-LD.
- [x] Printable `/qr` table stickers and packaging page with `@media print` styling.
- [x] `robots.txt` and `sitemap.xml`.

### Phase 4: QA, Audit, Readme & Deploy (COMPLETE)
- [x] Production build passes cleanly in <1s (CSS 40kB, JS 274kB / 83kB gzip).
- [x] Touch targets >= 44px, semantic HTML, and aria labels verified.
- [x] Owner-friendly README in Bahasa Indonesia (`README.md`).

---

## 3. Checklist of Items the Owner Must Supply
1. **Foto Makanan (`/public/assets/food/<item-id>.jpg`)**: Foto asli Tahu Petis, Wedang Ronde, Lumpia, dll. Saat ini menu menampilkan wooden card ilustratif yang elegan.
2. **Link Langsung Instagram**: Ganti `instagramUrl` di `src/content.config.ts` dengan link langsung `https://instagram.com/...` (saat ini link share sementara `share.google/...`).
3. **Link Langsung GoFood**: Ganti `goFoodUrl` di `src/content.config.ts` dengan link langsung `https://gofood.co.id/...` (saat ini link share sementara).
4. **Konfirmasi WhatsApp**: Ubah `whatsappVerified: true` di `src/content.config.ts` setelah nomor WhatsApp siap melayani chat pesanan secara reguler.
