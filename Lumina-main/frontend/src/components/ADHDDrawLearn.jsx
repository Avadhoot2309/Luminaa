import React, { useEffect, useRef, useState } from 'react';
import './ADHDFeatureModules.css';

const prompts = [
    'Draw a big circle 🔵',
    'Draw the letter A ✍️',
    'Draw a smiling face 😊',
    'Draw a triangle 🔺'
];

const ADHDDrawLearn = ({ onClose }) => {
    const canvasRef = useRef(null);
    const wrapRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#2563EB');
    const [lineWidth, setLineWidth] = useState(6);
    const [promptIndex, setPromptIndex] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapRef.current;
        if (!canvas || !wrapper) return;

        const resize = () => {
            const rect = wrapper.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = 340;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const getPos = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (event.touches?.length) {
            return {
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top
            };
        }

        return {
            x: event.nativeEvent.offsetX,
            y: event.nativeEvent.offsetY
        };
    };

    const startDrawing = (event) => {
        const ctx = canvasRef.current.getContext('2d');
        const pos = getPos(event);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const draw = (event) => {
        if (!isDrawing) return;
        if (event.touches?.length) event.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        const pos = getPos(event);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const nextPrompt = () => {
        setPromptIndex((prev) => (prev + 1) % prompts.length);
        clearCanvas();
    };

    return (
        <div className="adhd-feature-overlay">
            <div className="adhd-feature-card">
                <div className="adhd-feature-head">
                    <div>
                        <h2 className="adhd-feature-title">🎨 Draw & Learn</h2>
                        <p className="adhd-feature-subtitle">Prompt: {prompts[promptIndex]}</p>
                    </div>
                    <button className="adhd-close-btn" onClick={onClose}>← Back</button>
                </div>

                <div className="toolbar">
                    <label className="adhd-soft-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        🎨
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            style={{ border: 'none', width: '28px', height: '28px', padding: 0, background: 'transparent' }}
                        />
                    </label>
                    <label className="adhd-soft-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        Brush
                        <input
                            type="range"
                            min="2"
                            max="18"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(Number(e.target.value))}
                        />
                    </label>
                    <button type="button" className="adhd-soft-btn" onClick={clearCanvas}>🧽 Clear</button>
                    <button type="button" className="adhd-main-btn" onClick={nextPrompt}>Next Prompt →</button>
                </div>

                <div ref={wrapRef} style={{ marginTop: '12px' }}>
                    <canvas
                        ref={canvasRef}
                        className="draw-canvas"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
            </div>
        </div>
    );
};

export default ADHDDrawLearn;