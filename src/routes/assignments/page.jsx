"use client";
import { useEffect, useState } from "react";
import { Footer } from "@/layouts/footer";
import { Pencil, Trash2, Trash } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

const API_BASE = "http://localhost:5000";

const AssignmentsPageStyled = () => {
    const [assignments, setAssignments] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/assignments`);
            if (!res.ok) throw new Error("API unavailable");
            const data = await res.json();
            setAssignments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn("❌ API failed, showing fallback:", err.message);
            setAssignments([]);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        try {
            const res = await fetch(`${API_BASE}/api/assignments/${selected.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setAssignments((prev) => prev.filter((a) => a.id !== selected.id));
            }
        } catch (err) {
            console.warn("❌ Error deleting, fallback skip:", err.message);
        }
        setConfirmOpen(false);
        setSelected(null);
    };

    const handleDeleteAll = async () => {
        try {
            for (let a of assignments) {
                await fetch(`${API_BASE}/api/assignments/${a.id}`, { method: "DELETE" });
            }
            setAssignments([]);
        } catch (err) {
            console.warn("❌ Error deleting all, fallback skip:", err.message);
            setAssignments([]);
        }
        setDeleteAllConfirm(false);
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-50 to-indigo-100 p-6 dark:from-gray-900 dark:to-gray-800 sm:p-8">
            <h1 className="mb-6 text-center text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 md:text-4xl">📚 إدارة الواجبات</h1>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setDeleteAllConfirm(true)}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 font-semibold text-white shadow-md transition hover:from-red-600 hover:to-red-700"
                >
                    <Trash size={16} /> مسح الكل
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl shadow-lg">
                <table className="min-w-full rounded-xl bg-white dark:bg-gray-900">
                    <thead className="bg-indigo-200 text-gray-700 dark:bg-indigo-700 dark:text-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">العنوان</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">المادة</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">تاريخ التسليم</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.length > 0 ? (
                            assignments.map((a) => (
                                <tr
                                    key={a.id}
                                    className="border-b border-gray-200 transition hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{a.title}</td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{a.subjectName}</td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{new Date(a.dueDate).toLocaleDateString()}</td>
                                    <td className="flex justify-center gap-2 px-6 py-4">
                                        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-sm font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-blue-700">
                                            <Pencil size={16} /> تعديل
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelected(a);
                                                setConfirmOpen(true);
                                            }}
                                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 text-sm font-semibold text-white shadow-md transition hover:from-red-600 hover:to-red-700"
                                        >
                                            <Trash2 size={16} /> حذف
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-300"
                                >
                                    لا يوجد واجبات متاحة حالياً
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* تأكيد الحذف الفردي */}
            <ConfirmModal
                open={confirmOpen}
                title="تأكيد الحذف"
                message={`هل أنت متأكد من حذف الواجب "${selected?.title}"؟`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />

            {/* تأكيد الحذف الكل */}
            <ConfirmModal
                open={deleteAllConfirm}
                title="تأكيد الحذف الكل"
                message="هل أنت متأكد من حذف جميع الواجبات؟"
                onCancel={() => setDeleteAllConfirm(false)}
                onConfirm={handleDeleteAll}
            />

            <Footer />
        </div>
    );
};

export default AssignmentsPageStyled;
