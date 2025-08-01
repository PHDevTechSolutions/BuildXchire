import React from "react";
import { MdEdit, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify } from "react-icons/md";

interface StyleTabProps {
    alignment: string; setAlignment: React.Dispatch<React.SetStateAction<string>>;
    showTypography: boolean; setShowTypography: React.Dispatch<React.SetStateAction<boolean>>;
    fontFamily: string; setFontFamily: React.Dispatch<React.SetStateAction<string>>;
    fontSize: number; setFontSize: React.Dispatch<React.SetStateAction<number>>;
    fontWeight: string; setFontWeight: React.Dispatch<React.SetStateAction<string>>;
    textTransform: string; setTextTransform: React.Dispatch<React.SetStateAction<string>>;
    fontStyle: string; setFontStyle: React.Dispatch<React.SetStateAction<string>>;
    textDecoration: string; setTextDecoration: React.Dispatch<React.SetStateAction<string>>;
    lineHeight: number; setLineHeight: React.Dispatch<React.SetStateAction<number>>;
    letterSpacing: number; setLetterSpacing: React.Dispatch<React.SetStateAction<number>>;
    wordSpacing: number; setWordSpacing: React.Dispatch<React.SetStateAction<number>>;
    showTextStroke: boolean; setShowTextStroke: React.Dispatch<React.SetStateAction<boolean>>;
    textStrokeWidth: number; setTextStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
    textStrokeColor: string; setTextStrokeColor: React.Dispatch<React.SetStateAction<string>>;
    showTextShadow: boolean; setShowTextShadow: React.Dispatch<React.SetStateAction<boolean>>;
    textShadowBlur: number; setTextShadowBlur: React.Dispatch<React.SetStateAction<number>>;
    textShadowX: number; setTextShadowX: React.Dispatch<React.SetStateAction<number>>;
    textShadowY: number; setTextShadowY: React.Dispatch<React.SetStateAction<number>>;
    fontFamilies: string[];
}

const alignmentIcons: Record<string, React.ReactNode> = {
    left: <MdFormatAlignLeft />,
    center: <MdFormatAlignCenter />,
    right: <MdFormatAlignRight />,
    justify: <MdFormatAlignJustify />,
};

