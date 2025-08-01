import React from "react";

interface AdvancedTabProps {
  marginTop: string; setMarginTop: (v: string) => void;
  marginRight: string; setMarginRight: (v: string) => void;
  marginBottom: string; setMarginBottom: (v: string) => void;
  marginLeft: string; setMarginLeft: (v: string) => void;

  paddingTop: string; setPaddingTop: (v: string) => void;
  paddingRight: string; setPaddingRight: (v: string) => void;
  paddingBottom: string; setPaddingBottom: (v: string) => void;
  paddingLeft: string; setPaddingLeft: (v: string) => void;

  width: string; setWidth: (v: string) => void;
  position: string; setPosition: (v: string) => void;

  border: string; setBorder: (v: string) => void;
  borderType: string; setBorderType: (v: string) => void;
  borderColor: string; setBorderColor: (v: string) => void;

  borderTopLeftRadius: string; setBorderTopLeftRadius: (v: string) => void;
  borderTopRightRadius: string; setBorderTopRightRadius: (v: string) => void;
  borderBottomRightRadius: string; setBorderBottomRightRadius: (v: string) => void;
  borderBottomLeftRadius: string; setBorderBottomLeftRadius: (v: string) => void;

  boxShadowX: string; setBoxShadowX: (v: string) => void;
  boxShadowY: string; setBoxShadowY: (v: string) => void;
  boxShadowBlur: string; setBoxShadowBlur: (v: string) => void;
  boxShadowColor: string; setBoxShadowColor: (v: string) => void;

  backgroundType: "color" | "image"; setBackgroundType: (v: "color" | "image") => void;
  backgroundColor: string; setBackgroundColor: (v: string) => void;
  backgroundImage: string; setBackgroundImage: (v: string) => void;

  alignSelf: string; setAlignSelf: (v: string) => void;
  order: number; setOrder: (v: number) => void;
  zIndex: number; setZIndex: (v: number) => void;

  hoverable: boolean; setHoverable: (v: boolean) => void;

