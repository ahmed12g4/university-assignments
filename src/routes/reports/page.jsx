import { useEffect, useState } from "react";
import { Footer } from "@/layouts/footer";

const ReportsPage = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5100/api/reports")
            .then((res) => res.json())
            .then((data) => setReports(data));
    }, []);

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">📑 Reports</h1>
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Assignment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((r) => (
                            <tr key={r.id}>
                                <td>{r.studentName}</td>
                                <td>{r.assignmentTitle}</td>
                                <td>{r.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default ReportsPage;
