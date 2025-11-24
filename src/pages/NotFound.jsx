import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      {/* Garis aksen biru tipis di atas halaman */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500"></div>

      <div className="max-w-lg w-full text-center space-y-8">
        {/* Ilustrasi Error (opsional: bisa ganti dengan SVG/emoji) */}
        <div className="text-6xl sm:text-8xl font-bold text-blue-400 mb-2">
          404
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
            Jangan khawatir — Anda bisa kembali ke beranda atau jelajahi konten
            lainnya.
          </p>
        </div>

        {/* Tombol navigasi */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Footer mini (opsional, sesuai tema) */}
      <div className="mt-16 text-center text-gray-500 text-sm max-w-2xl">
        <p className="mb-4">
          OSIP4 — Wadah kreativitas siswa SMKN 4 Padalarang
        </p>
      </div>
    </div>
  );
}
