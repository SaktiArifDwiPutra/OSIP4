import { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function JadwalApelPage({ user }) {
  const [jadwal, setJadwal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const API = "https://bayudian.pplgsmkn4.my.id/lomba_api/src/api/";

  // Load dan filter jadwal
  const loadJadwal = () => {
    axios
      .get(API + "get_jadwal.php")
      .then((res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset jam agar hanya bandingkan tanggal

        const jadwalMendatang = res.data.filter((item) => {
          // Pastikan format tanggal valid (YYYY-MM-DD)
          const itemDate = new Date(item.Tanggal);
          // Abaikan data jika tanggal tidak valid
          if (isNaN(itemDate.getTime())) return false;
          return itemDate >= today;
        });

        setJadwal(jadwalMendatang);
      })
      .catch((err) => console.error("Gagal memuat jadwal:", err));
  };

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    loadJadwal();
  }, []);

  // Filter pencarian (hanya pada jadwal mendatang)
  const filteredJadwal = useMemo(() => {
    if (!searchTerm.trim()) return jadwal;

    const term = searchTerm.toLowerCase();
    return jadwal.filter(
      (item) =>
        item.Hari.toLowerCase().includes(term) ||
        item.Kelas.toLowerCase().includes(term) ||
        item.Tanggal.toLowerCase().includes(term)
    );
  }, [jadwal, searchTerm]);

  const openModal = (item, e) => {
    const x = e.clientX;
    const y = e.clientY;
    setClickPosition({ x, y });
    setSelectedJadwal(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJadwal(null);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Efek cahaya mouse */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />

      <div className="absolute top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Jadwal Apel</h2>

        <p className="text-gray-400 text-sm mb-6">
          Hanya menampilkan jadwal apel yang akan datang. Klik untuk lihat
          detail.
        </p>

        {/* Input Pencarian */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari jadwal (hari, kelas, tanggal)..."
              className="w-full p-3 pl-10 pr-4 rounded-lg bg-slate-900/60 border border-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Daftar Jadwal */}
        <div className="space-y-4">
          {filteredJadwal.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm
                  ? `Tidak ada jadwal mendatang yang cocok dengan "${searchTerm}".`
                  : "Tidak ada jadwal apel mendatang."}
              </p>
            </div>
          ) : (
            filteredJadwal.map((row) => (
              <div
                key={row.id_jadwal}
                onClick={(e) => openModal(row, e)}
                className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-4 cursor-pointer 
                  hover:bg-slate-800/70 transition-all duration-300 hover:border-blue-500/30"
              >
                <div className="font-semibold text-lg text-white">
                  {row.Hari}
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  {row.Tanggal} •{" "}
                  <span className="text-blue-300">{row.Kelas}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {user && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>💡 Login sebagai admin untuk menambah/mengedit jadwal.</p>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {isModalOpen && selectedJadwal && (
        <div
          style={{
            background: `radial-gradient(600px circle at ${clickPosition.x}px ${clickPosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
          }}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">Detail Jadwal</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-2xl font-light"
                >
                  &times;
                </button>
              </div>

              <div className="mt-4 space-y-3 text-gray-300">
                <div>
                  <span className="font-medium text-white">Hari:</span>{" "}
                  {selectedJadwal.Hari}
                </div>
                <div>
                  <span className="font-medium text-white">Tanggal:</span>{" "}
                  {selectedJadwal.Tanggal}
                </div>
                <div>
                  <span className="font-medium text-white">Kelas:</span>{" "}
                  <span className="text-blue-300">{selectedJadwal.Kelas}</span>
                </div>
              </div>

              {user && (
                <div className="mt-6 flex justify-end space-x-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
