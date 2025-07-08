"use client";

import React from "react";

const Fluxx = () => {
  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-900">
      <div className="w-full flex justify-center mb-6">
        <img
          src="/fluxx-tech-solutions-logo.png"
          alt="Fluxx Banner"
          className="w-full max-w-2xl h-auto rounded-lg md:max-w-xl sm:max-w-md"
        />
      </div>

      <h2 className="text-lg font-semibold mt-6">Development Overview</h2>
      <p className="text-gray-700 text-sm mb-4">
        Fluxx is a modern solution developed using advanced web technologies such as React.js and Next.js.
        Built with scalability and performance in mind, it offers a responsive and reliable platform for streamlined task and process management. The system is thoughtfully designed to provide a clean user interface, intuitive workflows, and smooth system performance.
      </p>

      <h2 className="text-lg font-semibold mt-6">Strategic Role in ERP</h2>
      <p className="text-gray-700 text-sm mb-4">
        More than just a task management tool, Fluxx plays a strategic role in the overall ERP architecture.
        It integrates seamlessly with EcoDesk, enabling end-to-end business process automation and improved coordination across various departments.
      </p>

      <h2 className="text-lg font-semibold mt-6">Core Features</h2>
      <ul className="list-inside text-gray-700 text-sm space-y-1">
        <li>✔ Automated Task Management – Easily create, assign, and monitor tasks.</li>
        <li>✔ Time Tracking – Record working hours with precision.</li>
        <li>✔ Smart Notes – Pin essential notes for quick reference.</li>
        <li>✔ Integrated Scheduling – Organize calendars and manage deadlines efficiently.</li>
        <li>✔ Real-time Notifications – Receive alerts to stay on top of your tasks.</li>
        <li>✔ Field Agent Monitoring – Track field activities for better accountability.</li>
        <li>✔ Quotation System – Generate and manage sales quotations seamlessly.</li>
        <li>✔ EcoDesk Link – Connects with EcoDesk for unified customer service and ticketing operations.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">Legal & Security Notice</h2>
      <p className="text-gray-700 text-sm mb-4">
        Fluxx is a proprietary system owned by EcoShift. Unauthorized copying, distribution, or modification is strictly prohibited. Only designated IT personnel are permitted to make system changes or configurations.
        Any misuse or duplication of the system will be considered a violation of intellectual property laws and may result in legal consequences.
      </p>

      <p className="text-gray-700 text-sm">
        Fluxx empowers teams through intelligent automation, efficient task coordination, and secure system integration.
        As a vital part of the company’s ERP strategy, it enhances productivity, supports collaborative workflows, and ensures timely execution of operations.
        Designed for speed, reliability, and Fluxx helps organizations scale their processes effectively and securely. 🚀
      </p>
    </div>
  );
};

export default Fluxx;
