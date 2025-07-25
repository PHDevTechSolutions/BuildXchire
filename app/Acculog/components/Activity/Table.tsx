import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
  department: string;
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

const computeTimeRemarks = (log: ActivityLog): string => {
  const logDate = new Date(log.date_created);
  const workStart = new Date(log.date_created);
  workStart.setHours(8, 0, 0, 0); // 8:00 AM

  const workEndGrace = new Date(log.date_created);
  workEndGrace.setHours(17, 10, 0, 0); // 5:10 PM

  if (log.Status.toLowerCase() === "login") {
    if (logDate > workStart) {
      const lateMinutes = Math.round((logDate.getTime() - workStart.getTime()) / 60000);
      return `Late by ${lateMinutes} min`;
    } else {
      return "On Time";
    }
  }

  if (log.Status.toLowerCase() === "logout") {
    if (logDate > workEndGrace) {
      const overtimeMinutes = Math.round((logDate.getTime() - workEndGrace.getTime()) / 60000);
      return `OT +${overtimeMinutes} min`;
    } else {
      return "On Time";
    }
  }

  return "-";
};

const Table: React.FC<TableProps> = ({ data, onEdit, department }) => {
  const statusColors: { [key: string]: string } = {
    Login: "bg-green-800",
    Logout: "bg-red-800",
  };

  const getRemarkBadgeColor = (remark: string) => {
    if (remark === "On Time") return "bg-green-600";
    if (remark.startsWith("Late")) return "bg-yellow-500";
    if (remark.startsWith("OT")) return "bg-blue-600";
    return "bg-gray-400";
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Activity Logs");

    worksheet.columns = [
      { header: "Email", key: "Email", width: 30 },
      { header: "Type", key: "Type", width: 15 },
      { header: "Status", key: "Status", width: 15 },
      { header: "Location", key: "Location", width: 20 },
      { header: "Date & Time", key: "Date", width: 25 },
      { header: "Remarks", key: "Remarks", width: 20 },
    ];

    data.forEach((log) => {
      worksheet.addRow({
        Email: log.Email,
        Type: log.Type,
        Status: log.Status,
        Location: log.Location,
        Date: formatDateTime(log.date_created),
        Remarks: computeTimeRemarks(log),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "activity-logs.xlsx");
  };

  return (
    <div className="overflow-x-auto w-full">
      {department === "Human Resources" && (
        <div className="flex justify-end mb-2">
          <button
            onClick={exportToExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs shadow"
          >
            Export to Excel
          </button>
        </div>
      )}

      <table className="w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-black">
            <th className="px-6 py-4 font-semibold text-gray-700">User Email</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date &amp; Time</th>
            <th className="px-6 py-4 font-semibold text-gray-700">View Image</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((log, idx) => {
              const remark = computeTimeRemarks(log);
              const remarkColor = getRemarkBadgeColor(remark);
              return (
                <tr
                  key={log._id ?? idx}
                  className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer"
                >
                  <td className="px-6 py-4 text-xs">{log.Email}</td>
                  <td className="px-6 py-4 text-xs capitalize">{log.Type}</td>
                  <td className="px-6 py-4 text-xs capitalize">
                    <span
                      className={`badge text-white shadow-md text-[10px] px-2 py-1 mr-2 rounded-xl ${
                        statusColors[log.Status] || "bg-gray-400"
                      }`}
                    >
                      {log.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span
                      className={`badge text-white shadow-md text-[10px] px-2 py-1 rounded-xl ${remarkColor}`}
                    >
                      {remark}
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Image
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="border px-4 py-2 text-center text-gray-500">
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
