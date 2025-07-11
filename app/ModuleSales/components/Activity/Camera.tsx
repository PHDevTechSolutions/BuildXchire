"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

interface CameraProps {
  /**
   * Returns a base‑64 JPEG string of the automatically‑captured frame once a
   * face has been validated.
   */
  onCapture: (dataUrl: string) => void;
}

/**
 * Camera component that streams the user’s webcam, performs real‑time face
 * detection, and automatically captures the frame once a valid face is in
 * view. When a face is detected, a green border (and label) is shown around
 * the video preview for instant feedback.
 *
 * 👉 **Usage:**
 * ```tsx
 * <CameraWithFaceDetection onCapture={(img) => console.log(img)} />
 * ```
 */
const CameraWithFaceDetection: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  /**
   * Load tiny‑face‑detector model from the public/models directory. Adjust the
   * path if you host the weights elsewhere.
   */
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Use TinyFaceDetector for speed on mobile devices
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector");

        setModelsLoaded(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Face‑API model loading error:", err);
      }
    };
    loadModels();
  }, []);

  /**
   * Initialise the user’s webcam after models are ready.
   */
  useEffect(() => {
    if (!modelsLoaded) return;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Camera error:", err);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [modelsLoaded]);

  /**
   * Run face‑detection on every animation frame while video is playing.
   */
  const analyseFrame = useCallback(async () => {
    if (!videoRef.current || !modelsLoaded) return;

    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
    );

    const hasFace = detections.length > 0;
    setFaceDetected(hasFace);

    // Automatically capture once a face is detected the first time
    if (hasFace && !capturedImage) {
      capture();
    }

    requestAnimationFrame(analyseFrame);
  }, [modelsLoaded, capturedImage]);

  /**
   * Start face‑analysis once the video starts playing.
   */
  const handlePlay = () => {
    requestAnimationFrame(analyseFrame);
  };

  /**
   * Capture current frame to a canvas and emit via onCapture.
   */
  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Adjust canvas to video size
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    ctx.drawImage(
      videoRef.current,
      0,
      0,
      videoRef.current.videoWidth,
      videoRef.current.videoHeight
    );

    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    onCapture(dataUrl);

    // Stop streaming to save battery
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Video preview with dynamic border colour based on face detection */}
      {!capturedImage && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onPlay={handlePlay}
          className={`w-full max-w-xs aspect-video rounded shadow-lg border-4 transition-colors duration-200 ${faceDetected ? "border-green-500" : "border-red-500"}`}
        />
      )}

      {/* Hidden canvas for capturing frame */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Feedback label */}
      {!capturedImage && (
        <p
          className={`mt-2 text-sm font-semibold ${faceDetected ? "text-green-600" : "text-red-600"}`}
        >
          {faceDetected ? "Valid face detected ✅" : "No face detected"}
        </p>
      )}

      {/* Show captured image once available */}
      {capturedImage && (
        <div className="mt-4 w-full flex flex-col items-center">
          <p className="mb-2 font-semibold">Captured Image:</p>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-xs rounded shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default CameraWithFaceDetection;
