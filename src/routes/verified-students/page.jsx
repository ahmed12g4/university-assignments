import { useEffect, useState } from "react";
import { Footer } from "@/layouts/footer";
import { CheckCircle } from "lucide-react";

const VerifiedStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch students from API
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/students");
                if (!res.ok) throw new Error("Failed to fetch students");
                const data = await res.json();
                setStudents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching students:", err);

                // Dummy data fallback لو الـ API مش شغال
                setStudents([
                    { id: 1, fullName: "Ahmed Ali", email: "ahmed@test.com", stage: "First Year", section: "A" },
                    { id: 2, fullName: "Sara Mohamed", email: "sara@test.com", stage: "Second Year", section: "B" },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Verified Students</h1>

            <div className="card">
                <div className="card-header">
                    <p className="card-title">List of Registered Students</p>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <p className="p-4">Loading students...</p>
                    ) : students.length === 0 ? (
                        <p className="p-4 text-red-500">❌ No verified students found.</p>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="table">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-head">#</th>
                                        <th className="table-head">Name</th>
                                        <th className="table-head">Email</th>
                                        <th className="table-head">Stage</th>
                                        <th className="table-head">Section</th>
                                        <th className="table-head">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {students.map((student, i) => (
                                        <tr
                                            key={student.id || i}
                                            className="table-row"
                                        >
                                            <td className="table-cell">{i + 1}</td>
                                            <td className="table-cell">{student.fullName}</td>
                                            <td className="table-cell">{student.email}</td>
                                            <td className="table-cell">{student.stage?.name || student.stage}</td>
                                            <td className="table-cell">{student.section?.name || student.section}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-x-2">
                                                    <CheckCircle
                                                        className="text-green-600"
                                                        size={18}
                                                    />
                                                    Verified
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default VerifiedStudentsPage;
