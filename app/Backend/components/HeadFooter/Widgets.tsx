import React, { useState } from "react";
import TextWidget from "../Widgets/Heading";
interface WidgetsProps {
    setDraggedWidget: (html: string) => void;
}

const Widgets: React.FC<WidgetsProps> = ({ setDraggedWidget }) => {
    return (
        <div>
            <div className="font-bold mb-2 text-xs">Widgets</div>
            {/* Editable Text Widget */}
            <TextWidget setDraggedWidget={setDraggedWidget} />
            {/* Other widgets with Tailwind classes */}
            <div
                className="border rounded p-2 mb-2 bg-white cursor-move"
                draggable
                onDragStart={() => setDraggedWidget('<img src="https://via.placeholder.com/150" alt="Image Widget" class="rounded shadow w-32 h-32 object-cover"/>')}
            >
                Image
            </div>
            <div
                className="border rounded p-2 mb-2 bg-white cursor-move"
                draggable
                onDragStart={() => setDraggedWidget('<button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-xs">Button Widget</button>')}
            >
                Button
            </div>
        </div>
    );
};

export default Widgets;