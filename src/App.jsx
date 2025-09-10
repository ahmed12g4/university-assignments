import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import StudentsPage from "@/routes/students/page";
import AddStudentPage from "@/routes/add-student/page";
import VerifiedStudentsPage from "@/routes/verified-students/page";
import SubjectsPage from "@/routes/subjects/page";
import AddSubjectPage from "@/routes/add-subject/page";
import StudyPlanPage from "@/routes/study-plan/page";
import SettingsPage from "@/routes/settings/page";
import ReportsPage from "@/routes/reports/page";
import AnalyticsPage from "@/routes/analytics/page";
import AssignmentsPage from "@/routes/assignments/page";
import AddAssignmentPage from "@/routes/add-assignment/page";
import SubmissionsPage from "@/routes/submissions/page";

import ProtectedRoute from "@/routes/protected-route";

import LoginPage from "@/routes/login/page.jsx";
import RegisterPage from "@/routes/register/page.jsx";

function App() {
    const router = createBrowserRouter([
        // 🔹 صفحات برا Layout
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },

        // 🔹 Redirect من / → /login
        {
            path: "/",
            element: (
                <Navigate
                    to="/login"
                    replace
                />
            ),
        },

        // 🔹 Routes جوه Layout (محميه بـ ProtectedRoute)
        {
            path: "/dashboard",
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                { index: true, element: <DashboardPage /> },
                { path: "students", element: <StudentsPage /> },
                { path: "add-student", element: <AddStudentPage /> },
                { path: "verified-students", element: <VerifiedStudentsPage /> },
                { path: "subjects", element: <SubjectsPage /> },
                { path: "add-subject", element: <AddSubjectPage /> },
                { path: "study-plan", element: <StudyPlanPage /> },
                { path: "settings", element: <SettingsPage /> },
                { path: "reports", element: <ReportsPage /> },
                { path: "analytics", element: <AnalyticsPage /> },
                { path: "assignments", element: <AssignmentsPage /> },
                { path: "add-assignment", element: <AddAssignmentPage /> },
                { path: "submissions", element: <SubmissionsPage /> },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
