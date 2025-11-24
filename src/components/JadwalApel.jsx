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

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-4">📅 Jadwal Apel</h2>

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
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
