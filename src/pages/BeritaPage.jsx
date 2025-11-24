// src/pages/BeritaPage.jsx
import BeritaCard from "../components/BeritaCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function BeritaPage({ user }) {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    isi: "",
    // Tidak perlu id_guru di state form — kita kirim langsung dari user.id
  });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = "https://bayudian.pplgsmkn4.my.id/lomba_api/src/api";

  const loadBerita = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_berita.php`);
      setBeritaList(res.data);
    } catch (err) {
      console.error("Gagal memuat berita:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBerita();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTambah = async (e) => {
    e.preventDefault();
    if (!form.judul.trim() || !form.isi.trim()) {
      alert("Judul dan isi wajib diisi!");
      return;
    }

    if (!user || !user.id) {
      alert("Anda harus login!");
      return;
    }

    setSubmitting(true);
    try {
      // Kirim user.id sebagai id_guru
      await axios.post(`${API_BASE}/add_berita.php`, {
        judul: form.judul,
        isi: form.isi,
        id_guru: user.id, // ← langsung dari user.id
      });
      alert("Berita berhasil ditambahkan!");
      setForm({ judul: "", isi: "" });
      setShowForm(false);
      loadBerita();
    } catch (err) {
      console.error("Error:", err);
      alert("Gagal menambah berita.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHapus = async (id) => {
    if (!confirm("Yakin hapus berita ini?")) return;
    try {
      await axios.post(`${API_BASE}/delete_berita.php`, { id });
      loadBerita();
    } catch (err) {
      console.error("Error hapus:", err);
      alert("Gagal menghapus berita.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-300 min-h-screen bg-[#0C112A]">
        <p>Memuat berita...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-gray-300 min-h-screen bg-[#0C112A]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">📰 Berita Terbaru</h1>
        {user && user.id && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? "Batal" : "Tambah Berita"}
          </button>
        )}
      </div>

      {/* Form Tambah Berita (tanpa dropdown guru) */}
      {showForm && user && user.id && (
        <div className="bg-[#0A0F2D] p-6 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Tambah Berita Baru</h2>
          <form onSubmit={handleTambah}>
            {/* Opsional: Tampilkan info bahwa berita dikaitkan ke user.id */}
            <div className="mb-4 text-sm text-gray-400">
              Berita akan dikaitkan ke ID: <span className="font-mono">{user.id}</span>
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleInputChange}
                placeholder="Judul berita..."
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="isi"
                value={form.isi}
                onChange={handleInputChange}
                rows="5"
                placeholder="Isi berita..."
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              {submitting ? "Menyimpan..." : "Simpan Berita"}
            </button>
          </form>
        </div>
      )}

      {/* Daftar Berita */}
      {beritaList.length === 0 ? (
        <p className="text-gray-500">Tidak ada berita tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beritaList.map((item) => (
            <BeritaCard
              key={item.id}
              data={item}
              onHapus={user ? () => handleHapus(item.id) : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}