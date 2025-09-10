/* eslint-disable no-unused-vars */
// src/pages/AnalyticsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Legend, Cell } from "recharts";
import { Footer } from "@/layouts/footer";
import { TrendingUp, ClipboardCheck, Users, AlertTriangle, Bot, Download, Filter } from "lucide-react";

const API_BASE = "http://localhost:5000";

const STAGE_MAP = {
    1: "الصف الأول الثانوي",
    2: "الصف الثاني الثانوي",
    3: "الصف الثالث الثانوي",
};

const fmtDate = (d) => {
    if (!d) return "";
    const dd = new Date(d);
    if (Number.isNaN(dd.getTime())) return "";
    const y = dd.getFullYear();
    const m = `${dd.getMonth() + 1}`.padStart(2, "0");
    const day = `${dd.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const toDayKey = (d) => fmtDate(d);

const downloadCSV = (rows, filename = "analytics.csv") => {
    if (!rows?.length) return;
    const headers = Object.keys(rows[0]);
    const body = rows
        .map((r) =>
            headers
                .map((h) => {
                    const v = r[h] ?? "";
                    const s = typeof v === "string" ? v : JSON.stringify(v);
                    return `"${String(s).replaceAll('"', '""')}"`;
                })
                .join(","),
        )
        .join("\n");
    const csv = [headers.join(","), body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    a.click();
    URL.revokeObjectURL(url);
};

