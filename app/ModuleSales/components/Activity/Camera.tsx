import React, { useEffect, useRef, useState } from "react";

interface CameraProps {
  onCapture: (dataUrl: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        streamRef.current = stream;
      })
      .catch(err => console.error("Camera error:", err));

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      setLoading(true);

      // Timeout to simulate loading animation
      setTimeout(() => {
        const ctx = canvasRef.current!.getContext("2d");
        if (!ctx) {
          setLoading(false);
          return;
        }
        ctx.drawImage(videoRef.current!, 0, 0, 320, 240);
        const dataUrl = canvasRef.current!.toDataURL("image/jpeg");

        // Stop video stream after capture
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        setCapturedImage(dataUrl);
        onCapture(dataUrl);
        setLoading(false);
      }, 500); // 500ms loading simulation
    }
  };

  return (
    <div>
      {!capturedImage && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-100 object-cover border border-gray-300 rounded"
        />
      )}

      <canvas ref={canvasRef} width={320} height={240} className="hidden" />

      <button
        type="button"
        onClick={capture}
        className="mt-2 bg-gray-800 text-white px-3 py-1 rounded text-xs w-full flex justify-center items-center"
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          "Capture Photo"
        )}
      </button>

      {capturedImage && (
        <div className="mt-4">
          <p className="text-center mb-2 font-semibold">Captured Image:</p>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-xs mx-auto border border-gray-300 rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Camera;
