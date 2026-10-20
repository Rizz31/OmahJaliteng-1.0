# 🍢 JALITENG — Website Brand & Pemesanan Online

Selamat datang di website resmi **Jaliteng** (Wedangan & Kuliner Malam khas Semarang).
Website ini dibuat khusus dengan estetika **"Warung Jawa Tempo Dulu"** yang hangat, interaktif, cepat, dan siap dipakai untuk menerima pesanan langsung lewat WhatsApp.

---

## 📖 Panduan Penggunaan untuk Koko / Pemilik Jaliteng

Semua data bisnis, harga menu, jam operasional, dan link media sosial berada di **SATU FILE SAJA**:
👉 `src/content.config.ts`

**Anda TIDAK PERLU mengubah kode program atau komponen.** Cukup buka file tersebut dan ubah teks atau angkanya.

---

### 1. Cara Mengubah Harga atau Menambah Menu
Buka `src/content.config.ts`, cari bagian `export const menu = [...]`.

Contoh mengubah harga Tahu Petis:
```ts
{ id: "tahu-petis-5", name: "Tahu Petis (isi 5)", price: 25000, featured: true, noteEnabled: true },
```
Ubah angka `25000` menjadi harga baru, misalnya `27000`.

---

### 2. Cara Mengubah Jam Buka & Hari Operasional
Di dalam `src/content.config.ts`, cari bagian `hours`:
```ts
hours: {
  open: 9,      // Jam buka (misal: 9 = 09.00 pagi)
  close: 22,    // Jam tutup (misal: 22 = 22.00 malam)
  timezone: "Asia/Jakarta",
  label: "Setiap hari, 09.00 – 22.00 WIB",
  days: ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"],
}
```
Website akan secara otomatis menghitung status **"Buka sekarang"** atau **"Tutup"** berdasarkan jam ini.

---

### 3. Mengaktifkan Link Instagram & GoFood Asli
Saat ini link masih berupa link share sementara (sehingga tombol otomatis disembunyikan agar tampilan tetap rapi).

Jika sudah memiliki link profil langsung:
- **Instagram**: Ganti `instagramUrl` dengan `https://instagram.com/akun_jaliteng`
- **GoFood**: Ganti `goFoodUrl` dengan `https://gofood.co.id/semarang/restaurant/jaliteng-...`

Begitu link langsung diisi, tombol Instagram dan GoFood akan **otomatis muncul** di website!

---

### 4. Verifikasi WhatsApp
Jika nomor WhatsApp sudah siap 100% melayani pesan chat pesanan:
Ubah flag:
```ts
export const whatsappVerified = true;
```
Saat bernilai `true`, tombol **WhatsApp** akan menjadi tombol utama, dan nomor telepon biasa menjadi tombol cadangan.

---

### 5. Mencetak Stiker QR Meja & Kemasan
Buka halaman:
👉 `https://domain-anda.com/qr`

Halaman ini siap cetak (`Ctrl + P` atau klik tombol cetak) dengan format stiker meja kayu dan stiker kemasan box bawa pulang.

---

## 🚀 Cara Menjalankan & Deploy ke Internet

### Menjalankan di Komputer Lokal:
```bash
npm install
npm run dev
```
Buka browser di `http://localhost:5173/`.

### Menguji Hasil Build:
```bash
npm run build
npm run preview
```

### Deploy Gratis ke Cloudflare Pages / Vercel / Netlify:
1. Upload folder proyek ke GitHub repository Anda.
2. Buka [Vercel](https://vercel.com) atau [Cloudflare Pages](https://pages.cloudflare.com).
3. Sambungkan ke repository GitHub tersebut.
4. Pengaturan Build:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy** — website akan langsung online dengan HTTPS gratis!

---

## 🎨 Aset dan Maskot
- Semua gambar maskot berada di `/public/assets/mascot/`
- Video background dan poster berada di `/public/assets/`
- Grayscale depth map berada di `/public/assets/depth/scene-hero-depth.jpg`

*Matur nuwun, sukses dan laris manis untuk Jaliteng!*
