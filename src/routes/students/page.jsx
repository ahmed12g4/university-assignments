"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

const API_BASE = "http://localhost:5000";

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: "", type: "error" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/students`);
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setStudents(data);
        } catch (err) {
            console.error(err);
            showAlert("فشل في تحميل الطلاب: " + err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, type = "error") => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: "", type }), 4000);
    };

    const handleDelete = async () => {
        if (!selected) return;
        try {
            const res = await fetch(`${API_BASE}/api/students/${selected.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());
            setConfirmOpen(false);
            setSelected(null);
            loadStudents();
            showAlert("✅ تم حذف الطالب بنجاح", "success");
        } catch (err) {
            console.error(err);
            showAlert("فشل في حذف الطالب: " + err.message, "error");
        }
    };

    return (
        <div className="flex min-h-screen flex-col gap-6 bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 md:p-8">
            <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">👩‍🎓 الطلاب</h1>

            {/* Alert */}
            {alert.show && (
                <div
                    className={`fixed right-4 top-4 z-50 flex w-80 items-center justify-between gap-3 rounded-lg px-4 py-2 shadow-lg ${alert.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                >
                    <span className="truncate">{alert.message}</span>
                    <button onClick={() => setAlert({ ...alert, show: false })}>
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl bg-white shadow-md dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">الاسم</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">اسم المستخدم</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">الإيميل</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">الصف</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">القسم</th>
                            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-300"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : students.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-300"
                                >
                                    لا يوجد طلاب
                                </td>
                            </tr>
                        ) : (
                            students.map((s) => (
                                <tr
                                    key={s.id}
                                    className="transition hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{s.fullName}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{s.username}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{s.email}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{s.stage}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{s.section}</td>
                                    <td className="flex justify-center gap-2 px-4 py-2">
                                        <button className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1 text-white transition hover:bg-blue-600">
                                            <Pencil size={16} /> تعديل
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelected(s);
                                                setConfirmOpen(true);
                                            }}
                                            className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1 text-white transition hover:bg-red-600"
                                        >
                                            <Trash2 size={16} /> حذف
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                open={confirmOpen}
                title="تأكيد الحذف"
                message={`هل أنت متأكد من حذف الطالب "${selected?.fullName}"؟`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
