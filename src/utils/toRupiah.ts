export const toRupiah = (price: number) => {
  const rupiahFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
  return rupiahFormat;
};
