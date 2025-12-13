'use client';
import React from 'react';
import styles from './SourcingSuperpowers.module.css';
import { superpowers } from '@/lib/data';
import { TrendingUp, Cpu, Radar, Database, Users } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const iconMap = {
    "TrendingUp": <TrendingUp size={48} strokeWidth={1.5} />,
    "Cpu": <Cpu size={48} strokeWidth={1.5} />,
    "Radar": <Radar size={48} strokeWidth={1.5} />,
    "Database": <Database size={48} strokeWidth={1.5} />,
    "Users": <Users size={48} strokeWidth={1.5} />
};

function SuperpowerCard({ power }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ clientX, clientY, currentTarget }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div className={styles.cardContainer} onMouseMove={handleMouseMove}>
            <div className={styles.cardInner}>

                <div className={styles.cardFront}>
                    {/* Spotlight Overlay */}
                    <motion.div
                        className="spotlight-overlay"
                        style={{
                            pointerEvents: 'none',
                            position: 'absolute',
                            inset: 0,
                            zIndex: 0,
                            borderRadius: '16px', // Match card radius
                            background: useMotionTemplate`
                                radial-gradient(
                                    400px circle at ${mouseX}px ${mouseY}px,
                                    rgba(255, 255, 255, 0.12),
                                    transparent 80%
                                )
                            `
                        }}
                    />

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className={styles.icon}>{iconMap[power.iconName]}</div>
                        <h3 className={styles.cardTitle}>{power.title}</h3>
                        <div className={styles.tapHint}>Hover to Flip</div>
                    </div>
                </div>

                <div className={styles.cardBack}>
                    <p className={styles.cardDescription}>{power.description}</p>
                    <div className={styles.tags}>
                        {power.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function SourcingSuperpowers() {
    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Talent Operating System</h2>
                <div className={styles.grid}>
                    {superpowers.map((power, index) => (
                        <SuperpowerCard key={index} power={power} />
                    ))}
                </div>
            </div>
        </section>
    );
}
