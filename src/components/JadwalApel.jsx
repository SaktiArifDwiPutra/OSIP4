import { useEffect, useState } from "react";
import axios from "axios";

export default function JadwalApelPage({ user }) {
  const [jadwal, setJadwal] = useState([]);
  const [form, setForm] = useState({ Hari: "", Tanggal: "", Kelas: "" });

  const API = "https://bayudian.pplgsmkn4.my.id/lomba_api/src/api/";

  // Load data jadwal
  const loadJadwal = () => {
    axios
      .get(API + "get_jadwal.php")
      .then((res) => setJadwal(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadJadwal();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const tambahJadwal = (e) => {
    e.preventDefault();
    if (!user) return alert("Anda harus login untuk menambah jadwal!");
    if (!form.Hari || !form.Tanggal || !form.Kelas)
      return alert("Semua field wajib diisi");

    axios
      .post(API + "add_jadwal.php", form, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.data.status === "success") {
          alert("Jadwal Ditambahkan!");
          loadJadwal(); // reload dari database biar id_jadwal valid
          setForm({ Hari: "", Tanggal: "", Kelas: "" });
        } else {
          alert(res.data.message || "Gagal menambah jadwal");
        }
      })
      .catch((err) => console.error(err));
  };

  const deleteJadwal = (id) => {
    if (!user) return alert("Anda harus login untuk menghapus jadwal!");

    axios
      .post(
        API + "delete_jadwal.php",
        { id },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        if (res.data.status === "success") {
          alert("Jadwal Dihapus!");
          setJadwal((prev) => prev.filter((row) => row.id_jadwal !== id));
        } else {
          alert(res.data.message || "Gagal menghapus jadwal");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-4">📅 Jadwal Apel</h2>

      {user && (
        <form
          onSubmit={tambahJadwal}
          className="bg-white dark:bg-gray-700 p-4 rounded shadow mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="Hari"
              placeholder="Hari"
              value={form.Hari}
              onChange={handleInput}
              className="p-2 rounded bg-gray-100 dark:bg-gray-800"
              required
            />
            <input
              type="date"
              name="Tanggal"
              value={form.Tanggal}
              onChange={handleInput}
              className="p-2 rounded bg-gray-100 dark:bg-gray-800"
              required
            />
            <input
              type="text"
              name="Kelas"
              placeholder="Kelas"
              value={form.Kelas}
              onChange={handleInput}
              className="p-2 rounded bg-gray-100 dark:bg-gray-800"
              required
            />
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Tambah
          </button>
        </form>
      )}

      <table className="w-full text-left bg-white dark:bg-gray-700 rounded shadow">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="p-3">Hari</th>
            <th className="p-3">Tanggal</th>
            <th className="p-3">Kelas</th>
            {user && <th className="p-3">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {jadwal.map((row) => (
            <tr
              key={row.id_jadwal}
              className="border-t border-gray-300 dark:border-gray-600"
            >
              <td className="p-3">{row.Hari}</td>
              <td className="p-3">{row.Tanggal}</td>
              <td className="p-3">{row.Kelas}</td>
              {user && (
                <td className="p-3">
                  <button
                    onClick={() => deleteJadwal(row.id_jadwal)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Hapus
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!user && (
        <p className="mt-4 text-red-500">
          Login untuk menambah atau menghapus jadwal.
        </p>
      )}
    </div>
  );
}
