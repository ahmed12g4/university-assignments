"use client";
import { useState } from "react";
import { Footer } from "@/layouts/footer";

const AddStudentPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        stageId: "",
        sectionId: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:5000/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("فشل في إضافة الطالب");

            setMessage("✅ تم إضافة الطالب بنجاح");
            setFormData({
                fullName: "",
                email: "",
                username: "",
                stageId: "",
                sectionId: "",
            });
        } catch (err) {
            console.error(err);
            setMessage("❌ حصل خطأ أثناء إضافة الطالب");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col gap-4 bg-gray-50 p-4 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-50 sm:p-6 md:p-8">
            <h1 className="text-center text-3xl font-bold">🎓 إضافة طالب</h1>

            <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-4"
            >
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                    required
                />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                    required
                />

                <div className="flex w-full flex-col gap-4 sm:flex-row">
                    <select
                        name="stageId"
                        value={formData.stageId}
                        onChange={handleChange}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                    >
                        <option value="">Select Stage</option>
                        <option value="1">الصف الأول الثانوي</option>
                        <option value="2">الصف الثاني الثانوي</option>
                        <option value="3">الصف الثالث الثانوي</option>
                    </select>

                    <select
                        name="sectionId"
                        value={formData.sectionId}
                        onChange={handleChange}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                    >
                        <option value="">Select Section</option>
                        <option value="1">قسم A</option>
                        <option value="2">قسم B</option>
                        <option value="3">قسم C</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-700 dark:text-gray-50"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </form>

            {message && <p className="mt-2 text-center font-medium transition-colors duration-300">{message}</p>}

            <Footer />
        </div>
    );
};

export default AddStudentPage;
