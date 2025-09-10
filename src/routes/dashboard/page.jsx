/* eslint-disable no-unused-vars */
// src/pages/DashboardPage.jsx
import { useEffect, useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Footer } from "@/layouts/footer";
import { BookOpen, ClipboardCheck, Users, AlertTriangle, Bot } from "lucide-react";

const API_BASE = "http://localhost:5000";

const DashboardPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [students, setStudents] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [botStats, setBotStats] = useState({ users: 0, messages: 0 });
    const [overviewData, setOverviewData] = useState([]);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [topStudents, setTopStudents] = useState([]);

    const fetchSafe = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed: ${url}`);
            return await res.json();
        } catch (err) {
            console.warn("API failed:", url, err.message);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const [a, s, st, w, b] = await Promise.all([
                fetchSafe(`${API_BASE}/api/assignments`),
                fetchSafe(`${API_BASE}/api/submissions`),
                fetchSafe(`${API_BASE}/api/students`),
                fetchSafe(`${API_BASE}/api/warnings`),
                fetchSafe(`${API_BASE}/api/bot/stats`),
            ]);

            setAssignments(Array.isArray(a) ? a : []);
            setSubmissions(Array.isArray(s) ? s : []);
            setStudents(Array.isArray(st) ? st : []);
            setWarnings(Array.isArray(w) ? w : []);
            setBotStats(b || { users: 0, messages: 0 });

            const monthMap = {};
            (Array.isArray(s) ? s : []).forEach((sub) => {
                const date = sub.submittedAt || sub.createdAt || sub.date || new Date().toISOString();
                const month = new Date(date).toLocaleString("default", { month: "short" });
                monthMap[month] = (monthMap[month] || 0) + 1;
            });
            setOverviewData(Object.entries(monthMap).map(([name, total]) => ({ name, total })));

            setRecentSubmissions((Array.isArray(s) ? s : []).slice(-5).reverse());

            const studentMap = {};
            (Array.isArray(s) ? s : []).forEach((sub) => {
                const student = sub.studentName || sub.name || `#${sub.studentId || "N/A"}`;
                studentMap[student] = (studentMap[student] || 0) + 1;
            });
            const topArr = Object.entries(studentMap)
                .map(([name, submissions]) => ({ name, submissions }))
                .sort((a, b) => b.submissions - a.submissions)
                .slice(0, 10);
            setTopStudents(topArr);
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-y-4 dark:bg-black dark:text-gray-50 min-h-screen">
            <h1 className="title dark:text-gray-50">Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[
                    { title: "Assignments", value: assignments.length, icon: BookOpen, color: "blue" },
                    { title: "Submissions", value: submissions.length, icon: ClipboardCheck, color: "green" },
                    { title: "Students", value: students.length, icon: Users, color: "purple" },
                    { title: "Warnings", value: warnings.length, icon: AlertTriangle, color: "red" },
                    { title: "Bot Users", value: botStats.users, icon: Bot, color: "sky", extra: botStats.messages + " messages" },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="card dark:bg-gray-900 dark:text-gray-50">
                            <div className="card-header">
                                <div className={`w-fit rounded-lg bg-${card.color}-500/20 p-2 text-${card.color}-500`}>
                                    <Icon size={26} />
                                </div>
                                <p className="card-title dark:text-gray-50">{card.title}</p>
                            </div>
                            <div className="card-body dark:bg-gray-800">
                                <p className="text-3xl font-bold dark:text-gray-50">{card.value}</p>
                                {card.extra && <p className="text-sm dark:text-gray-400">{card.extra}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Overview Chart */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4 dark:bg-gray-900 dark:text-gray-50">
                    <div className="card-header">
                        <p className="card-title dark:text-gray-50">Overview</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={overviewData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip formatter={(v) => `${v} submissions`} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" allowDecimals={false} />
                                <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Submissions */}
                <div className="card col-span-1 md:col-span-2 lg:col-span-3 dark:bg-gray-900 dark:text-gray-50">
                    <div className="card-header">
                        <p className="card-title dark:text-gray-50">Recent Submissions</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        {recentSubmissions.length > 0 ? (
                            recentSubmissions.map((sub, i) => (
                                <div key={sub.id || i} className="flex items-center justify-between gap-x-4 py-2 pr-2">
                                    <div className="flex items-center gap-x-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-gray-300">
                                            {sub.studentName?.charAt(0) || "?"}
                                        </div>
                                        <div className="flex flex-col gap-y-1">
                                            <p className="font-medium dark:text-gray-50">{sub.studentName || sub.name || `#${sub.studentId}`}</p>
                                            <p className="text-sm dark:text-gray-400">{sub.assignment || sub.assignmentTitle}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium dark:text-gray-50">{sub.status || "Pending"}</p>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-sm dark:text-gray-400">No recent submissions</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Students */}
            <div className="card dark:bg-gray-900 dark:text-gray-50">
                <div className="card-header">
                    <p className="card-title dark:text-gray-50">Top Students</p>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full overflow-auto">
                        <table className="table dark:bg-gray-900 dark:text-gray-50">
                            <thead className="table-header dark:bg-gray-800 dark:text-gray-50">
                                <tr className="table-row">
                                    <th className="table-head dark:text-gray-50">#</th>
                                    <th className="table-head dark:text-gray-50">Student</th>
                                    <th className="table-head dark:text-gray-50">Submissions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {topStudents.length > 0 ? (
                                    topStudents.map((student, i) => (
                                        <tr key={i} className="table-row">
                                            <td className="table-cell dark:text-gray-50">{i + 1}</td>
                                            <td className="table-cell dark:text-gray-50">{student.name}</td>
                                            <td className="table-cell dark:text-gray-50">{student.submissions}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-center text-sm dark:text-gray-400">
                                            No top students data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardPage;
