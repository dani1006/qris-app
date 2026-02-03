export function generateDynamicQRIS(staticQRIS: string, amount: string) {
  // 1. Hapus CRC16 lama (4 karakter terakhir)
  let baseQRIS = staticQRIS.slice(0, -4);
  
  // 2. Tambahkan/Ganti Tag 54 (Nominal)
  // Format: Tag(54) + Panjang Karakter + Nilai
  const amountTag = "54" + amount.length.toString().padStart(2, '0') + amount;
  
  // Cari apakah Tag 54 sudah ada, jika ada replace, jika tidak sisipkan sebelum Tag 58 (Country Code)
  if (baseQRIS.includes("54")) {
     baseQRIS = baseQRIS.replace(/54\d{2}\d+/, amountTag);
  } else {
     const splitPoint = baseQRIS.indexOf("5802ID");
     baseQRIS = baseQRIS.slice(0, splitPoint) + amountTag + baseQRIS.slice(splitPoint);
  }

  return baseQRIS + calculateCRC16(baseQRIS);
}

function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}