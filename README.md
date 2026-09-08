# CIRSI FOOD - Landing Page

## Cara menjalankan
1. Extract file ZIP.
2. Buka `index.html` di browser.
3. Admin: buka `admin.html`.

## Login awal
- Username: admin
- Password: @Raiyan17

## Fitur
- Landing page responsif
- Animasi dan efek modern
- Menu dan harga
- WhatsApp order
- Admin edit nomor WA & alamat
- Admin edit harga
- Admin upload/ganti foto
- Admin tambah/edit/hapus testimoni
- Admin tambah/edit/hapus daftar orang yang sudah Open PO
- Daftar Open PO tampil otomatis di landing page
- Data disimpan menggunakan LocalStorage

## Penting
Versi ini adalah demo frontend. Data tersimpan di browser yang digunakan.
Untuk website online yang benar-benar aman dan bisa dikelola dari perangkat berbeda, gunakan backend/database seperti PHP + MySQL atau Firebase.

- Pelanggan dapat menambahkan testimoni sendiri melalui formulir di website.
- Testimoni baru langsung tampil pada halaman website.
- Menu navigasi atas memiliki tombol "Daftar PO" yang langsung menuju daftar Open PO.

CATATAN:
Versi frontend/LocalStorage: testimoni dan perubahan data tersimpan pada browser yang digunakan.
Agar testimoni pelanggan dari perangkat lain bisa tampil untuk semua pengunjung, website memerlukan backend/database (PHP + MySQL atau Firebase).

- Form pemesanan pelanggan lengkap.
- Pilihan nomor WhatsApp tujuan:
  - Admin 1: 081380637870
  - Admin 2: 081295524785
- Pesan otomatis dibuat dengan format rapi dan langsung dibuka di WhatsApp.

FIX V4:
- Elemen website tidak lagi bergantung pada JavaScript untuk tampil.
- Jika app.js gagal dimuat, isi website tetap terlihat dan tidak akan blank.
- JavaScript sudah ditambahkan pengecekan elemen agar tidak berhenti karena ID yang tidak ditemukan.

UPDATE V5:
- Pilihan menu dipisahkan per rasa: Ayam Ori, Ayam Pedas, Jando, dan Keju Parut.
- Kolom Level Pedas dihapus.
- Kolom tersebut diganti menjadi Alamat / Lokasi Pengiriman.
- Pesan WhatsApp tidak lagi menampilkan Level Pedas.

UPDATE V6:
- Ditambahkan pilihan "Menu Lainnya" pada form pemesanan.
- Jika pelanggan memilih Menu Lainnya, kolom untuk menulis nama menu akan muncul.
- Menu standar tetap menghitung harga otomatis.
- Untuk Menu Lainnya, harga dan total akan tertulis "Menunggu konfirmasi admin".

UPDATE V7:
- Form pemesanan sekarang mendukung beberapa menu dalam satu pesanan.
- Tombol "+ Tambah Menu" akan menambahkan baris pesanan baru di bawah.
- Setiap baris dapat memilih salah satu dari 4 rasa dan jumlah PCS.
- Pelanggan dapat menghapus baris menu tambahan.
- WhatsApp menerima semua detail pesanan, subtotal per menu, dan total keseluruhan.

UPDATE V9:
- Ditambahkan footer premium di bagian paling bawah landing page.
- Footer memiliki CTA WhatsApp, logo, menu, bantuan, kontak, jam operasional, sosial media, metode pembayaran, benefit, efek hover dan tombol kembali ke atas.

UPDATE V10:
- Header diperbarui menjadi lebih modern dan premium.
- Footer dirapikan agar lebih seimbang, bersih, responsif, dan profesional.
- Pesanan dicatat otomatis saat pelanggan menekan tombol Kirim Pesanan via WhatsApp.
- Admin memiliki menu Pesanan Masuk Otomatis, detail pesanan, total, status konfirmasi, refresh, dan hapus.
- Catatan: pada website statis/GitHub Pages, data pesanan tersimpan di localStorage browser yang sama dan tidak dapat memverifikasi bahwa pesan benar-benar sudah dikirim di WhatsApp. Untuk data lintas perangkat diperlukan backend/database seperti Firebase atau Supabase.
