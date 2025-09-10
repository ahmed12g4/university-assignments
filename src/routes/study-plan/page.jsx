"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/layouts/footer";
import { Plus } from "lucide-react";

const StudyPlanPage = () => {
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch("http://localhost:5100/api/studyplan");
            const data = await res.json();
            setPlans(data);
        } catch (err) {
            console.error("Error fetching study plans:", err);
        }
    };

    const addPlan = async () => {
        if (!newPlan.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5100/api/studyplan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newPlan }),
            });
            if (res.ok) {
                const added = await res.json();
                setPlans([...plans, added]);
                setNewPlan("");
            } else {
                console.error("Failed to add plan");
            }
        } catch (err) {
            console.error("Error adding plan:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col gap-6 bg-gray-50 p-6 dark:bg-slate-900">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">📅 Study Plan</h1>

            {/* Input + Add button */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    placeholder="Add a new plan..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
                <button
                    onClick={addPlan}
                    disabled={loading || !newPlan.trim()}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
                >
                    <Plus size={16} /> {loading ? "Adding..." : "Add"}
                </button>
            </div>

            {/* Study Plans List */}
            <div className="rounded-lg bg-white p-4 shadow dark:bg-slate-800">
                {plans.length === 0 ? (
                    <p className="py-4 text-center text-gray-500 dark:text-gray-400">No study plans yet</p>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {plans.map((p, idx) => (
                            <li
                                key={p.id || idx}
                                className="flex items-center justify-between rounded px-2 py-2 transition hover:bg-gray-50 dark:hover:bg-slate-700"
                            >
                                <span className="text-gray-800 dark:text-gray-100">{p.title}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default StudyPlanPage;
