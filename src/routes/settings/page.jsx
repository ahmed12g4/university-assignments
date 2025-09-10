"use client";

import { useState } from "react";
import { Footer } from "@/layouts/footer";
import { Bot, Bell, Mail, Save, Server, Smartphone, Home } from "lucide-react";

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        email: "admin@university.com",
        botToken: "",
        notifications: true,
        smtpServer: "",
        smtpPort: 587,
        pushNotifications: true,
        universityName: "",
    });

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5100/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (!res.ok) throw new Error("Failed to save settings");
            alert("✅ Settings saved successfully!");
        } catch (err) {
            console.error("Error saving settings:", err);
            alert("❌ Failed to save settings");
        }
    };

    return (
        <div className="flex min-h-screen flex-col gap-6 bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 md:p-8">
            <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">⚙️ Settings</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* University Name */}
                <div className="rounded-lg bg-white p-5 shadow dark:bg-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                        <Home className="text-indigo-500 dark:text-indigo-400" />
                        <p className="font-semibold text-gray-800 dark:text-gray-100">University Name</p>
                    </div>
                    <input
                        type="text"
                        placeholder="University Name"
                        value={settings.universityName}
                        onChange={(e) => setSettings({ ...settings, universityName: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Admin Email */}
                <div className="rounded-lg bg-white p-5 shadow dark:bg-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                        <Mail className="text-blue-500 dark:text-blue-400" />
                        <p className="font-semibold text-gray-800 dark:text-gray-100">Admin Email</p>
                    </div>
                    <input
                        type="email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        required
                    />
                </div>

                {/* Telegram Bot Token */}
                <div className="rounded-lg bg-white p-5 shadow dark:bg-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                        <Bot className="text-green-500 dark:text-green-400" />
                        <p className="font-semibold text-gray-800 dark:text-gray-100">Telegram Bot Token</p>
                    </div>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={settings.botToken}
                        onChange={(e) => setSettings({ ...settings, botToken: e.target.value })}
                        placeholder="Enter Bot Token"
                    />
                </div>

                {/* Email Notifications */}
                <div className="rounded-lg bg-white p-5 shadow dark:bg-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                        <Bell className="text-yellow-500 dark:text-yellow-400" />
                        <p className="font-semibold text-gray-800 dark:text-gray-100">Email Notifications</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                            className="accent-yellow-500"
                        />
                        <label className="text-gray-700 dark:text-gray-200">Enable Email Notifications</label>
                    </div>
                </div>

                {/* Push Notifications */}
                <div className="rounded-lg bg-white p-5 shadow dark:bg-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                        <Smartphone className="text-purple-500 dark:text-purple-400" />
                        <p className="font-semibold text-gray-800 dark:text-gray-100">Push Notifications</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={settings.pushNotifications}
                            onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                            className="accent-purple-500"
                        />
                        <label className="text-gray-700 dark:text-gray-200">Enable Push Notifications</label>
                    </div>
                </div>

                {/* SMTP Settings */}
                <div className="rounded-lg bg-white p-5 shadow dark:bg-gray-800 md:col-span-2">
                    <div className="mb-2 flex items-center gap-2">
                        <Server className="text-red-500 dark:text-red-400" />
                        <p className="font-semibold text-gray-800 dark:text-gray-100">SMTP Settings</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="text"
                            placeholder="SMTP Server"
                            value={settings.smtpServer}
                            onChange={(e) => setSettings({ ...settings, smtpServer: e.target.value })}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="number"
                            placeholder="Port"
                            value={settings.smtpPort}
                            onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) })}
                            className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
                >
                    <Save size={18} /> Save Settings
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default SettingsPage;
