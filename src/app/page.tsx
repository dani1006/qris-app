"use client";

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Sun, Moon, Scan, Info } from 'lucide-react';
// Import komponen UI buatan sendiri atau dari shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function QRISGenerator() {
  const [amount, setAmount] = useState('');
  const [qrisData, setQrisData] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Fungsi Kalkulasi CRC16 untuk Standar EMVCo (QRIS)
  const calculateCRC16 = (str: string): string => {
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
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue) {
      return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
    }
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Hanya izinkan angka
    const numeric = value.replace(/[^0-9]/g, '');
    setAmount(formatCurrency(numeric));
  };

  const generateQRIS = () => {
  if (!amount) return;
  
  const rawAmount = amount.replace(/[^0-9]/g, '');
  
  const part1 = "00020101021126610014COM.GO-JEK.WWW01189360091439373159350210G9373159350303UMI51440014ID.CO.QRIS.WWW0215ID10264800203400303UMI520450455303360";
  
  // BAGIAN 2: Dari Tag 58 (Country Code) sampai Tag 63 (CRC)
  const part2 = "5802ID5925Dani Kurnia, Komputer & S6008SEMARANG61055027462070703A016304";

  // Membentuk Tag 54 (Amount)
  const tag54 = `54${rawAmount.length.toString().padStart(2, '0')}${rawAmount}`;
  
  // Gabungkan: Part 1 + Tag 54 + Part 2
  const fullPayloadWithoutCRC = part1 + tag54 + part2;
  
  // Hitung ulang CRC16
  const finalCRC = calculateCRC16(fullPayloadWithoutCRC);
  
  setQrisData(fullPayloadWithoutCRC + finalCRC);
};

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <Card className={`w-full max-w-md p-8 rounded-3xl shadow-2xl transition-all border-none ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">QRIS Dinamis</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Generator Pembayaran Instan
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl transition-all ${
              darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-5">
          <div>
            <label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Nominal Transaksi
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-blue-500">Rp</span>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className={`pl-12 py-7 text-xl font-bold rounded-2xl border-2 transition-all ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-100 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          <Button
            onClick={generateQRIS}
            disabled={!amount || amount === '0'}
            className="w-full py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/40 transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            Buat Kode QR
          </Button>
        </div>

        {/* QR Display Area */}
        {qrisData ? (
          <div className={`mt-8 p-6 rounded-3xl border-2 border-dashed transition-all animate-in fade-in zoom-in duration-500 ${
            darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50/50 border-blue-100'
          }`}>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                <QRCodeSVG
                  value={qrisData}
                  size={200}
                  level="M"
                  includeMargin={false}
                />
              </div>
              
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Total Bayar</p>
                <p className="text-3xl font-black text-blue-600">Rp {amount}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 py-12 flex flex-col items-center justify-center opacity-30">
            <Info size={48} className="mb-2" />
            <p className="text-sm">Masukkan nominal untuk membuat QR</p>
          </div>
        )}

        <p className="text-center mt-6 text-[10px] text-gray-400 tracking-tighter">
          Make with ❤️ and 🍜 by dkrnw
        </p>
      </Card>
    </div>
  );
}