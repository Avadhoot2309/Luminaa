import React, { useState } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import ADHDDashboard from './ADHDDashboard';

/**
 * ADHDDashboardDemo - Dedicated ADHD Dashboard module
 * 
 * This is a standalone ADHD Dashboard interface.
 * When a teacher creates a student with condition='ADHD',
 * they will automatically see this dashboard when they log in.
 * 
 * Access via: http://localhost:5173/adhd-demo
 */

export default function ADHDDashboardDemo() {
    const [mockProfile, setMockProfile] = useState({
        id: 'adhd_student_demo',
        name: 'ADHD Student',
        condition: 'ADHD',
        grade: 6,
        currentStreak: 3,
        tasksCompletedToday: 1
    });

    // Override profile context for demo
    const { setProfile } = useProfile() || {};

    React.useEffect(() => {
        if (setProfile) {
            setProfile(mockProfile);
        }
    }, [mockProfile, setProfile]);


    const mainStyle = {
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'white'
    };

    const labelBadgeStyle = {
        position: 'absolute',
        top: '15px',
        right: '15px',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        color: '#2563EB',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '700',
        border: '1px solid rgba(37, 99, 235, 0.3)'
    };

    const infoPanelStyle = {
        backgroundColor: 'white',
        borderTop: '2px solid #e2e8f0',
        padding: '16px 20px',
        fontSize: '0.9rem',
        color: '#64748B',
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: "'Nunito', sans-serif"
    };

    return (
        <div style={containerStyle}>
            {/* DASHBOARD CONTENT */}
            <div style={mainStyle}>
                <div style={{ position: 'relative' }}>
                    <div style={labelBadgeStyle}>🧠 ADHD Module</div>
                    <ADHDDashboard />
                </div>
            </div>

            {/* INFO PANEL */}
            <div style={infoPanelStyle}>
                <div>
                    <strong>Student ID:</strong> {mockProfile.id}
                </div>
                <div>
                    <strong>Condition:</strong> <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        borderRadius: '4px',
                        fontWeight: '600'
                    }}>ADHD</span>
                </div>
                <div>
                    <strong>Grade:</strong> {mockProfile.grade}
                </div>
                <div>
                    <strong>🔥 Streak:</strong> {mockProfile.currentStreak} days
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <strong>💡 Tip:</strong> This is the ADHD-optimized dashboard
                </div>
            </div>
        </div>
    );
}