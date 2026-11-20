// 1500000 -> "1.500.000"
export const formatRupiah = (value: number) =>
    String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
