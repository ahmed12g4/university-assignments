import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, username, email, password }),
            });

            if (!res.ok) throw new Error("فشل تسجيل الحساب");

            const data = await res.json();
            console.log("✅ Registered:", data);

            navigate("/login");
        } catch (err) {
            alert("خطأ: " + err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
            >
                <h2 className="text-center text-2xl font-bold">تسجيل حساب جديد</h2>
                <input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                />
                <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                />
                <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                />
                <button
                    type="submit"
                    className="w-full rounded bg-green-600 px-3 py-2 text-white"
                >
                    تسجيل
                </button>
            </form>
        </div>
    );
}
