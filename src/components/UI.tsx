import React from 'react';

interface UIProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

export const UI: React.FC<UIProps> = ({ currentView, onViewChange }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: '20px',
            background: 'rgba(0,0,0,0.5)',
            padding: '10px 20px',
            borderRadius: '20px',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <button
                onClick={() => onViewChange('Solar System')}
                style={{
                    background: currentView === 'Solar System' ? 'white' : 'transparent',
                    color: currentView === 'Solar System' ? 'black' : 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                }}
            >
                Solar System
            </button>
            <button
                onClick={() => onViewChange('Galaxy')}
                style={{
                    background: currentView === 'Galaxy' ? 'white' : 'transparent',
                    color: currentView === 'Galaxy' ? 'black' : 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                }}
            >
                Galaxy
            </button>
        </div>
    );
};
