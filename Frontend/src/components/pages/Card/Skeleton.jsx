import React from "react";

export default function Skeleton() {
    return (
        <div className="bg-white text-gray-800 p-6 min-h-screen">
            {/* Header */}
            <div className="mb-2 flex justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center ">
                    VISUALIZE LOGGED DATA
                </h1>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
                />
                <select className="border rounded px-3 py-2 text-sm">
                    <option>All Roles</option>
                </select>
                <select className="border rounded px-3 py-2 text-sm  bg-blue-500 text-white">
                    <option>Advanced Filters</option>
                </select>
                <select className="border rounded px-3 py-2 text-sm">
                    <option>Clear Filters</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2 text-left">S.No:</th>
                            <th className="border px-3 py-2">Interface Name</th>
                            <th className="border px-3 py-2">Integration Key</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">Message</th>
                            <th className="border px-3 py-2">Timestamp</th>
                            <th className="border px-3 py-2">Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(50)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                {/* User Column */}
                                <td className="border px-3 py-3">
                                    <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-3 w-40 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-3 w-28 bg-gray-200 rounded"></div>
                                </td>

                                {/* Role Column */}
                                <td className="border px-3 py-3 text-center">
                                    <div className="h-5 w-20 bg-gray-200 rounded-full mx-auto"></div>
                                </td>

                                {/* Status Column */}
                                <td className="border px-3 py-3 text-center">
                                    <div className="h-4 w-20 bg-gray-200 rounded mb-1 mx-auto"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                                </td>
                                {/* Role Column */}
                                <td className="border px-3 py-3 text-center">
                                    <div className="h-5 w-20 bg-gray-200 rounded-full mx-auto"></div>
                                </td>

                                {/* Status Column */}
                                <td className="border px-3 py-3 text-center">
                                    <div className="h-4 w-20 bg-gray-200 rounded mb-1 mx-auto"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                                </td>

                                {/* Joined Column */}
                                <td className="border px-3 py-3 text-center">
                                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
                                </td>

                                {/* Actions Column */}
                                <td className="border px-3 py-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
