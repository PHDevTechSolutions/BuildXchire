import React from "react";

interface SessionLog {
    status: string;
    timestamp: string;
    _id?: string;
}

interface SessionTableProps {
    data: SessionLog[];
}

const formatDateTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString();
};

const SessionTable: React.FC<SessionTableProps> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="text-center text-gray-500 text-xs py-4">
                No session logs found.
            </div>
        );
    }

    const statusColors: { [key: string]: string } = {
        login: "bg-green-800",
        logout: "bg-red-800",
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full table-auto">
                <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-black">
                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((log, idx) => (
                        <tr key={log._id ?? idx} className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer">
                            <td className="px-6 py-4 text-xs capitalize">
                                <span
                                    className={`badge text-white shadow-md text-[8px] px-2 py-1 mr-2 rounded-xl ${statusColors[log.status] || "bg-gray-400"
                                        }`}
                                >
                                    {log.status}
                                </span></td>

                            <td className="px-6 py-4 text-xs capitalize">{formatDateTime(log.timestamp)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SessionTable;
