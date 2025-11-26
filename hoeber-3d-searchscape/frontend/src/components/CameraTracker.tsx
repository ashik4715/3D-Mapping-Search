import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION } from '@mediapipe/face_mesh';

export type DistanceState = 'close' | 'medium' | 'far' | 'none';

interface CameraTrackerProps {
  onDistanceChange: (state: DistanceState, distance: number) => void;
  enabled: boolean;
}

export function CameraTracker({ onDistanceChange, enabled }: CameraTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const REFERENCE_FACE_WIDTH = 180;
  const REFERENCE_DISTANCE_CM = 60;

  const estimateDistance = useCallback((landmarks: any[]): number => {
    if (!landmarks || landmarks.length < 468) return 0;

    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];

    const faceWidth = Math.abs(
      Math.sqrt(
        Math.pow(leftCheek.x - rightCheek.x, 2) +
        Math.pow(leftCheek.y - rightCheek.y, 2)
      ) * (canvasRef.current?.width || 640)
    );

    if (faceWidth === 0) return 0;

    const distance = (REFERENCE_DISTANCE_CM * REFERENCE_FACE_WIDTH) / faceWidth;
    return Math.max(30, Math.min(150, distance));
  }, []);

  const classifyDistance = useCallback((distance: number): DistanceState => {
    if (distance === 0) return 'none';
    if (distance < 50) return 'close';
    if (distance < 80) return 'medium';
    return 'far';
  }, []);

  useEffect(() => {
    if (!enabled || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!ctx || !canvas) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        const distance = estimateDistance(landmarks);
        const state = classifyDistance(distance);

        onDistanceChange(state, distance);

        drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, {
          color: '#60A5FA30',
          lineWidth: 1,
        });
        drawLandmarks(ctx, landmarks, {
          color: '#3B82F6',
          lineWidth: 1,
          radius: 1.5,
        });

        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`Distance: ${distance.toFixed(1)}cm`, 10, 30);
        ctx.fillText(`Mode: ${state.toUpperCase()}`, 10, 50);
      } else {
        onDistanceChange('none', 0);
      }

      ctx.restore();
    });

    faceMeshRef.current = faceMesh;

    const camera = new Camera(video, {
      onFrame: async () => {
        if (faceMesh && video.videoWidth > 0 && video.videoHeight > 0) {
          await faceMesh.send({ image: video });
        }
      },
      width: 640,
      height: 480,
    });

    cameraRef.current = camera;

    const startCamera = async () => {
      try {
        setError(null);
        await camera.start();
        setPermissionGranted(true);

        const updateCanvasSize = () => {
          if (canvas && video) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
        };

        video.addEventListener('loadedmetadata', updateCanvasSize);
        updateCanvasSize();
      } catch (err: any) {
        console.error('Camera error:', err);
        setError(err.message || 'Failed to access camera');
        setPermissionGranted(false);
      }
    };

    startCamera();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enabled, estimateDistance, classifyDistance, onDistanceChange]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-lg max-w-full h-auto"
      />
      {error && (
        <div className="mt-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {!permissionGranted && !error && (
        <div className="mt-4 text-gray-600 text-sm">Initializing camera...</div>
      )}
    </div>
  );
}
