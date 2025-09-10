import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ بيانات ديمو ثابتة
        const demoUser = { username: "demo", password: "123456" };

        if (form.username === demoUser.username && form.password === demoUser.password) {
            const fakeUser = { id: 1, name: "Demo User", email: "demo@example.com" };
            login(fakeUser);
            navigate("/dashboard");
        } else {
            setError("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow dark:bg-slate-800">
                <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">تسجيل الدخول</h1>

                {/* ✅ رسالة خطأ احترافية */}
                {error && (
                    <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 p-3 font-medium text-white hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>

                {/* ✅ رسالة "سجّل بحساب ديمو" */}
                <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    🧪 جرّب الدخول بحساب ديمو:
                    <div className="mt-2 flex flex-col gap-1 font-mono text-[13px]">
                        <span>👤 <b>Username:</b> demo</span>
                        <span>🔑 <b>Password:</b> 123456</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
