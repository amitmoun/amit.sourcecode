
import React from 'react';
import { motion } from 'framer-motion';

export default function SemanticAvatar({ isThinking }) {
    const outerText = "JAVA BOOLEAN RETENTION ROI SCALE PYTHON SYSTEM_DESIGN ";
    const innerText = "AMIT_MOUN TALENT ARCHITECT HIRING METRICS ";

    return (
        <div style={{ position: 'relative', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Core Waveform Pulse */}
            <div style={{ position: 'absolute', display: 'flex', gap: '2px', alignItems: 'center', height: '24px' }}>
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            height: isThinking ? ['20%', '100%', '20%'] : ['30%', '30%', '30%'],
                            backgroundColor: isThinking ? ['#4ade80', '#86efac', '#4ade80'] : '#4ade80'
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1,
                            times: [0, 0.5, 1] // Peak in middle
                        }}
                        style={{
                            width: '4px',
                            background: '#4ade80',
                            borderRadius: '2px',
                            opacity: 0.8
                        }}
                    />
                ))}
            </div>

            {/* Outer Ring Text */}
            <motion.svg
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                style={{ position: 'absolute', zIndex: 1 }}
                animate={{ rotate: 360 }}
                transition={{ duration: isThinking ? 4 : 20, repeat: Infinity, ease: "linear" }}
            >
                <defs>
                    <path id="circlePathOuter" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text fontSize="8" fill="#4ade80" style={{ opacity: 0.8, fontFamily: 'monospace' }}>
                    <textPath href="#circlePathOuter">
                        {outerText.repeat(2)}
                    </textPath>
                </text>
            </motion.svg>

            {/* Inner Ring Text */}
            <motion.svg
                viewBox="0 0 100 100"
                width="70%"
                height="70%"
                style={{ position: 'absolute', zIndex: 2 }}
                animate={{ rotate: -360 }}
                transition={{ duration: isThinking ? 3 : 15, repeat: Infinity, ease: "linear" }}
            >
                <defs>
                    <path id="circlePathInner" d="M 50, 50 m -30, 0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" />
                </defs>
                <text fontSize="9" fill="#4ade80" style={{ opacity: 0.9, fontFamily: 'monospace' }} fontWeight="bold">
                    <textPath href="#circlePathInner">
                        {innerText.repeat(2)}
                    </textPath>
                </text>
            </motion.svg>

        </div>
    );
}
