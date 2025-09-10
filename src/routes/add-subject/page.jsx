"use client";
import { useEffect, useState } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { Footer } from "@/layouts/footer";
import { useToast } from "@/components/ui/use-toast";
import ConfirmModal from "@/components/ConfirmModal";

const API_URL = "http://localhost:5000/api/subjects";

const AddSubjectPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const { toast } = useToast();

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = () => {
        fetch(API_URL)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setSubjects(Array.isArray(data) ? data : []))
            .catch(() => setSubjects([]));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
            if (!res.ok) throw new Error("فشل الإضافة");

            const data = await res.json();
            setSubjects((prev) => [...prev, data]);
            setName("");
            setDescription("");
            toast({ title: "✅ تمت الإضافة", description: `تمت إضافة المادة "${data.name}" بنجاح` });
        } catch (err) {
            console.error(err);
            toast({ title: "❌ خطأ", description: "حدث خطأ أثناء إضافة المادة", variant: "destructive" });
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

    const clearInputs = () => {
        setName("");
        setDescription("");
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-6 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-50 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-center text-3xl font-bold">📘 إدارة المواد</h1>

            {/* Form Section */}
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                <div className="rounded-lg bg-white p-6 shadow-md transition-colors duration-300 dark:bg-gray-800">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                        <BookOpen
                            size={24}
                            className="text-blue-400"
                        />
                        إضافة مادة جديدة
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="اسم المادة"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                            required
                        />
                        <textarea
                            placeholder="الوصف"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                        />
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-md bg-blue-600 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-700 dark:text-gray-50"
                            >
                                {loading ? "جاري الحفظ..." : "حفظ"}
                            </button>
                            <button
                                type="button"
                                onClick={clearInputs}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-500 py-2 font-medium text-white transition-colors duration-300 hover:bg-red-600"
                            >
                                <Trash2 size={16} /> مسح
                            </button>
                        </div>
                    </form>
                </div>

                {/* Subjects List */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-colors duration-300 dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold">قائمة المواد</h2>
                    {subjects.length === 0 ? (
                        <p className="text-center text-gray-400 dark:text-gray-300">لا توجد مواد بعد</p>
                    ) : (
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {subjects.map((subj) => (
                                <li
                                    key={subj.id}
                                    className="flex flex-col items-start gap-2 rounded-md bg-gray-100 p-4 shadow transition-colors duration-300 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <BookOpen
                                            className="text-blue-400"
                                            size={18}
                                        />
                                        <span>{subj.name}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-gray-600 dark:text-gray-300">{subj.description || "—"}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedSubject(subj);
                                                setConfirmOpen(true);
                                            }}
                                            className="flex items-center gap-1 rounded-md bg-red-500 px-3 py-1 text-sm text-white transition-colors duration-300 hover:bg-red-600"
                                        >
                                            <Trash2 size={16} /> حذف
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Confirm Modal */}
                {confirmOpen && selectedSubject && (
                    <ConfirmModal
                        open={confirmOpen}
                        title="تأكيد الحذف"
                        message={`هل أنت متأكد من حذف المادة "${selectedSubject.name}"؟`}
                        onCancel={() => setConfirmOpen(false)}
                        onConfirm={() => deleteSubject(selectedSubject.id)}
                    />
                )}
            </div>

            <Footer />
        </div>
    );
};

export default AddSubjectPage;
