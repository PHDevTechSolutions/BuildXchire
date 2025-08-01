import React from "react";

interface TextWidgetProps {
  text: string;
  setText: (val: string) => void;
  url: string;
  setUrl: (val: string) => void;
  tag: string;
  setTag: (val: string) => void;
  animated: boolean;
  setAnimated: (val: boolean) => void;
  animationType: string;
  setAnimationType: (val: string) => void;
  htmlTags: string[];
  animationOptions: { label: string; value: string }[];
}

const TextWidget: React.FC<TextWidgetProps> = ({
  text,
  setText,
  url,
  setUrl,
  tag,
  setTag,
  animated,
  setAnimated,
  animationType,
  setAnimationType,
  htmlTags,
  animationOptions
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 mb-1 border p-2">
      <label className="text-xs font-bold">Text</label>
      <textarea
        rows={3}
        value={text}
        onChange={e => setText(e.target.value)}
        className="border rounded p-1 text-xs w-full mb-1"
        placeholder="Add Your Heading Text Here"
      />
      <label className="text-xs font-bold">URL</label>
      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="border rounded p-1 text-xs w-full mb-1"
        placeholder="https://buildxchire.com"
      />
      <label className="text-xs">HTML Tag</label>
      <select
        value={tag}
        onChange={e => setTag(e.target.value)}
        className="border rounded p-1 text-xs w-full mb-1"
        title="HTML Tag"
      >
        {htmlTags.map(t => (
          <option key={t} value={t}>
            {t.toUpperCase()}
          </option>
        ))}
      </select>
      <label className="text-xs flex items-center gap-2">
        <input
          type="checkbox"
          checked={animated}
          onChange={e => setAnimated(e.target.checked)}
        />
        Enable Animation
      </label>
      {animated && (
        <select
          value={animationType}
          onChange={e => setAnimationType(e.target.value)}
          className="border rounded p-1 text-xs w-full mb-1"
          title="Animation Type"
        >
          {animationOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default TextWidget;
