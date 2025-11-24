// components/BeritaPage.jsx
import { useState, useEffect } from "react";

export default function BeritaPage() {
  const [berita, setBerita] = useState([]);

  useEffect(() => {
    fetch("https://bayudian.pplgsmkn4.my.id/lomba_api/src/api/get_jadwal.php")
      .then((res) => res.json())
      .then((data) => setBerita(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📰 Berita</h2>
      <ul className="space-y-3">
        {berita.map((item) => (
          <li key={item.id} className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold">{item.judul}</h3>
            <p>{item.isi}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
