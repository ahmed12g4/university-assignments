import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
    const { user, login, loading } = useAuth(); // ✅ ناخد loading
    const { toast } = useToast();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username && password) {
            login({ username });
            toast({
                title: "👋 مرحباً بك!",
                description: `تم تسجيل الدخول كـ ${username}`,
                variant: "default",
            });
        } else {
            toast({
                title: "⚠️ خطأ",
                description: "الرجاء إدخال اسم المستخدم وكلمة المرور",
                variant: "destructive",
            });
        }
    };

    if (loading) return null; // ✅ ما نعملش Redirect قبل ما loading يخلص
    if (user)
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    return (
        <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
            <form
                onSubmit={handleSubmit}
                className="flex w-[320px] flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800"
            >
                <h1 className="text-center text-xl font-semibold">تسجيل الدخول</h1>
                <input
                    type="text"
                    placeholder="اسم المستخدم"
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="كلمة المرور"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="btn-primary"
                >
                    تسجيل الدخول
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
