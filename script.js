// script.js - File Pendukung Interaktif Aritmetika Sosial
console.log("Aplikasi Pembelajaran Matematika oleh Bunga Nusa Pertiwi siap dijalankan! ✨");

// Fungsi opsional untuk memvalidasi input simulasi secara global
function validasiInputHarga(beli, jual) {
  if (isNaN(beli) || isNaN(jual)) {
    return "Harap masukkan angka yang valid!";
  }
  return "Valid";
}