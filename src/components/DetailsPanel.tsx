import React from 'react';
import type { PlanetData } from '../services/api';
import type { GalacticLocationData } from '../data/galaxyLocations';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailsPanelProps {
    data: PlanetData | GalacticLocationData | null;
    onClose: () => void;
    loading: boolean;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ data, onClose, loading }) => {
    // Type guard to check if data is PlanetData
    const isPlanetData = (d: any): d is PlanetData => {
        return d && 'gravity' in d;
    };

    return (
        <AnimatePresence>
            {(data || loading) && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 20 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '350px',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '40px',
                        color: 'white',
                        zIndex: 20,
                        overflowY: 'auto'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>

                    {loading ? (
                        <div style={{ marginTop: '50px', textAlign: 'center' }}>Loading data...</div>
                    ) : data ? (
                        <>
                            {isPlanetData(data) && data.imageUrl && (
                                <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={data.imageUrl} alt={data.englishName} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                            )}

                            <h1 style={{ fontSize: '3rem', marginBottom: '10px', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {isPlanetData(data) ? data.englishName : data.name}
                            </h1>

                            <div style={{ display: 'grid', gap: '20px', marginTop: '40px' }}>
                                {isPlanetData(data) ? (
                                    <>
                                        <InfoItem label="Gravity" value={`${data.gravity} m/s²`} />
                                        <InfoItem label="Avg. Temperature" value={`${data.avgTemp} K`} />
                                        <InfoItem label="Mean Radius" value={`${data.meanRadius} km`} />
                                        <InfoItem label="Density" value={`${data.density} g/cm³`} />
                                        <InfoItem label="Orbital Period" value={`${data.sideralOrbit} days`} />
                                        <InfoItem label="Rotation Period" value={`${data.sideralRotation} hours`} />

                                        {data.mass && (
                                            <InfoItem
                                                label="Mass"
                                                value={`${data.mass.massValue} × 10^${data.mass.massExponent} kg`}
                                            />
                                        )}

                                        {data.moons && (
                                            <div style={{ marginTop: '20px' }}>
                                                <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>MOONS ({data.moons.length})</h3>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                                    {data.moons.slice(0, 10).map(moon => (
                                                        <span key={moon.moon} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>
                                                            {moon.moon}
                                                        </span>
                                                    ))}
                                                    {data.moons.length > 10 && <span style={{ color: '#888', fontSize: '0.8rem' }}>+{data.moons.length - 10} more</span>}
                                                </div>
                                            </div>
                                        )}

                                        {data.referenceLinks && (
                                            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                                                <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>LEARN MORE</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    {data.referenceLinks.map(link => (
                                                        <a
                                                            key={link.url}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ color: '#4da6ff', textDecoration: 'none', fontSize: '0.9rem' }}
                                                        >
                                                            {link.label} ↗
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div style={{
                                            padding: '4px 8px',
                                            background: (data as GalacticLocationData).color,
                                            color: 'black',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem',
                                            marginBottom: '10px'
                                        }}>
                                            {(data as GalacticLocationData).type.toUpperCase()}
                                        </div>

                                        <p style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#ddd' }}>
                                            {(data as GalacticLocationData).description}
                                        </p>

                                        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                                            <InfoItem label="Coordinates" value={`X: ${(data as GalacticLocationData).position[0]}, Y: ${(data as GalacticLocationData).position[1]}, Z: ${(data as GalacticLocationData).position[2]}`} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : null}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '5px' }}>{label.toUpperCase()}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</div>
    </div>
);
