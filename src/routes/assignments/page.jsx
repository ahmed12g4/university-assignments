import { useEffect, useState } from "react";
import { Footer } from "@/layouts/footer";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

const API_BASE = "http://localhost:5000";

const AssignmentsPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);

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
            // fallback: مصفوفة فارغة لمنع أي خطأ
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
            } else {
                console.warn("❌ Failed to delete assignment, fallback skip");
            }
        } catch (err) {
            console.warn("❌ Error deleting, fallback skip:", err.message);
        }
        setConfirmOpen(false);
        setSelected(null);
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">📚 الواجبات</h1>
            <div className="card overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>العنوان</th>
                            <th>المادة</th>
                            <th>تاريخ التسليم</th>
                            <th className="text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.length > 0 ? (
                            assignments.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.title}</td>
                                    <td>{a.subjectName}</td>
                                    <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                                    <td className="flex justify-center gap-2">
                                        <button className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1 text-sm text-white transition hover:bg-blue-600">
                                            <Pencil size={16} /> تعديل
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelected(a);
                                                setConfirmOpen(true);
                                            }}
                                            className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
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
                                    className="text-center text-gray-500"
                                >
                                    لا يوجد واجبات
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                open={confirmOpen}
                title="تأكيد الحذف"
                message={`هل أنت متأكد من حذف الواجب "${selected?.title}"؟`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />

            <Footer />
        </div>
    );
};

export default AssignmentsPage;
