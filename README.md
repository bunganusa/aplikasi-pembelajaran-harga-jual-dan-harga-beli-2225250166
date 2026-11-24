# Aplikasi Pembelajaran Aritmetika Sosial (Harga Jual & Harga Beli)

Aplikasi web edukasi interaktif yang dirancang khusus untuk membantu siswa memahami materi matematika Aritmetika Sosial (Harga Jual, Harga Beli, Untung, Rugi, dan Persentasenya) tingkat Kelas 7 SMP Semester 2.

---

## Fitur Utama Aplikasi
1. **Pretest (Kemampuan Awal):** Menguji pemahaman dasar siswa sebelum mulai masuk ke materi pembelajaran.
2. **Materi & Rumus:** Penjelasan konsep jual beli yang mendalam disertai rumus lengkap.
3. **Latihan Soal:** 10 soal interaktif pilihan ganda lengkap dengan pembahasan otomatis di setiap nomornya.
4. **Posttest & Evaluasi Belajar:** Ujian akhir lengkap dengan laporan perbandingan nilai (skor Pretest vs Posttest).
5. **Simulasi Jual Beli:** Fitur hitung instan untuk mencocokkan angka untung atau rugi secara mandiri.
6. **Audio Musik Latar:** Pemutar audio interaktif (`lagu.mp3`) untuk menemani proses belajar.
7. **Asisten AI berbasis RMT:** Tutor memberikan petunjuk bertahap pada lima tahap RMT dan tidak langsung membocorkan jawaban akhir.

---

## Pengembang
* **Nama Pengembang:** Bunga Nusa Pertiwi
* **Kategori:** Media Pembelajaran Matematika Interaktif (React + Vite)

---

## Cara Menjalankan Proyek Secara Lokal

1. Pastikan Node.js sudah terinstal di komputer/laptopmu.
2. Buka terminal di dalam folder proyek, lalu instal modul yang dibutuhkan:
   ```bash
   npm install
   ```
3. Isi `AI_API_KEY` di `.env` dengan key dari [Google AI Studio](https://aistudio.google.com/apikey). Default aplikasi memakai Gemini 3.5 Flash-Lite. Free tier memiliki batas penggunaan bersama per project dan isi prompt dapat digunakan untuk meningkatkan produk; jangan masukkan data pribadi siswa.
4. Jalankan frontend dan backend bersama-sama:
   ```bash
   npm run dev
   ```
5. Buka alamat yang ditampilkan Vite (biasanya `http://localhost:5173`).

Untuk Vercel, atur `AI_API_KEY` pada Environment Variables, lalu deploy ulang. Default `AI_BASE_URL` dan `AI_MODEL` sudah diarahkan ke Gemini 3.5 Flash-Lite; kunci API hanya dibaca di backend.

Tahapan yang digunakan mengikuti konfigurasi di `shared/rmt.js` dari ZIP. Cocokkan nama dan urutannya dengan ringkasan RMT resmi dari dosen/SPADA bila ada ketentuan khusus.