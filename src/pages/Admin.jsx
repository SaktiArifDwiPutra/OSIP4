// LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← tambahkan ini
import axios from "axios";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // untuk redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Username dan Password wajib diisi");

    setLoading(true);

    try {
      const response = await axios.post(
        "https://bayudian.pplgsmkn4.my.id/lomba_api/src/api/login.php",
        { username, password }
      );

      const data = response.data;

      if (data.status === "success") {
        // Simpan user ke localStorage agar tetap login setelah refresh
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect ke halaman utama
        navigate("/", { replace: true }); // replace: true agar tidak bisa kembali ke login via back button
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-white text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-75"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}