  motionEffect: string; setMotionEffect: (v: string) => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = (props) => {
  return (
    <div className="grid grid-cols-1 gap-2 mb-1 border p-2 text-xs">
      {/* Margin */}
      <label className="font-bold">Margin</label>
      <div className="grid grid-cols-2 gap-2">
        <input value={props.marginTop} onChange={e => props.setMarginTop(e.target.value)} placeholder="Top" className="border p-1 rounded" />
        <input value={props.marginRight} onChange={e => props.setMarginRight(e.target.value)} placeholder="Right" className="border p-1 rounded" />
        <input value={props.marginBottom} onChange={e => props.setMarginBottom(e.target.value)} placeholder="Bottom" className="border p-1 rounded" />
        <input value={props.marginLeft} onChange={e => props.setMarginLeft(e.target.value)} placeholder="Left" className="border p-1 rounded" />
      </div>

      {/* Padding */}
      <label className="font-bold mt-2">Padding</label>
      <div className="grid grid-cols-2 gap-2">
        <input value={props.paddingTop} onChange={e => props.setPaddingTop(e.target.value)} placeholder="Top" className="border p-1 rounded" />
        <input value={props.paddingRight} onChange={e => props.setPaddingRight(e.target.value)} placeholder="Right" className="border p-1 rounded" />
        <input value={props.paddingBottom} onChange={e => props.setPaddingBottom(e.target.value)} placeholder="Bottom" className="border p-1 rounded" />
        <input value={props.paddingLeft} onChange={e => props.setPaddingLeft(e.target.value)} placeholder="Left" className="border p-1 rounded" />
      </div>

      {/* Width & Position */}
      <label className="font-bold mt-2">Width</label>
      <input value={props.width} onChange={e => props.setWidth(e.target.value)} className="border rounded p-1" placeholder="e.g. auto, 100%" />
      
      <label className="font-bold mt-2">Position</label>
      <select value={props.position} onChange={e => props.setPosition(e.target.value)} className="border rounded p-1">
        <option value="static">Static</option>
        <option value="relative">Relative</option>
        <option value="absolute">Absolute</option>
        <option value="fixed">Fixed</option>
        <option value="sticky">Sticky</option>
      </select>

      {/* Border */}
      <label className="font-bold mt-2">Border</label>
      <input value={props.border} onChange={e => props.setBorder(e.target.value)} className="border rounded p-1" placeholder="e.g. 1px" />
      <select value={props.borderType} onChange={e => props.setBorderType(e.target.value)} className="border rounded p-1">
        <option value="solid">Solid</option>
        <option value="dashed">Dashed</option>
        <option value="dotted">Dotted</option>
        <option value="double">Double</option>
        <option value="none">None</option>
      </select>
      <input value={props.borderColor} onChange={e => props.setBorderColor(e.target.value)} type="color" className="w-full h-8 p-1" />

      {/* Border Radius */}
      <label className="font-bold mt-2">Border Radius</label>
      <div className="grid grid-cols-2 gap-2">
        <input value={props.borderTopLeftRadius} onChange={e => props.setBorderTopLeftRadius(e.target.value)} placeholder="Top Left" className="border p-1 rounded" />
        <input value={props.borderTopRightRadius} onChange={e => props.setBorderTopRightRadius(e.target.value)} placeholder="Top Right" className="border p-1 rounded" />
        <input value={props.borderBottomRightRadius} onChange={e => props.setBorderBottomRightRadius(e.target.value)} placeholder="Bottom Right" className="border p-1 rounded" />
        <input value={props.borderBottomLeftRadius} onChange={e => props.setBorderBottomLeftRadius(e.target.value)} placeholder="Bottom Left" className="border p-1 rounded" />
      </div>

      {/* Box Shadow */}
      <label className="font-bold mt-2">Box Shadow</label>
      <div className="grid grid-cols-2 gap-2">
        <input value={props.boxShadowX} onChange={e => props.setBoxShadowX(e.target.value)} placeholder="X" className="border p-1 rounded" />
        <input value={props.boxShadowY} onChange={e => props.setBoxShadowY(e.target.value)} placeholder="Y" className="border p-1 rounded" />
        <input value={props.boxShadowBlur} onChange={e => props.setBoxShadowBlur(e.target.value)} placeholder="Blur" className="border p-1 rounded" />
        <input value={props.boxShadowColor} onChange={e => props.setBoxShadowColor(e.target.value)} type="color" className="w-full h-8" />
      </div>

      {/* Background */}
      <label className="font-bold mt-2">Background</label>
      <select
        value={props.backgroundType}
        onChange={(e) => props.setBackgroundType(e.target.value as "color" | "image")}
        className="border rounded p-1"
      >
        <option value="color">Color</option>
        <option value="image">Image</option>
      </select>
      {props.backgroundType === "color" ? (
        <input value={props.backgroundColor} onChange={e => props.setBackgroundColor(e.target.value)} type="color" className="w-full h-8" />
      ) : (
        <input value={props.backgroundImage} onChange={e => props.setBackgroundImage(e.target.value)} placeholder="Image URL" className="border p-1 rounded" />
      )}

      {/* Layout */}
      <label className="font-bold mt-2">Align Self</label>
      <select value={props.alignSelf} onChange={e => props.setAlignSelf(e.target.value)} className="border rounded p-1">
        <option value="auto">Auto</option>
        <option value="start">Start</option>
        <option value="center">Center</option>
        <option value="end">End</option>
        <option value="stretch">Stretch</option>
      </select>

      <label className="font-bold mt-2">Order</label>
      <input type="number" value={props.order} onChange={(e) => props.setOrder(Number(e.target.value))} className="border p-1 rounded" />

      <label className="font-bold mt-2">Z-Index</label>
      <input type="number" value={props.zIndex} onChange={e => props.setZIndex(Number(e.target.value))} className="border p-1 rounded" />

      {/* Hover */}
      <div className="mt-2">
        <label className="font-bold mr-2">Hover</label>
        <input type="checkbox" checked={props.hoverable} onChange={e => props.setHoverable(e.target.checked)} />
      </div>

      {/* Motion */}
      <label className="font-bold mt-2">Motion Effect</label>
      <select value={props.motionEffect} onChange={e => props.setMotionEffect(e.target.value)} className="border rounded p-1">
        <option value="">None</option>
        <option value="fade-in">Fade In</option>
        <option value="slide-up">Slide Up</option>
        <option value="zoom-in">Zoom In</option>
        <option value="bounce">Bounce</option>
        <option value="rotate">Rotate</option>
        <option value="flip">Flip</option>
        <option value="shake">Shake</option>
        <option value="pulse">Pulse</option>
        <option value="swing">Swing</option>
        <option value="jello">Jello</option>
        <option value="tada">Tada</option>
        <option value="wobble">Wobble</option>
        <option value="heartBeat">Heart Beat</option>
        <option value="rubberBand">Rubber Band</option>
        <option value="flash">Flash</option>
        <option value="rollIn">Roll In</option>
        <option value="rollOut">Roll Out</option>
        <option value="zoomOut">Zoom Out</option>
        <option value="zoomOutDown">Zoom Out Down</option>
        <option value="zoomOutLeft">Zoom Out Left</option>
        <option value="zoomOutRight">Zoom Out Right</option>
        <option value="zoomInDown">Zoom In Down</option>
        <option value="zoomInLeft">Zoom In Left</option>
        <option value="zoomInRight">Zoom In Right</option>
        <option value="fade-out">Fade Out</option>
        <option value="slide-down">Slide Down</option>
        <option value="slide-left">Slide Left</option>
        <option value="slide-right">Slide Right</option>
        <option value="flipInX">Flip In X</option>
        <option value="flipInY">Flip In Y</option>
        <option value="flipOutX">Flip Out X</option>
        <option value="flipOutY">Flip Out Y</option>
        <option value="bounceIn">Bounce In</option>
        <option value="bounceOut">Bounce Out</option>
      </select>
    </div>
  );
};

export default AdvancedTab;