const StyleTab: React.FC<StyleTabProps> = ({
    alignment, setAlignment,
    showTypography, setShowTypography,
    fontFamily, setFontFamily,
    fontSize, setFontSize,
    fontWeight, setFontWeight,
    textTransform, setTextTransform,
    fontStyle, setFontStyle,
    textDecoration, setTextDecoration,
    lineHeight, setLineHeight,
    letterSpacing, setLetterSpacing,
    wordSpacing, setWordSpacing,
    showTextStroke, setShowTextStroke,
    textStrokeWidth, setTextStrokeWidth,
    textStrokeColor, setTextStrokeColor,
    showTextShadow, setShowTextShadow,
    textShadowBlur, setTextShadowBlur,
    textShadowX, setTextShadowX,
    textShadowY, setTextShadowY,
    fontFamilies
}) => {

    return (
        <div className="grid grid-cols-1 gap-2 mb-1 border p-2">
            {/* Alignment */}
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold whitespace-nowrap">Alignment</label>
                <div className="flex gap-1">
                    {["left", "center", "right", "justify"].map((al) => (
                        <button
                            key={al}
                            type="button"
                            className={`p-2 rounded text-sm ${alignment === al ? "bg-blue-600 text-white" : "bg-gray-100"
                                }`}
                            onClick={() => setAlignment(al)}
                            title={al.charAt(0).toUpperCase() + al.slice(1)}
                        >
                            {alignmentIcons[al]}
                        </button>
                    ))}
                </div>
            </div>
            {/* Typography */}
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold">Typography</label>
                <button
                    type="button"
                    className="text-blue-600 text-xs px-2 py-1 rounded border"
                    onClick={() => setShowTypography(prev => !prev)}
                >
                    <MdEdit />
                </button>
            </div>
            
            {showTypography && (
                <div className="grid grid-cols-1 gap-2 mb-2 border p-2">
                    <label className="text-xs">Font Family</label>
                    <select
                        value={fontFamily}
                        onChange={e => setFontFamily(e.target.value)}
                        className="border rounded p-1 text-xs w-full mb-1"
                    >
                        {fontFamilies.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>

                    <label className="text-xs">Font Size</label>
                    <input type="range" min={8} max={72} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full" />
                    <span className="text-xs">{fontSize}px</span>

                    <label className="text-xs">Font Weight</label>
                    <select value={fontWeight} onChange={e => setFontWeight(e.target.value)} className="border rounded p-1 text-xs w-full mb-1">
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="lighter">Lighter</option>
                        <option value="bolder">Bolder</option>
                        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(w => (
                            <option key={w} value={w}>{w}</option>
                        ))}
                    </select>

                    <label className="text-xs">Text Transform</label>
                    <select value={textTransform} onChange={e => setTextTransform(e.target.value)} className="border rounded p-1 text-xs w-full mb-1">
                        <option value="none">None</option>
                        <option value="uppercase">Uppercase</option>
                        <option value="lowercase">Lowercase</option>
                        <option value="capitalize">Capitalize</option>
                    </select>

                    <label className="text-xs">Font Style</label>
                    <select value={fontStyle} onChange={e => setFontStyle(e.target.value)} className="border rounded p-1 text-xs w-full mb-1">
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                        <option value="oblique">Oblique</option>
                    </select>

                    <label className="text-xs">Text Decoration</label>
                    <select value={textDecoration} onChange={e => setTextDecoration(e.target.value)} className="border rounded p-1 text-xs w-full mb-1">
                        <option value="none">None</option>
                        <option value="underline">Underline</option>
                        <option value="line-through">Line Through</option>
                        <option value="overline">Overline</option>
                    </select>

                    <label className="text-xs">Line Height</label>
                    <input type="range" min={1} max={3} step={0.1} value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} className="w-full" />
                    <span className="text-xs">{lineHeight}</span>

                    <label className="text-xs">Letter Spacing</label>
                    <input type="range" min={0} max={10} step={0.1} value={letterSpacing} onChange={e => setLetterSpacing(Number(e.target.value))} className="w-full" />
                    <span className="text-xs">{letterSpacing}px</span>

                    <label className="text-xs">Word Spacing</label>
                    <input type="range" min={0} max={20} step={0.5} value={wordSpacing} onChange={e => setWordSpacing(Number(e.target.value))} className="w-full" />
                    <span className="text-xs">{wordSpacing}px</span>
                </div>
            )}

            {/* Text Stroke */}
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold">Text Stroke</label>
                <button type="button" className="text-blue-600 text-xs px-2 py-1 rounded border" onClick={() => setShowTextStroke(prev => !prev)}>
                    <MdEdit />
                </button>
            </div>
            {showTextStroke && (
                <div className="grid grid-cols-1 gap-2 mb-2 border p-2">
                    <label className="text-xs">Stroke Width</label>
                    <input type="range" min={0} max={10} step={0.1} value={textStrokeWidth} onChange={e => setTextStrokeWidth(Number(e.target.value))} className="w-full" />
                    <span className="text-xs">{textStrokeWidth}px</span>
                    <label className="text-xs">Stroke Color</label>
                    <input type="color" value={textStrokeColor} onChange={e => setTextStrokeColor(e.target.value)} className="w-full h-8 mb-1" />
                </div>
            )}

            {/* Text Shadow */}
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold">Text Shadow</label>
                <button type="button" className="text-blue-600 text-xs px-2 py-1 rounded border" onClick={() => setShowTextShadow(prev => !prev)}>
                    <MdEdit />
                </button>
            </div>
            {showTextShadow && (
                <div className="grid grid-cols-1 gap-2 mb-2 border p-2">
                    <label className="text-xs">Blur</label>
                    <input type="range" min={0} max={20} step={1} value={textShadowBlur} onChange={e => setTextShadowBlur(Number(e.target.value))} className="w-full" />
                    <span className="text-xs">{textShadowBlur}px</span>

                    <label className="text-xs">Horizontal</label>
                    <input type="range" min={-20} max={20} step={1} value={textShadowX} onChange={e => setTextShadowX(Number(e.target.value))} className="w-full" />
                    <span className="text-xs">{textShadowX}px</span>

                    <label className="text-xs">Vertical</label>
                    <input type="range" min={-20} max={20} step={1} value={textShadowY} onChange={e => setTextShadowY(Number(e.target.value))} className="w-full" />
                    <span className="text-xs">{textShadowY}px</span>
                </div>
            )}
        </div>
    );
};

export default StyleTab;
