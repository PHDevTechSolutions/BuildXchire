import React, { useState } from "react";
import ContentTab from "./Heading/Content";
import StyleTab from "./Heading/Style";
import AdvancedTab from "./Heading/Advanced";
import { RiHeading } from "react-icons/ri";

interface TextWidgetProps {
    setDraggedWidget: (html: string) => void;
}

const fontFamilies = ["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia"];
const htmlTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "div"];

const animationOptions = [
    { label: "None", value: "" },
    { label: "Bounce", value: "animate-bounce" },
    { label: "Pulse", value: "animate-pulse" },
    { label: "Spin", value: "animate-spin" },
    { label: "Ping", value: "animate-ping" }
];

const getFontSizeClass = (size: number) => {
    if (size <= 12) return "text-xs";
    if (size <= 14) return "text-sm";
    if (size <= 16) return "text-base";
    if (size <= 20) return "text-lg";
    if (size <= 24) return "text-xl";
    if (size <= 30) return "text-2xl";
    if (size <= 36) return "text-3xl";
    if (size <= 48) return "text-4xl";
    return "text-5xl";
};

const TextWidget: React.FC<TextWidgetProps> = ({ setDraggedWidget }) => {
    const [text, setText] = useState("Text Widget");
    const [color, setColor] = useState("#222222");
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [isEditing, setIsEditing] = useState(false);
    const [url, setUrl] = useState("");
    const [tag, setTag] = useState("h1");
    const [animated, setAnimated] = useState(false);
    const [animationType, setAnimationType] = useState("animate-bounce");

    // Advance tab states
    const [margin, setMargin] = useState("0");
    const [padding, setPadding] = useState("0");
    const [width, setWidth] = useState("auto");
    const [position, setPosition] = useState("static");

    const [activeTab, setActiveTab] = useState<"content" | "style" | "advance">("content");

    const [alignment, setAlignment] = useState("left");
    const [showTypography, setShowTypography] = useState(false);
    const [fontWeight, setFontWeight] = useState("normal");
    const [textTransform, setTextTransform] = useState("none");
    const [fontStyle, setFontStyle] = useState("normal");
    const [textDecoration, setTextDecoration] = useState("none");
    const [lineHeight, setLineHeight] = useState(1.5);
    const [letterSpacing, setLetterSpacing] = useState(0);
    const [wordSpacing, setWordSpacing] = useState(0);

    const [showTextStroke, setShowTextStroke] = useState(false);
    const [textStrokeWidth, setTextStrokeWidth] = useState(0);
    const [textStrokeColor, setTextStrokeColor] = useState("#000000");

    const [showTextShadow, setShowTextShadow] = useState(false);
    const [textShadowBlur, setTextShadowBlur] = useState(0);
    const [textShadowX, setTextShadowX] = useState(0);
    const [textShadowY, setTextShadowY] = useState(0);

    const [marginTop, setMarginTop] = useState("0");
    const [marginRight, setMarginRight] = useState("0");
    const [marginBottom, setMarginBottom] = useState("0");
    const [marginLeft, setMarginLeft] = useState("0");

    // Advanced tab - individual padding
    const [paddingTop, setPaddingTop] = useState("0");
    const [paddingRight, setPaddingRight] = useState("0");
    const [paddingBottom, setPaddingBottom] = useState("0");
    const [paddingLeft, setPaddingLeft] = useState("0");

    // Advanced tab - border, radius, shadow
    const [border, setBorder] = useState("");
    const [borderType, setBorderType] = useState("");
    const [borderRadius, setBorderRadius] = useState("0");
    const [boxShadow, setBoxShadow] = useState("none");
    // Advanced tab - extended border radius
    const [borderTopLeftRadius, setBorderTopLeftRadius] = useState("0");
    const [borderTopRightRadius, setBorderTopRightRadius] = useState("0");
    const [borderBottomRightRadius, setBorderBottomRightRadius] = useState("0");
    const [borderBottomLeftRadius, setBorderBottomLeftRadius] = useState("0");

    // Advanced tab - individual box shadow
    const [boxShadowX, setBoxShadowX] = useState("0px");
    const [boxShadowY, setBoxShadowY] = useState("0px");
    const [boxShadowBlur, setBoxShadowBlur] = useState("0px");
    const [boxShadowColor, setBoxShadowColor] = useState("rgba(0,0,0,0.2)");

    // Background settings
    const [backgroundType, setBackgroundType] = useState<"color" | "image">("color");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [backgroundImage, setBackgroundImage] = useState("");

    // Border type (solid, dashed, etc.)
    const [borderColor, setBorderColor] = useState("");

    // Hover effects
    const [hoverBackgroundColor, setHoverBackgroundColor] = useState("");
    const [hoverTextColor, setHoverTextColor] = useState("");

    // Flex properties
    const [alignSelf, setAlignSelf] = useState("auto");
    const [order, setOrder] = useState(0);

    // Size
    const [height, setHeight] = useState("auto");
    const [minWidth, setMinWidth] = useState("0");
    const [maxWidth, setMaxWidth] = useState("none");

    // Z-Index
    const [zIndex, setZIndex] = useState(1);

    // Entrance animation
    const [entranceAnimation, setEntranceAnimation] = useState("fade-in");
    const [motionEffect, setMotionEffect] = useState("none");
    const [hoverable, setHoverable] = useState(false);


    const fontSizeClass = getFontSizeClass(fontSize);
    const fontFamilyClass = {
        "Arial": "font-sans",
        "Verdana": "font-sans",
        "Times New Roman": "font-serif",
        "Georgia": "font-serif",
        "Courier New": "font-mono"
    }[fontFamily] || "font-sans";

    const animationClass = animated ? animationType : "";

    // Build the inner HTML
    const inner = url
        ? `<a href="${url}" class="underline">${text}</a>`
        : text;

    const styleString = [
        `color:${color}`,
        `margin-top:${marginTop}`,
        `margin-right:${marginRight}`,
        `margin-bottom:${marginBottom}`,
        `margin-left:${marginLeft}`,
        `padding-top:${paddingTop}`,
        `padding-right:${paddingRight}`,
        `padding-bottom:${paddingBottom}`,
        `padding-left:${paddingLeft}`,
        `width:${width}`,
        `position:${position}`,
        `text-align:${alignment}`,
        `font-weight:${fontWeight}`,
        `text-transform:${textTransform}`,
        `font-style:${fontStyle}`,
        `text-decoration:${textDecoration}`,
        `line-height:${lineHeight}`,
        `letter-spacing:${letterSpacing}px`,
        `word-spacing:${wordSpacing}px`,
        `border:${border}`,
        `border-radius:${borderRadius}`,
        `box-shadow:${boxShadow}`,
        `z-index:${zIndex}`,
        `order:${order}`,
        `align-self:${alignSelf}`,
        backgroundType === "color" ? `background-color:${backgroundColor}` : "",
        backgroundType === "image" && backgroundImage
            ? `background-image:url('${backgroundImage}'); background-size:cover; background-repeat:no-repeat`
            : "",
        showTextStroke ? `-webkit-text-stroke-width:${textStrokeWidth}px` : "",
        showTextStroke ? `-webkit-text-stroke-color:${textStrokeColor}` : "",
        showTextShadow
            ? `text-shadow:${textShadowX}px ${textShadowY}px ${textShadowBlur}px ${color}`
            : "",
        animated ? `animation: ${animationType} 1s` : "",
    ]
        .filter(Boolean)
        .join(";");

    // Build the widget HTML
    const textHtml = `<${tag} class="${fontSizeClass} ${fontFamilyClass} ${animationClass}" style="${styleString}">${inner}</${tag}>`;

    return (
        <div className="border rounded p-2 mb-2 bg-white">
            <div className="mb-2 text-xs font-semibold flex justify-between items-center">
                <span>Heading</span>
                <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded text-[10px]"
                    onClick={() => setIsEditing((prev) => !prev)}
                >
                    {isEditing ? "Close" : "Edit"}
                </button>
            </div>
            {isEditing && (
                <>
                    <div className="flex border-b mb-2 text-xs">
                        <div
                            className={`cursor-pointer px-3 py-2 ${activeTab === "content"
                                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("content")}
                        >
                            Content
                        </div>
                        <div
                            className={`cursor-pointer px-3 py-2 ${activeTab === "style"
                                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("style")}
                        >
                            Style
                        </div>
                        <div
                            className={`cursor-pointer px-3 py-2 ${activeTab === "advance"
                                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab("advance")}
                        >
                            Advanced
                        </div>
                    </div>
                    {activeTab === "content" && (
                        <ContentTab
                            text={text}
                            setText={setText}
                            url={url}
                            setUrl={setUrl}
                            tag={tag}
                            setTag={setTag}
                            animated={animated}
                            setAnimated={setAnimated}
                            animationType={animationType}
                            setAnimationType={setAnimationType}
                            htmlTags={htmlTags}
                            animationOptions={animationOptions}
                        />
                    )}
                    {activeTab === "style" && (
                        <StyleTab
                            alignment={alignment}
                            setAlignment={setAlignment}
                            showTypography={showTypography}
                            setShowTypography={setShowTypography}
                            fontFamily={fontFamily}
                            setFontFamily={setFontFamily}
                            fontSize={fontSize}
                            setFontSize={setFontSize}
                            fontWeight={fontWeight}
                            setFontWeight={setFontWeight}
                            textTransform={textTransform}
                            setTextTransform={setTextTransform}
                            fontStyle={fontStyle}
                            setFontStyle={setFontStyle}
                            textDecoration={textDecoration}
                            setTextDecoration={setTextDecoration}
                            lineHeight={lineHeight}
                            setLineHeight={setLineHeight}
                            letterSpacing={letterSpacing}
                            setLetterSpacing={setLetterSpacing}
                            wordSpacing={wordSpacing}
                            setWordSpacing={setWordSpacing}
                            showTextStroke={showTextStroke}
                            setShowTextStroke={setShowTextStroke}
                            textStrokeWidth={textStrokeWidth}
                            setTextStrokeWidth={setTextStrokeWidth}
                            textStrokeColor={textStrokeColor}
                            setTextStrokeColor={setTextStrokeColor}
                            showTextShadow={showTextShadow}
                            setShowTextShadow={setShowTextShadow}
                            textShadowBlur={textShadowBlur}
                            setTextShadowBlur={setTextShadowBlur}
                            textShadowX={textShadowX}
                            setTextShadowX={setTextShadowX}
                            textShadowY={textShadowY}
                            setTextShadowY={setTextShadowY}
                            fontFamilies={fontFamilies}
                        />
                    )}
                    {activeTab === "advance" && (
                        <AdvancedTab
                            marginTop={marginTop} setMarginTop={setMarginTop}
                            marginRight={marginRight} setMarginRight={setMarginRight}
                            marginBottom={marginBottom} setMarginBottom={setMarginBottom}
                            marginLeft={marginLeft} setMarginLeft={setMarginLeft}

                            paddingTop={paddingTop} setPaddingTop={setPaddingTop}
                            paddingRight={paddingRight} setPaddingRight={setPaddingRight}
                            paddingBottom={paddingBottom} setPaddingBottom={setPaddingBottom}
                            paddingLeft={paddingLeft} setPaddingLeft={setPaddingLeft}

                            width={width} setWidth={setWidth}
                            position={position} setPosition={setPosition}

                            border={border} setBorder={setBorder}
                            borderType={borderType} setBorderType={setBorderType}
                            borderColor={borderColor} setBorderColor={setBorderColor}

                            borderTopLeftRadius={borderTopLeftRadius} setBorderTopLeftRadius={setBorderTopLeftRadius}
                            borderTopRightRadius={borderTopRightRadius} setBorderTopRightRadius={setBorderTopRightRadius}
                            borderBottomRightRadius={borderBottomRightRadius} setBorderBottomRightRadius={setBorderBottomRightRadius}
                            borderBottomLeftRadius={borderBottomLeftRadius} setBorderBottomLeftRadius={setBorderBottomLeftRadius}

                            boxShadowX={boxShadowX} setBoxShadowX={setBoxShadowX}
                            boxShadowY={boxShadowY} setBoxShadowY={setBoxShadowY}
                            boxShadowBlur={boxShadowBlur} setBoxShadowBlur={setBoxShadowBlur}
                            boxShadowColor={boxShadowColor} setBoxShadowColor={setBoxShadowColor}

                            backgroundType={backgroundType} setBackgroundType={setBackgroundType}
                            backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor}
                            backgroundImage={backgroundImage} setBackgroundImage={setBackgroundImage}

                            alignSelf={alignSelf} setAlignSelf={setAlignSelf}
                            order={order} setOrder={setOrder}
                            zIndex={zIndex} setZIndex={setZIndex}

                            hoverable={hoverable} setHoverable={setHoverable}

                            motionEffect={motionEffect} setMotionEffect={setMotionEffect}
                        />

                    )}
                </>
            )}
            <div
                className="border rounded-md bg-white shadow-md p-4 cursor-move text-center flex flex-col items-center justify-center gap-2 w-32 hover:bg-gray-50 transition"
                draggable
                onDragStart={() => setDraggedWidget(textHtml)}
                onClick={() => setDraggedWidget(textHtml)}
                title="Click or drag to add"
            >
                <div className="text-2xl text-gray-700">
                    <RiHeading />
                </div>
                <span className="text-xs font-medium text-gray-800">Heading</span>
            </div>
        </div>
    );
};

export default TextWidget;