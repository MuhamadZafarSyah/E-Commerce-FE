export function timeAgo(dateString: any) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} tahun ${years === 1 ? "" : ""} lalu`;
  } else if (months > 0) {
    return `${months} bulan ${months === 1 ? "" : ""} lalu`;
  } else if (days > 0) {
    return `${days} hari ${days === 1 ? "" : ""} lalu`;
  } else if (hours > 0) {
    return `${hours} jam ${hours === 1 ? "" : ""} lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit ${minutes === 1 ? "" : ""} lalu`;
  } else {
    return "Baru saja";
  }
}

// Contoh penggunaan dengan validasi
export function formatDateTime(dateString: any) {
  if (!dateString) return "";

  try {
    return timeAgo(dateString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if formatting fails
  }
}
