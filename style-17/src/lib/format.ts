// Contoh: 1500000 -> "1.500.000"
export function formatRupiah(angka: number) {
  return String(angka).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
