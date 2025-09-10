/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Check, X, Download, Trash2 } from "lucide-react";
import { Footer } from "@/layouts/footer";
import { useToast } from "@/components/ui/use-toast";

const API_URL = "http://localhost:5000/api/submissions";

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(""); // رسالة خطأ
    const { toast } = useToast();

    // Fetch submissions from API
    const fetchSubmissions = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setSubmissions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setSubmissions([]); // افتراضيًا فاضي
            setErrorMsg("⚠️ تعذر تحميل التسليمات من السيرفر، عرض بيانات تجريبية فقط.");
            toast({ title: "❌ خطأ", description: "فشل تحميل التسليمات", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    // Update submission state
    const updateState = async (id, newState) => {
        try {
            const res = await fetch(`${API_URL}/${id}/state`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newState),
            });
            if (!res.ok) throw new Error("Failed to update state");

            const updated = await res.json();
            setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
            toast({ title: "✅ تم التحديث", description: `تم تغيير حالة التسليم بنجاح` });
        } catch (err) {
            console.error(err);
            toast({ title: "❌ خطأ", description: "فشل تغيير الحالة", variant: "destructive" });
        }
    };

    // Delete submission
    const deleteSubmission = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا الواجب؟")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            setSubmissions((prev) => prev.filter((s) => s.id !== id));
            toast({ title: "✅ تم الحذف", description: "تم حذف التسليم بنجاح" });
        } catch (err) {
            console.error(err);
            toast({ title: "❌ خطأ", description: "فشل حذف التسليم", variant: "destructive" });
        }
    };

    return (
        <div className="flex min-h-screen flex-col gap-6 bg-gray-50 p-4 dark:bg-slate-900">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">📑 Submissions</h1>

            {errorMsg && <div className="rounded bg-yellow-100 px-4 py-2 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{errorMsg}</div>}

            {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : submissions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">لا توجد تسليمات حالياً</div>
            ) : (
                <div className="grid gap-4">
                    {submissions.map((s) => (
                        <div
                            key={s.id}
                            className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow transition hover:shadow-lg dark:bg-slate-800"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-gray-900 dark:text-gray-50">{s.assignmentTitle}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Student: {s.studentName}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Submitted At: {new Date(s.submittedAt).toLocaleString()}
                                    </span>
                                    <span className="text-sm font-medium">
                                        State: {s.state === 0 ? "Pending" : s.state === 1 ? "Accepted" : "Rejected"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={s.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                                    >
                                        <Download size={16} />
                                        Download
                                    </a>
                                    <button
                                        onClick={() => updateState(s.id, 1)}
                                        className="flex items-center gap-1 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                                    >
                                        <Check size={16} />
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => updateState(s.id, 2)}
                                        className="flex items-center gap-1 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                                    >
                                        <X size={16} />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => deleteSubmission(s.id)}
                                        className="flex items-center gap-1 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Footer />
        </div>
    );
}
