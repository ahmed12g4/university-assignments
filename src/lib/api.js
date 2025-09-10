// Small fetch wrapper with base URL + JSON helpers
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

async function request(path, { method = "GET", body, headers = {} } = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
    });
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
            const j = await res.json();
            msg = j.message || j.title || msg;
        } catch {}
        throw new Error(msg);
    }
    // Some endpoints may return empty
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

export const api = {
    // Dashboard/analytics
    getKpis: () => request("/api/analytics/kpis"),
    getTrends: () => request("/api/analytics/trends"),
    // Subjects
    listSubjects: () => request("/api/subjects"),
    createSubject: (data) => request("/api/subjects", { method: "POST", body: data }),
    updateSubject: (id, data) => request(`/api/subjects/${id}`, { method: "PUT", body: data }),
    deleteSubject: (id) => request(`/api/subjects/${id}`, { method: "DELETE" }),
    // Students
    listStudents: (q = "") => request(`/api/students${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    createStudent: (data) => request("/api/students", { method: "POST", body: data }),
    updateStudent: (id, data) => request(`/api/students/${id}`, { method: "PUT", body: data }),
    deleteStudent: (id) => request(`/api/students/${id}`, { method: "DELETE" }),
    listVerified: () => request("/api/students/verified"),
    verifyStudent: (id) => request(`/api/students/${id}/verify`, { method: "POST" }),
    // Submissions / reports
    listReports: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/api/reports${qs ? `?${qs}` : ""}`);
    },
    // Study plans
    listPlans: () => request("/api/study-plans"),
    createPlan: (data) => request("/api/study-plans", { method: "POST", body: data }),
    updatePlan: (id, data) => request(`/api/study-plans/${id}`, { method: "PUT", body: data }),
    deletePlan: (id) => request(`/api/study-plans/${id}`, { method: "DELETE" }),
    // Settings
    getSettings: () => request("/api/settings"),
    saveSettings: (data) => request("/api/settings", { method: "PUT", body: data }),
    // Bot stats (if needed)
    getBotStats: () => request("/api/bot/stats"),
};
