"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

interface CameraProps {
  onCapture: (dataUrl: string) => void;
}

const MAX_YAW_DEGREE = 15; // tolerance sa mukha na nakaharap (degree)

const CameraWithFaceDetection: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceValid, setFaceValid] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Load models mula sa /models folder
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";

        await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark68");

        setModelsLoaded(true);
      } catch (err) {
        console.error("Face‑API model loading error:", err);
      }
    };
    loadModels();
  }, []);

  // Simulan ang webcam kapag ready na ang models
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
        console.error("Camera error:", err);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [modelsLoaded]);

  // Helper function para i-calculate eye aspect ratio (EAR) para blink detection
  const isBlinking = (landmarks: faceapi.FaceLandmarks68) => {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const calcEAR = (eye: faceapi.Point[]) => {
      const vertical1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
      const vertical2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
      const horizontal = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
      return (vertical1 + vertical2) / (2.0 * horizontal);
    };

    const leftEAR = calcEAR(leftEye);
    const rightEAR = calcEAR(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;

    // Threshold para sa eye closure, adjust kung kinakailangan
    return avgEAR < 0.25;
  };

  // Helper function para kunin approximate yaw (pag-ikot ng mukha left/right) sa degrees
  const getApproximateYaw = (landmarks: faceapi.FaceLandmarks68) => {
    // Simplified estimation gamit ng nose tip at chin
    const nose = landmarks.getNose()[3]; // tip of the nose
    const leftCheek = landmarks.getJawOutline()[0];
    const rightCheek = landmarks.getJawOutline()[16];

    // relative horizontal position ng nose sa pagitan ng cheeks
    const totalWidth = rightCheek.x - leftCheek.x;
    const noseOffset = nose.x - leftCheek.x;
    const ratio = noseOffset / totalWidth; // 0 = full left, 1 = full right, ~0.5 = center

    // Convert sa degree -1 to 1 mapped to -30deg to 30deg (approx)
    const yawDeg = (ratio - 0.5) * 60;

    return yawDeg;
  };

  // Analyze frame for face, expression (smile), and blink
  const analyseFrame = useCallback(async () => {
    if (!videoRef.current || !modelsLoaded) return;

    const detections = await faceapi
      .detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections.length === 0) {
      setFaceValid(false);
    } else {
      const detection = detections[0];
      const expressions = detection.expressions;

      // Smile detection - confident na happy expression
      const isSmiling = expressions.happy > 0.6;

      // Blink detection gamit ang landmarks
      const blinking = isBlinking(detection.landmarks);

      // Face yaw (left/right facing camera)
      const yawDeg = getApproximateYaw(detection.landmarks);
      const isFacingCamera = Math.abs(yawDeg) <= MAX_YAW_DEGREE;

      const isValid = isFacingCamera && (isSmiling || blinking);

      setFaceValid(isValid);

      if (isValid && !capturedImage) {
        capture();
      }
    }

    requestAnimationFrame(analyseFrame);
  }, [modelsLoaded, capturedImage]);

  const handlePlay = () => {
    requestAnimationFrame(analyseFrame);
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

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

    // Stop webcam stream para makatipid ng battery
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!capturedImage && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onPlay={handlePlay}
          className={`w-full max-w-xs aspect-video rounded shadow-lg border-4 transition-colors duration-200 ${faceValid ? "border-green-500" : "border-red-500"
            }`}
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {!capturedImage && (
        <p
          className={`mt-2 text-sm font-semibold ${faceValid ? "text-green-600" : "text-red-600"
            }`}
        >
          {faceValid
            ? "Valid face detected, facing the camera with a blink or smile ✅"
            : "Not valid: not facing camera, no blink or smile detected"}

        </p>
      )}

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
