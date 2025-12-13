'use client';
import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export default function SpotlightCard({ children, className = "", spotlightColor = "rgba(255,255,255,0.1)" }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ clientX, clientY, currentTarget }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            className={`spotlight-card ${className}`}
            onMouseMove={handleMouseMove}
            initial="idle"
            whileHover="focused"
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#0a0a0a',
                border: '1px solid #222',
                borderRadius: '12px'
            }}
        >
            <motion.div
                className="spotlight-overlay"
                style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            ${spotlightColor},
                            transparent 80%
                        )
                    `
                }}
                variants={{
                    idle: { opacity: 0 },
                    focused: { opacity: 1 }
                }}
                transition={{ duration: 0.3 }}
            />
            <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
                {children}
            </div>
        </motion.div>
    );
}
