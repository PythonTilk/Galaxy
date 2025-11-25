import { Html } from '@react-three/drei';
import type { PlanetData } from '../services/api';

interface PlanetTooltipProps {
    data: PlanetData | null;
    position: [number, number, number];
}

export const PlanetTooltip = ({ data, position }: PlanetTooltipProps) => {
    if (!data) return null;

    return (
        <Html
            position={position}
            distanceFactor={10}
            style={{
                pointerEvents: 'none',
                userSelect: 'none',
            }}
        >
            <div style={{
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                minWidth: '200px',
                color: 'white',
                fontSize: '13px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                transform: 'translateX(-50%) translateY(-120%)',
                position: 'relative',
            }}>
                {/* Connecting line */}
                <div style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    width: '2px',
                    height: '20px',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
                    transform: 'translateX(-50%)',
                }} />

                <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#fff',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '6px',
                }}>
                    {data.englishName}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <InfoRow label="Radius" value={`${data.meanRadius.toLocaleString()} km`} />
                    <InfoRow label="Gravity" value={`${data.gravity} m/s²`} />
                    <InfoRow label="Temp" value={`${data.avgTemp} K`} />
                    {data.moons && data.moons.length > 0 && (
                        <InfoRow label="Moons" value={data.moons.length.toString()} />
                    )}
                </div>
            </div>
        </Html>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <span style={{ color: '#aaa', fontSize: '12px' }}>{label}:</span>
        <span style={{ color: '#fff', fontWeight: '500' }}>{value}</span>
    </div>
);
