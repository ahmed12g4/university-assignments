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
        <div className="flex min-h-screen flex-col bg-black px-4 py-6 text-gray-50 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-center text-3xl font-bold">📘 إدارة المواد</h1>

            {/* Form Section */}
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                <div className="rounded-lg bg-gray-900 p-6 shadow-md">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                        <BookOpen
                            size={24}
                            className="text-yellow-400"
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
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                        <textarea
                            placeholder="الوصف"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[80px] w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-md bg-yellow-600 py-2 font-semibold text-black transition hover:bg-yellow-700"
                            >
                                {loading ? "جاري الحفظ..." : "حفظ"}
                            </button>
                            <button
                                type="button"
                                onClick={clearInputs}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gray-700 py-2 font-medium text-gray-200 transition hover:bg-gray-600"
                            >
                                <Trash2 size={16} /> مسح
                            </button>
                        </div>
                    </form>
                </div>

                {/* Subjects List */}
                <div className="rounded-lg bg-gray-900 p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-semibold">قائمة المواد</h2>
                    {subjects.length === 0 ? (
                        <p className="text-center text-gray-400">لا توجد مواد بعد</p>
                    ) : (
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {subjects.map((subj) => (
                                <li
                                    key={subj.id}
                                    className="flex flex-col items-start gap-2 rounded-md bg-gray-800 p-4 shadow sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <BookOpen
                                            className="text-yellow-400"
                                            size={18}
                                        />
                                        <span>{subj.name}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-gray-300">{subj.description || "—"}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedSubject(subj);
                                                setConfirmOpen(true);
                                            }}
                                            className="flex items-center gap-1 rounded-md bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
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
