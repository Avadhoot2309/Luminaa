import React, { useState, useEffect, useRef } from 'react';
import './ADHDSortClick.css';

const ADHDSortClick = ({ onClose }) => {
    // Define objects with color and shape
    const objectsData = [
        { id: 1, color: 'red', shape: 'circle', emoji: '🔴' },
        { id: 2, color: 'red', shape: 'square', emoji: '🟥' },
        { id: 3, color: 'blue', shape: 'circle', emoji: '🔵' },
        { id: 4, color: 'blue', shape: 'square', emoji: '🟦' },
        { id: 5, color: 'green', shape: 'circle', emoji: '🟢' },
        { id: 6, color: 'green', shape: 'triangle', emoji: '🟩' },
    ];

    const buckets = [
        { id: 'red', label: '🔴 Red', color: '#EF4444' },
        { id: 'blue', label: '🔵 Blue', color: '#3B82F6' },
        { id: 'green', label: '🟢 Green', color: '#10B981' },
    ];

    const [objects, setObjects] = useState(objectsData.map(obj => ({ ...obj, sorted: false })));
    const [draggedItem, setDraggedItem] = useState(null);
    const [gameWon, setGameWon] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [celebrating, setCelebrating] = useState(false);
    const [shake, setShake] = useState(null); // null or object id to shake
    const audioRef = useRef(null);

    // Create audio context for success sound
    const playSuccessSound = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio context not available');
        }
    };

    // Handle drag start
    const handleDragStart = (e, objId) => {
        const obj = objects.find(o => o.id === objId);
        if (!obj.sorted) {
            setDraggedItem(objId);
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    // Handle drag over bucket
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // Handle drop on bucket
    const handleDrop = (e, bucketId) => {
        e.preventDefault();
        if (!draggedItem) return;

        const draggedObj = objects.find(o => o.id === draggedItem);

        // Check if correct color
        if (draggedObj.color === bucketId) {
            // Correct drop!
            setCelebrating(true);
            playSuccessSound();

            setObjects(objects.map(o =>
                o.id === draggedItem ? { ...o, sorted: true } : o
            ));

            const newCorrectCount = correctCount + 1;
            setCorrectCount(newCorrectCount);

            setTimeout(() => setCelebrating(false), 500);

            // Check if all sorted
            if (newCorrectCount === objects.length) {
                setTimeout(() => setGameWon(true), 800);
            }
        } else {
            // Wrong drop - gentle bounce back
            setShake(draggedItem);
            setTimeout(() => setShake(null), 500);
        }

        setDraggedItem(null);
    };

    // Handle drag end
    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    // Reset game
    const handlePlayAgain = () => {
        setObjects(objectsData.map(obj => ({ ...obj, sorted: false })));
        setCorrectCount(0);
        setGameWon(false);
    };

    return (
        <div className="sort-click-container">
            <button
                className="sort-top-back-btn"
                onClick={onClose}
                aria-label="Go back"
            >
                ← Back
            </button>

            {/* Celebration effect */}
            {celebrating && (
                <div className="sort-celebration">
                    <div className="sort-star">⭐</div>
                    <div className="sort-star">✨</div>
                    <div className="sort-star">⭐</div>
                </div>
            )}

            {!gameWon ? (
                <>
                    {/* Header */}
                    <div className="sort-header">
                        <h1 className="sort-title">🎨 Sort & Click</h1>
                        <p className="sort-subtitle">Drag objects into the correct colored buckets!</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="sort-progress-container">
                        <div className="sort-progress-label">Progress: {correctCount}/{objects.length}</div>
                        <div className="sort-progress-bar">
                            <div
                                className="sort-progress-fill"
                                style={{ width: `${(correctCount / objects.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Objects to Sort */}
                    <div className="sort-objects-area">
                        <div className="sort-objects-grid">
                            {objects.map(obj => (
                                <div
                                    key={obj.id}
                                    className={`sort-object ${obj.sorted ? 'sorted' : ''} ${shake === obj.id ? 'shake' : ''}`}
                                    draggable={!obj.sorted}
                                    onDragStart={(e) => handleDragStart(e, obj.id)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        opacity: obj.sorted ? 0.4 : 1,
                                        cursor: obj.sorted ? 'default' : 'grab',
                                    }}
                                    title={`${obj.color.toUpperCase()} ${obj.shape}`}
                                >
                                    <span className="sort-object-emoji">{obj.emoji}</span>
                                    {obj.sorted && <div className="sort-checkmark">✅</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buckets */}
                    <div className="sort-buckets-area">
                        <div className="sort-buckets-grid">
                            {buckets.map(bucket => (
                                <div
                                    key={bucket.id}
                                    className="sort-bucket"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, bucket.id)}
                                    style={{
                                        borderColor: draggedItem ? bucket.color : '#ccc',
                                        boxShadow: draggedItem ? `0 0 20px ${bucket.color}40` : 'none',
                                    }}
                                >
                                    <div className="sort-bucket-label">{bucket.label}</div>
                                    <div className="sort-bucket-content">
                                        {objects.filter(o => o.sorted && o.color === bucket.id).length > 0 && (
                                            <div className="sort-bucket-count">
                                                {objects.filter(o => o.sorted && o.color === bucket.id).length} ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="sort-instructions">
                        <p>💡 Drag each object into its matching color bucket</p>
                    </div>

                    {/* Close button */}
                    <button
                        className="sort-close-btn"
                        onClick={onClose}
                        aria-label="Close game"
                    >
                        ← Back
                    </button>
                </>
            ) : (
                // Victory Screen
                <div className="sort-victory-screen">
                    <div className="sort-victory-content">
                        <h1 className="sort-victory-title">Trophy Time! 🏆</h1>
                        <div className="sort-victory-score">
                            <div className="sort-trophy-large">🏆</div>
                            <p className="sort-score-text">Perfect Sort!</p>
                            <p className="sort-score-details">All {objects.length} items sorted correctly!</p>
                        </div>
                        <div className="sort-celebration-large">
                            <span className="sort-bounce-star">⭐</span>
                            <span className="sort-bounce-star">🎊</span>
                            <span className="sort-bounce-star">⭐</span>
                        </div>
                        <button
                            className="sort-play-again-btn"
                            onClick={handlePlayAgain}
                            aria-label="Play again"
                        >
                            Play Again
                        </button>
                        <button
                            className="sort-close-btn"
                            onClick={onClose}
                            aria-label="Close game"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ADHDSortClick;
