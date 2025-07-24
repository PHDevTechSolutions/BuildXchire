import React from "react";

interface ActivityLog {
  ReferenceID: string;
  Email: string;
  Type: string;
  Status: string;
  Location: string;
  date_created: string;
  PhotoURL?: string;
  _id?: string;
}

interface TableProps {
  data: ActivityLog[];
  onEdit: (log: ActivityLog) => void;
}

const formatDateTime = (dateStr: string | null): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const Table: React.FC<TableProps> = ({ data, onEdit }) => {
  const statusColors: { [key: string]: string } = {
    Login: "bg-green-800",
    Logout: "bg-red-800",
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-black">
            <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date &amp; Time</th>
            <th className="px-6 py-4 font-semibold text-gray-700">View Image</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((log, idx) => (
              <tr
                key={log._id ?? idx}
                className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer"
                // onClick={() => onEdit(log)}
              >
                <td className="px-6 py-4 text-xs capitalize">{log.Type}</td>
                <td className="px-6 py-4 text-xs capitalize">
                  <span
                    className={`badge text-white shadow-md text-[8px] px-2 py-1 mr-2 rounded-xl ${
                      statusColors[log.Status] || "bg-gray-400"
                    }`}
                  >
                    {log.Status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs capitalize">{log.Location}</td>
                <td className="px-6 py-4 text-xs">{formatDateTime(log.date_created)}</td>
                <td className="px-6 py-4 text-xs">
                  {log.PhotoURL ? (
                    <a
                      href={log.PhotoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      View Image
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">No Image</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border px-4 py-2 text-center text-gray-500">
                No activity logs found for this user.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
