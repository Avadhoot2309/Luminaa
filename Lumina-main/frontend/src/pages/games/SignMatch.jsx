import React, { useEffect, useMemo, useRef, useState } from 'react';
import GameContainer from '../../components/games/GameContainer';
import { useTranslation } from 'react-i18next';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { fetchSignModelMeta, predictSignFromDataUrl, SIGN_API_BASE } from '../../services/signLanguageService';

export default function SignMatch() {
    const { t } = useTranslation();
    const { playSuccess, playError, playVictory } = useSoundEffects();

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const processedCanvasRef = useRef(null);

    const [labels, setLabels] = useState([]);
    const [targetLabel, setTargetLabel] = useState('');
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [cameraReady, setCameraReady] = useState(false);
    const [checking, setChecking] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [lastPrediction, setLastPrediction] = useState(null);
    const [error, setError] = useState('');
    const [liveHandData, setLiveHandData] = useState(null);

    const passThreshold = 0.40;

    const accuracy = useMemo(() => {
        if (attempts === 0) return 0;
        return Math.round((score / attempts) * 100);
    }, [score, attempts]);

    useEffect(() => {
        const loadMeta = async () => {
            try {
                setLoadingMeta(true);
                const meta = await fetchSignModelMeta();
                const loadedLabels = (meta?.labels || []).filter(Boolean);
                setLabels(loadedLabels);

                if (loadedLabels.length > 0) {
                    setTargetLabel(loadedLabels[Math.floor(Math.random() * loadedLabels.length)]);
                } else {
                    setError('No labels found. Add sign_labels.txt for class names.');
                }
            } catch (e) {
                setError(`Sign model API not reachable at ${SIGN_API_BASE}. Start the Python server first.`);
            } finally {
                setLoadingMeta(false);
            }
        };

        loadMeta();
    }, []);

    useEffect(() => {
        let stream;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraReady(true);
                }
            } catch (e) {
                setError('Camera permission is needed for this game. Please allow camera access.');
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const chooseNextTarget = () => {
        if (labels.length === 0) return;
        const next = labels[Math.floor(Math.random() * labels.length)];
        setTargetLabel(next);
    };

    const drawOverlay = () => {
        const video = videoRef.current;
        const overlayCanvas = overlayCanvasRef.current;

        if (!video || !overlayCanvas || !video.videoWidth) return;

        overlayCanvas.width = video.videoWidth;
        overlayCanvas.height = video.videoHeight;

        const ctx = overlayCanvas.getContext('2d');
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // Draw if we have hand data
        if (liveHandData) {
            const { bbox, keypoints } = liveHandData;

            // Draw bounding box (magenta/pink)
            ctx.strokeStyle = '#FF00FF';
            ctx.lineWidth = 3;
            ctx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);

            // Draw keypoints (red circles)
            ctx.fillStyle = '#FF0000';
            keypoints?.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw label
            ctx.fillStyle = '#FF00FF';
            ctx.fillRect(bbox.x, bbox.y - 40, 150, 40);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(liveHandData.label || '', bbox.x + 10, bbox.y - 10);
        }

        requestAnimationFrame(drawOverlay);
    };

    useEffect(() => {
        if (cameraReady) {
            drawOverlay();
        }
    }, [cameraReady, liveHandData]);

    const captureFrameAsDataUrl = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            return null;
        }

        const size = 224;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -size, 0, size, size);
        ctx.restore();

        return canvas.toDataURL('image/jpeg', 0.9);
    };

    // Draw what the model sees (400x400 white background with hand)
    const visualizeProcessedFrame = async () => {
        const video = videoRef.current;
        const processedCanvas = processedCanvasRef.current;

        if (!video || !processedCanvas || !video.videoWidth || !cameraReady) return;

        try {
            // Create temporary canvas for hand detection
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = video.videoWidth;
            tempCanvas.height = video.videoHeight;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.scale(-1, 1);
            tempCtx.drawImage(video, -tempCanvas.width, 0);

            const imageData = tempCanvas.toDataURL('image/jpeg', 0.85);

            // Send to backend to get hand detection info
            const response = await fetch(`${SIGN_API_BASE}/debug`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData })
            });

            if (response.ok) {
                const data = await response.json();

                // Draw the processed image on the visualization canvas
                if (data.processedImage) {
                    const img = new Image();
                    img.onload = () => {
                        processedCanvas.width = 120;
                        processedCanvas.height = 120;
                        const ctx = processedCanvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, 120, 120);
                    };
                    img.src = data.processedImage;
                }

                // Update hand data for overlay
                if (data.handData) {
                    setLiveHandData(data.handData);
                }
            }
        } catch (e) {
            // Silent fail for visualization
        }

        requestAnimationFrame(visualizeProcessedFrame);
    };

    useEffect(() => {
        if (cameraReady) {
            visualizeProcessedFrame();
        }
    }, [cameraReady]);

    const handleCheckSign = async () => {
        if (!cameraReady || checking || !targetLabel) return;

        const dataUrl = captureFrameAsDataUrl();
        if (!dataUrl) {
            setError('Could not capture camera frame.');
            return;
        }

        try {
            setChecking(true);
            setFeedback('Checking your sign...');

            const result = await predictSignFromDataUrl(dataUrl);
            const prediction = result?.prediction;
            setLastPrediction(prediction);
            setAttempts(prev => prev + 1);

            const predictedLabel = prediction?.label || '';
            const confidence = Number(prediction?.confidence || 0);

            if (predictedLabel === targetLabel && confidence >= passThreshold) {
                playSuccess();
                const newScore = score + 1;
                setScore(newScore);
                setFeedback(`✅ PASS! Great sign for "${targetLabel}" (${Math.round(confidence * 100)}%)`);

                if (newScore > 0 && newScore % 5 === 0) {
                    playVictory();
                }

                setTimeout(() => {
                    chooseNextTarget();
                    setFeedback('');
                }, 1000);
            } else {
                playError();
                setFeedback(
                    `❌ FAIL. Expected "${targetLabel}", got "${predictedLabel}" (${Math.round(confidence * 100)}%). Try again!`
                );
            }
        } catch (e) {
            setError(e.message || 'Prediction failed.');
            setFeedback('');
        } finally {
            setChecking(false);
        }
    };

    const gameBody = (
        <div style={{ width: '100%', maxWidth: '1050px', margin: '0 auto', padding: '12px 16px', color: '#0A1628' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '16px', boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '8px' }}>📷 Camera</div>

                    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: '320px',
                                objectFit: 'cover',
                                borderRadius: '14px',
                                transform: 'scaleX(-1)',
                                background: '#0f172a',
                                display: 'block'
                            }}
                        />
                        <canvas
                            ref={overlayCanvasRef}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '320px',
                                borderRadius: '14px',
                                transform: 'scaleX(-1)'
                            }}
                        />
                    </div>

                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>🎨 Processed</div>
                            <canvas
                                ref={processedCanvasRef}
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    borderRadius: '10px',
                                    background: '#FFFFFF',
                                    border: '2px solid #E2E8F0'
                                }}
                            />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>📊 Prediction</div>
                            <div style={{
                                height: '120px',
                                borderRadius: '10px',
                                background: lastPrediction ? '#E0F2FE' : '#F3F4F6',
                                border: '2px solid #E2E8F0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '8px'
                            }}>
                                {lastPrediction ? (
                                    <>
                                        <div style={{ fontWeight: 900, fontSize: '1.8rem', color: '#0369A1' }}>
                                            {lastPrediction.label}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#0C4A6E' }}>
                                            {Math.round((lastPrediction.confidence || 0) * 100)}% confidence
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Waiting...</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    <button
                        onClick={handleCheckSign}
                        disabled={!cameraReady || checking || !!error || loadingMeta}
                        style={{
                            marginTop: '12px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            fontWeight: 800,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            background: '#2563EB',
                            color: '#fff',
                            opacity: !cameraReady || checking || !!error || loadingMeta ? 0.5 : 1
                        }}
                    >
                        {checking ? 'Checking...' : 'Check My Sign'}
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '16px', boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>🎯 Make this sign:</div>
                        <div style={{ marginTop: '8px', fontWeight: 900, fontSize: '2.2rem', color: '#1d4ed8' }}>
                            {loadingMeta ? 'Loading model...' : targetLabel || '--'}
                        </div>
                        <div style={{ marginTop: '10px', color: '#475569', fontWeight: 700 }}>
                            Show the sign clearly inside camera frame, then press <strong>Check My Sign</strong>.
                        </div>
                    </div>

                    <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '16px', boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                            <span>✅ Passed: {score}</span>
                            <span>🧪 Attempts: {attempts}</span>
                            <span>📈 Accuracy: {accuracy}%</span>
                        </div>

                        {!!lastPrediction && (
                            <div style={{ marginTop: '10px', color: '#334155', fontWeight: 700 }}>
                                Last prediction: <strong>{lastPrediction.label}</strong> ({Math.round((lastPrediction.confidence || 0) * 100)}%)
                            </div>
                        )}

                        {feedback && (
                            <div style={{ marginTop: '10px', fontWeight: 800, color: feedback.includes('PASS') ? '#15803d' : '#b91c1c' }}>
                                {feedback}
                            </div>
                        )}

                        {error && (
                            <div style={{ marginTop: '10px', fontWeight: 800, color: '#b91c1c' }}>
                                {error}
                            </div>
                        )}
                    </div>

                    <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '16px', boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontWeight: 900, marginBottom: '6px' }}>ℹ️ Setup</div>
                        <div style={{ color: '#475569', lineHeight: 1.6 }}>
                            1) Place <strong>keras_model.h5</strong> in project root.<br />
                            2) (Optional) Create <strong>sign_labels.txt</strong> (one label per line).<br />
                            3) Start Python API at <strong>{SIGN_API_BASE}</strong>.<br />
                            4) Open this game and practice signs.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <GameContainer
            title={t('games.sign_match')}
            description={'Show the correct sign for the target word and pass/fail with your trained model.'}
            type="component"
            gameSource={gameBody}
            background="#EBF4FF"
        />
    );
}