// ---- تعديل هنا: fetchSafe ----
const fetchSafe = async (url, fallback = []) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed: ${url}`);
        return await res.json();
    } catch (err) {
        console.warn("API failed:", url, err.message);
        return fallback;
    }
};

const AnalyticsPage = () => {
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [botStats, setBotStats] = useState({ users: 0, messages: 0 });
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const [stageFilter, setStageFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setErrorMsg("");

            const stFallback = [{ id: 1, fullName: "Demo Student", stageId: 1, sectionName: "Demo Section" }];
            const asgFallback = [{ id: 1, title: "Demo Assignment" }];
            const subsFallback = [
                {
                    id: 1,
                    studentId: 1,
                    studentName: "Demo Student",
                    assignment: "Demo Assignment",
                    status: "Pending",
                    submittedAt: new Date().toISOString(),
                },
            ];
            const warnsFallback = [{ id: 1, message: "Demo Warning" }];
            const botFallback = { users: 5, messages: 10 };

            try {
                const [st, asg, subs, warns, bot] = await Promise.all([
                    fetchSafe(`${API_BASE}/api/students`, stFallback),
                    fetchSafe(`${API_BASE}/api/assignments`, asgFallback),
                    fetchSafe(`${API_BASE}/api/submissions`, subsFallback),
                    fetchSafe(`${API_BASE}/api/warnings`, warnsFallback),
                    fetchSafe(`${API_BASE}/api/bot/stats`, botFallback),
                ]);

                setStudents(Array.isArray(st) ? st : stFallback);
                setAssignments(Array.isArray(asg) ? asg : asgFallback);
                setSubmissions(Array.isArray(subs) ? subs : subsFallback);
                setWarnings(Array.isArray(warns) ? warns : warnsFallback);
                setBotStats(bot && typeof bot === "object" ? bot : botFallback);
            } catch (e) {
                console.error(e);
                setErrorMsg("تعذر تحميل البيانات الحقيقية، عرض بيانات تجريبية فقط.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const studentsNormalized = useMemo(() => {
        return students.map((s) => ({
            ...s,
            stageTxt: s.stage || STAGE_MAP[s.stageId] || "غير محدد",
            sectionTxt: s.section || s.sectionName || "غير محدد",
        }));
    }, [students]);

    const submissionsFiltered = useMemo(() => {
        const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
        const toTs = dateTo ? new Date(dateTo).getTime() : null;

        return submissions.filter((s) => {
            const ts = s.submittedAt ? new Date(s.submittedAt).getTime() : null;
            let okStage = true;
            if (stageFilter) {
                const stu = studentsNormalized.find((x) => x.id === s.studentId);
                okStage = stu?.stageTxt === stageFilter;
            }
            let okFrom = fromTs ? ts >= fromTs : true;
            let okTo = toTs ? ts <= toTs : true;
            return okStage && okFrom && okTo;
        });
    }, [submissions, studentsNormalized, stageFilter, dateFrom, dateTo]);

    const kpi = useMemo(
        () => ({
            totalStudents: studentsNormalized.length,
            totalAssignments: assignments.length,
            totalSubmissions: submissionsFiltered.length,
            totalWarnings: warnings.length,
        }),
        [studentsNormalized, assignments, submissionsFiltered, warnings],
    );

    const submissionsSeries = useMemo(() => {
        const byDay = {};
        const src = submissionsFiltered.length ? submissionsFiltered : submissions;
        src.forEach((s) => {
            const key = toDayKey(s.submittedAt);
            if (!key) return;
            byDay[key] = (byDay[key] || 0) + 1;
        });
        return Object.entries(byDay)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([day, total]) => ({ day, total }));
    }, [submissionsFiltered, submissions]);

    const studentsByStage = useMemo(() => {
        const map = {};
        studentsNormalized.forEach((s) => {
            const key = s.stageTxt;
            map[key] = (map[key] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [studentsNormalized]);

    const submissionStatus = useMemo(() => {
        const map = {};
        const src = submissionsFiltered.length ? submissionsFiltered : submissions;
        src.forEach((s) => {
            const status = s.status || (s.score != null ? "Graded" : "Submitted") || "Unknown";
            map[status] = (map[status] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [submissionsFiltered, submissions]);

    const topStudents = useMemo(() => {
        const map = {};
        const src = submissionsFiltered.length ? submissionsFiltered : submissions;
        src.forEach((s) => {
            const student = studentsNormalized.find((x) => x.id === s.studentId);
            const name = student?.fullName || s.studentName || `#${s.studentId || "N/A"}`;
            map[name] = (map[name] || 0) + 1;
        });
        return Object.entries(map)
            .map(([name, submissions]) => ({ name, submissions }))
            .sort((a, b) => b.submissions - a.submissions)
            .slice(0, 10);
    }, [submissionsFiltered, submissions, studentsNormalized]);

    return (
        <div className="flex min-h-screen flex-col gap-y-4 dark:bg-black dark:text-gray-50">
            <h1 className="title dark:text-gray-50">Analytics</h1>

            {/* Filters */}
            <div className="card dark:bg-gray-900 dark:text-gray-50">
                <div className="card-header justify-between">
                    <p className="card-title flex items-center gap-2 dark:text-gray-50">
                        <Filter size={18} /> Filters
                    </p>
                    <button
                        className="btn-secondary"
                        onClick={() => {
                            setStageFilter("");
                            setDateFrom("");
                            setDateTo("");
                        }}
                    >
                        Reset
                    </button>
                </div>
                <div className="card-body grid grid-cols-1 gap-3 md:grid-cols-4">
                    <select
                        className="input dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50"
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                    >
                        <option value="">الكل - كل الصفوف</option>
                        <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                        <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                        <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                    </select>
                    <input
                        type="date"
                        className="input dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        placeholder="من تاريخ"
                    />
                    <input
                        type="date"
                        className="input dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        placeholder="إلى تاريخ"
                    />
                    <button
                        className="btn-primary"
                        onClick={() => {
                            const rows = submissionsFiltered.map((s) => {
                                const student = studentsNormalized.find((x) => x.id === s.studentId);
                                return {
                                    id: s.id,
                                    studentName: student?.fullName || s.studentName || "",
                                    assignment: s.assignment || "",
                                    status: s.status || "",
                                    submittedAt: s.submittedAt || "",
                                };
                            });
                            downloadCSV(rows, "submissions.csv");
                        }}
                    >
                        <Download
                            size={16}
                            className="mr-1 inline"
                        />
                        Download CSV
                    </button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Students", value: kpi.totalStudents, icon: Users, color: "purple" },
                    { title: "Assignments", value: kpi.totalAssignments, icon: TrendingUp, color: "green" },
                    { title: "Submissions", value: kpi.totalSubmissions, icon: ClipboardCheck, color: "yellow" },
                    { title: "Warnings", value: kpi.totalWarnings, icon: AlertTriangle, color: "red" },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={i}
                            className="card dark:bg-gray-900 dark:text-gray-50"
                        >
                            <div className="card-header gap-2">
                                <div className={`w-fit rounded-lg bg-${card.color}-500/20 p-2 text-${card.color}-500`}>
                                    <Icon size={26} />
                                </div>
                                <p className="card-title dark:text-gray-50">{card.title}</p>
                            </div>
                            <div className="card-body dark:bg-gray-800">
                                <p className="text-3xl font-bold dark:text-gray-50">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="card dark:bg-gray-900 dark:text-gray-50">
                    <div className="card-header dark:text-gray-50">Submissions Over Time</div>
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <LineChart data={submissionsSeries}>
                                <CartesianGrid stroke="#444" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#aaa"
                                />
                                <YAxis
                                    stroke="#aaa"
                                    allowDecimals={false}
                                />
                                <Tooltip formatter={(v) => `${v} submissions`} />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#facc15"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card dark:bg-gray-900 dark:text-gray-50">
                    <div className="card-header dark:text-gray-50">Students by Stage</div>
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <BarChart data={studentsByStage}>
                                <CartesianGrid stroke="#444" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#aaa"
                                />
                                <YAxis
                                    stroke="#aaa"
                                    allowDecimals={false}
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#a78bfa"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card dark:bg-gray-900 dark:text-gray-50">
                    <div className="card-header dark:text-gray-50">Submissions Status</div>
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <PieChart>
                                <Pie
                                    data={submissionStatus}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#38bdf8"
                                    label
                                >
                                    {submissionStatus.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={["#a3e635", "#facc15", "#f87171", "#60a5fa", "#c084fc"][index % 5]}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card dark:bg-gray-900 dark:text-gray-50">
                    <div className="card-header dark:text-gray-50">Top Students</div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        <table className="table dark:bg-gray-900 dark:text-gray-50">
                            <thead>
                                <tr>
                                    <th className="dark:text-gray-50">#</th>
                                    <th className="dark:text-gray-50">Student</th>
                                    <th className="dark:text-gray-50">Submissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topStudents.length > 0 ? (
                                    topStudents.map((s, i) => (
                                        <tr key={i}>
                                            <td className="dark:text-gray-50">{i + 1}</td>
                                            <td className="dark:text-gray-50">{s.name}</td>
                                            <td className="dark:text-gray-50">{s.submissions}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="p-4 text-center dark:text-gray-400"
                                        >
                                            No data
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

export default AnalyticsPage;
