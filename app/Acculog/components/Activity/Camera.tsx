"use client";

import React, { useEffect, useRef, useState } from "react";

interface CameraProps {
  /**
   * Called with the base64/URL‑encoded photo after it is captured.
   * Parent components can immediately submit/save this value.
   */
  onCapture: (dataUrl: string) => void;
}

const COUNTDOWN_SECONDS = 4; // seconds before auto‑capture after tap

const CameraCaptureOnTap: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  /* ---------------------------- Start the webcam ----------------------------- */
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      })
      .catch((err) => {
        console.error("Camera error:", err);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /* ------------------------- Handle tap to start timer ----------------------- */
  const handleTap = () => {
    if (capturedImage) return; // already captured
    if (countdown === null) {
      setCountdown(COUNTDOWN_SECONDS);
    }
  };

  /* ---------------------------- Countdown logic ------------------------------ */
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      capture();
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => (prev! > 0 ? prev! - 1 : 0)), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  /* -------------------------------- Capture --------------------------------- */
  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);

    setCapturedImage(dataUrl);
    onCapture(dataUrl);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!capturedImage && (
        <div
          className="relative w-full max-w-xs cursor-pointer"
          onClick={handleTap}
          onTouchStart={handleTap}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-video shadow-lg border-2 border-green-700"
          />

          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-white text-6xl font-bold drop-shadow-lg">{countdown}</span>
            </div>
          )}

          {countdown === null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="text-white text-sm font-semibold text-center px-2">
                Tap anywhere to take photo
              </span>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {capturedImage && (
        <div className="mt-4 w-full flex flex-col items-center">
          <p className="mb-2 font-semibold">Captured Image (ready to submit):</p>
          <img src={capturedImage} alt="Captured" className="w-full max-w-xs rounded shadow-md" />
        </div>
      )}
    </div>
  );
};

export default CameraCaptureOnTap;