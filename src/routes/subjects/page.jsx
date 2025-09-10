"use client";

import { useEffect, useState } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { Footer } from "@/layouts/footer";
import { useToast } from "@/components/ui/use-toast";
import ConfirmModal from "@/components/ConfirmModal";

const API_URL = "http://localhost:5000/api/subjects";

const SubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [confirmClear, setConfirmClear] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = res.ok ? await res.json() : [];
            setSubjects(Array.isArray(data) ? data : []);
        } catch {
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteSubject = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("فشل الحذف");
            setSubjects(subjects.filter((s) => s.id !== id));
            toast({ title: "✅ تم الحذف", description: "تم حذف المادة بنجاح" });
        } catch (err) {
            console.error(err);
            toast({ title: "❌ خطأ", description: "حدث خطأ أثناء حذف المادة", variant: "destructive" });
        } finally {
            setConfirmOpen(false);
            setSelectedSubject(null);
        }
    };

    const clearSubjects = async () => {
        try {
            await Promise.all(subjects.map((s) => fetch(`${API_URL}/${s.id}`, { method: "DELETE" })));
            setSubjects([]);
            toast({ title: "✅ تم مسح الكل", description: "تم حذف جميع المواد" });
        } catch (err) {
            console.error(err);
            toast({ title: "❌ خطأ", description: "حدث خطأ أثناء مسح المواد", variant: "destructive" });
        } finally {
            setConfirmClear(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col gap-6 bg-gray-50 p-6 dark:bg-slate-900">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">📖 المواد الجامعية</h1>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-lg text-gray-700 dark:text-gray-300">قائمة المواد</p>
                <button
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow transition hover:bg-red-700 disabled:opacity-50"
                    onClick={() => setConfirmClear(true)}
                    disabled={subjects.length === 0}
                >
                    <Trash2 size={18} />
                    مسح الكل
                </button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow dark:bg-slate-800">Loading...</div>
                ) : subjects.length === 0 ? (
                    <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow dark:bg-slate-800">لا توجد مواد حالياً</div>
                ) : (
                    <ul className="grid gap-3">
                        {subjects.map((s, i) => (
                            <li
                                key={s.id || i}
                                className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow transition hover:shadow-lg dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <BookOpen
                                        className="text-blue-500"
                                        size={20}
                                    />
                                    <span className="font-medium text-gray-800 dark:text-gray-100">{s.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {s.description && <span className="text-sm text-gray-500 dark:text-gray-400">{s.description}</span>}
                                    <button
                                        className="flex items-center gap-1 rounded-md bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
                                        onClick={() => {
                                            setSelectedSubject(s);
                                            setConfirmOpen(true);
                                        }}
                                    >
                                        <Trash2 size={16} /> حذف
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Confirm modal للحذف الفردي */}
            {confirmOpen && selectedSubject && (
                <ConfirmModal
                    open={confirmOpen}
                    title="تأكيد الحذف"
                    message={`هل أنت متأكد من حذف المادة "${selectedSubject.name}"؟`}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={() => deleteSubject(selectedSubject.id)}
                />
            )}

            {/* Confirm modal للحذف الكل */}
            {confirmClear && (
                <ConfirmModal
                    open={confirmClear}
                    title="تأكيد مسح الكل"
                    message="هل أنت متأكد من حذف جميع المواد؟ لا يمكن التراجع عن هذا."
                    onCancel={() => setConfirmClear(false)}
                    onConfirm={clearSubjects}
                />
            )}

            <Footer />
        </div>
    );
};

export default SubjectsPage;
