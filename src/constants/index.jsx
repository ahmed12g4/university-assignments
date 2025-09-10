import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, Users, UserPlus, UserCheck, ShoppingBag, ClipboardList } from "lucide-react";

import ProfileImage from "@/assets/profile-image.jpg";
import AssignmentImage from "@/assets/product-image.jpg";

// ✅ Navbar Links (المسارات كلها جوه /dashboard)
export const navbarLinks = [
    {
        title: "General",
        links: [
            { label: "Dashboard", icon: Home, path: "/dashboard" },
            { label: "Analytics", icon: ChartColumn, path: "/dashboard/analytics" },
            { label: "Reports", icon: NotepadText, path: "/dashboard/reports" },
        ],
    },
    {
        title: "Students",
        links: [
            { label: "Students", icon: Users, path: "/dashboard/students" },
            { label: "Add Student", icon: UserPlus, path: "/dashboard/add-student" },
            { label: "Verified Students", icon: UserCheck, path: "/dashboard/verified-students" },
        ],
    },
    {
        title: "Assignments",
        links: [
            { label: "Assignments", icon: NotepadText, path: "/dashboard/assignments" },
            { label: "Add Assignment", icon: PackagePlus, path: "/dashboard/add-assignment" },
            { label: "Submissions", icon: ClipboardList, path: "/dashboard/submissions" },
        ],
    },
    {
        title: "Subjects",
        links: [
            { label: "Subjects", icon: Package, path: "/dashboard/subjects" },
            { label: "Add Subject", icon: PackagePlus, path: "/dashboard/add-subject" },
            { label: "Study Plan", icon: ShoppingBag, path: "/dashboard/study-plan" },
        ],
    },
    {
        title: "Settings",
        links: [{ label: "Settings", icon: Settings, path: "/dashboard/settings" }],
    },
];

// ✅ Overview Data (for charts)
export const overviewData = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 2000 },
    { name: "Mar", total: 1000 },
    { name: "Apr", total: 5000 },
    { name: "May", total: 2000 },
    { name: "Jun", total: 5900 },
    { name: "Jul", total: 2000 },
    { name: "Aug", total: 5500 },
    { name: "Sep", total: 2000 },
    { name: "Oct", total: 4000 },
    { name: "Nov", total: 1500 },
    { name: "Dec", total: 2500 },
];

// ✅ Recent Submissions (students data)
export const recentSubmissionsData = [
    {
        id: 1,
        name: "Ali Hassan",
        email: "ali.hassan@email.com",
        image: ProfileImage,
        total: "Math Assignment",
    },
    {
        id: 2,
        name: "Sara Ahmed",
        email: "sara.ahmed@email.com",
        image: ProfileImage,
        total: "Science Project",
    },
    {
        id: 3,
        name: "Omar Khaled",
        email: "omar.khaled@email.com",
        image: ProfileImage,
        total: "History Essay",
    },
    {
        id: 4,
        name: "Nada Youssef",
        email: "nada.youssef@email.com",
        image: ProfileImage,
        total: "English Homework",
    },
];

// ✅ Top Students
export const topStudents = [
    {
        number: 1,
        name: "Ali Hassan",
        image: AssignmentImage,
        description: "Excellent in Mathematics",
        grade: "A+",
        status: "Active",
        rating: 4.9,
    },
    {
        number: 2,
        name: "Sara Ahmed",
        image: AssignmentImage,
        description: "Great in Science Projects",
        grade: "A",
        status: "Active",
        rating: 4.8,
    },
    {
        number: 3,
        name: "Omar Khaled",
        image: AssignmentImage,
        description: "Strong in History",
        grade: "B+",
        status: "Active",
        rating: 4.7,
    },
    {
        number: 4,
        name: "Nada Youssef",
        image: AssignmentImage,
        description: "Very good in English",
        grade: "A",
        status: "Inactive",
        rating: 4.6,
    },
];
