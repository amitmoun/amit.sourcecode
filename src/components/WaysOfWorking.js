'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './WaysOfWorking.module.css';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { equalizerData } from '@/lib/data';

function computeSignalStrength(values, isActive, hasInteracted) {
    const confirmed = values
        .map((v, i) => ({ v, active: isActive[i], touched: hasInteracted[i] }))
        .filter(x => x.active && x.touched);
    if (confirmed.length === 0) return 0;
    const avgDecisiveness =
        confirmed.reduce((sum, x) => sum + Math.abs(x.v - 50), 0) /
        (confirmed.length * 50) * 100;
    if (avgDecisiveness > 85) {
        return 85 + Math.log1p((avgDecisiveness - 85) * 5) / Math.log1p(75) * 10;
    }
    return avgDecisiveness;
}

function buildArchetypeOutput(values, isActive, hasInteracted, axes) {
    const confirmed = axes
        .map((ax, i) => ({
            ax, v: values[i],
            active: isActive[i], touched: hasInteracted[i],
            decisiveness: Math.abs(values[i] - 50),
        }))
        .filter(x => x.active && x.touched)
        .sort((a, b) => b.decisiveness - a.decisiveness);
    if (confirmed.length === 0) return null;
    const top = confirmed.slice(0, 3).map(x => ({
        label: x.v < 45 ? x.ax.left : x.v > 55 ? x.ax.right : `Balanced on ${x.ax.label}`,
    }));
    const traits = confirmed.map(x => {
        if (x.v < 35) return x.ax.left;
        if (x.v > 65) return x.ax.right;
        return `balanced on ${x.ax.label}`;
    });
    const headline = top.map(t => t.label).join(' · ');
    const summary = `This role requires someone who ${traits.slice(0, 2).join(', ')}${traits.length > 2 ? `, and is ${traits[2]}` : ''}.`;
    return { headline, summary };
}

function encodeState(values, isActive, hasInteracted) {
    const params = new URLSearchParams();
    params.set('eq', values.join(','));
    params.set('active', isActive.map(v => v ? '1' : '0').join(','));
    params.set('done', hasInteracted.map(v => v ? '1' : '0').join(','));
    return params.toString();
}

function decodeState(search, count) {
    const params = new URLSearchParams(search);
    const eqRaw = params.get('eq');
    const activeRaw = params.get('active');
    const doneRaw = params.get('done');
    if (!eqRaw) return null;
    const values = eqRaw.split(',').map(Number).slice(0, count);
    const isActive = activeRaw ? activeRaw.split(',').map(v => v === '1') : Array(count).fill(true);
    const hasInteracted = doneRaw ? doneRaw.split(',').map(v => v === '1') : Array(count).fill(false);
    if (values.length !== count) return null;
    return { values, isActive, hasInteracted };
}

export default function WaysOfWorking() {
    const count = equalizerData.length;
    const defaults = equalizerData.map(ax => ax.defaultValue);

    const [values, setValues] = useState(defaults);
    const [isActive, setIsActive] = useState(Array(count).fill(false));
    const [hasInteracted, setHasInteracted] = useState(Array(count).fill(false));
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);
    
    // Hover spotlight effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    function handleMouseMove({ clientX, clientY, currentTarget }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    const spotlightBackground = useMotionTemplate`
        radial-gradient(
            800px circle at ${mouseX}px ${mouseY}px,
            rgba(168, 85, 247, 0.05),
            transparent 80%
        )
    `;

const archetypeKey = useRef(0);
    const prevHeadline = useRef('');

    useEffect(() => {
        const decoded = decodeState(window.location.search, count);
        if (decoded) {
            setValues(decoded.values);
            setIsActive(decoded.isActive);
            setHasInteracted(decoded.hasInteracted);
            setExpanded(true);
        }
    }, [count]);

    const signalStrength = computeSignalStrength(values, isActive, hasInteracted);
    const archetype = buildArchetypeOutput(values, isActive, hasInteracted, equalizerData);

    if (archetype && archetype.headline !== prevHeadline.current) {
        prevHeadline.current = archetype.headline;
        archetypeKey.current += 1;
    }
    if (!archetype) prevHeadline.current = '';

    const handleSliderChange = useCallback((index, newValue) => {
        setValues(prev => { const n = [...prev]; n[index] = newValue; return n; });
        setHasInteracted(prev => { const n = [...prev]; n[index] = true; return n; });
    }, []);

    const handleToggle = useCallback((index) => {
        setIsActive(prev => { const n = [...prev]; n[index] = !n[index]; return n; });
    }, []);

    const handleCopyUrl = useCallback(() => {
        const qs = encodeState(values, isActive, hasInteracted);
        const url = `${window.location.origin}${window.location.pathname}?${qs}#calibration`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [values, isActive, hasInteracted]);

    const confirmedCount = isActive.filter((a, i) => a && hasInteracted[i]).length;
    const activeCount = isActive.filter(Boolean).length;
    const MIN_CONFIRMED = 3; // minimum axes to surface a role profile
    const profileReady = confirmedCount >= MIN_CONFIRMED;

    const profileNudge =
        confirmedCount === 0 ? 'Move a slider to start calibrating.'
        : confirmedCount === 1 ? 'One axis set. A role needs more than one dimension — keep going.'
        : `${MIN_CONFIRMED - confirmedCount} more ${MIN_CONFIRMED - confirmedCount === 1 ? 'axis' : 'axes'} to surface a role profile.`;
    const barWidth = Math.min(signalStrength, 100);

    const signalLabelClean =
        signalStrength === 0 ? 'Move a slider to begin calibrating'
        : signalStrength < 40 ? 'Weak signal. Brief too ambiguous to source against.'
        : signalStrength < 70 ? 'Moderate signal. Calibration taking shape.'
        : signalStrength < 88 ? 'Strong signal. Ready to source against.'
        : 'High precision. Over-specification risk: consider relaxing one axis.';

    return (
        <section className={styles.section} id="calibration">
            <h2 className={styles.heading}>The Calibration Equalizer</h2>
            <p className={styles.subheading}>
                Set the dials for any open role. See the brief come into focus.
            </p>

            {!expanded ? (
                <div className={styles.previewWrapper}>
                    <div className={styles.previewContent} aria-hidden="true">
                        {equalizerData.slice(0, 3).map((item, index) => (
                            <div key={item.id} className={styles.previewRow}>
                                <span className={styles.previewLabel}>{item.left}</span>
                                <div className={styles.previewTrack}>
                                    <div className={styles.previewFill} style={{ width: `${defaults[index]}%` }} />
                                    <div className={styles.previewThumb} style={{ left: `${defaults[index]}%` }} />
                                </div>
                                <span className={styles.previewLabel}>{item.right}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.previewOverlay} />
                    <button className={styles.expandBtn} onClick={() => setExpanded(true)}>
                        Calibrate a Role
                    </button>
                </div>
            ) : (
                <>
                    <motion.div 
                        className={styles.dashboardContainer}
                        onMouseMove={handleMouseMove}
                        style={{ position: 'relative', overflow: 'hidden' }}
                    >
                        {/* Subtle Spotlight Overlay */}
                        <motion.div
                            className="spotlight-overlay"
                            style={{
                                pointerEvents: 'none',
                                position: 'absolute',
                                inset: 0,
                                zIndex: 0,
                                background: spotlightBackground
                            }}
                        />
                        <div className={styles.dashboardContent}>
                            {equalizerData.map((item, index) => {
                                const active = isActive[index];
                                const touched = hasInteracted[index];
                                const val = values[index];
                                return (
                                    <div key={item.id} className={`${styles.sliderContainer} ${active ? styles.sliderActive : styles.sliderDim}`}>
                                        <div className={styles.sliderHeader}>
                                            <button
                                                className={`${styles.toggle} ${active ? styles.toggleOn : ''}`}
                                                onClick={() => handleToggle(index)}
                                                aria-label={`${active ? 'Deactivate' : 'Activate'} ${item.label}`}
                                            >
                                                <span className={styles.toggleDot} />
                                            </button>
                                            <span className={`${styles.label} ${touched ? styles.labelTouched : ''}`}>
                                                {item.label}
                                                {active && touched && <span className={styles.confirmedDot} />}
                                            </span>
                                        </div>
                                        <div className={styles.trackWrapper}>
                                            <span className={styles.trackLabelLeft}>{item.left}</span>
                                            <div className={styles.track}>
                                                <input
                                                    type="range" min="0" max="100" value={val}
                                                    
                                                    onChange={(e) => handleSliderChange(index, parseInt(e.target.value))}
                                                    className={styles.rangeInput}
                                                    aria-label={item.label}
                                                />
                                                <div className={`${styles.fill} ${touched ? styles.fillTouched : ''}`} style={{ width: `${val}%` }} />
                                                <div className={`${styles.thumb} ${touched ? styles.thumbTouched : ''} ${!active ? 'pulse-glow-force' : ''}`} style={{ left: `${val}%` }} />
                                            </div>
                                            <span className={styles.trackLabelRight}>{item.right}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <div className={styles.resultsRow}>
                        {profileReady && archetype ? (
                            <div key={archetypeKey.current} className={styles.archetypePanel}>
                                <span className={styles.archetypeEyebrow}>Role Profile</span>
                                <p className={styles.archetypeHeadline}>{archetype.headline}</p>
                                <p className={styles.archetypeSummary}>{archetype.summary}</p>
                            </div>
                        ) : (
                            <div className={styles.nudgePanel}>
                                <span className={styles.nudgeEyebrow}>Role Profile</span>
                                <p className={styles.nudgeText}>{profileNudge}</p>
                                <div className={styles.nudgeDots}>
                                    {Array.from({ length: MIN_CONFIRMED }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`${styles.nudgeDot} ${i < confirmedCount ? styles.nudgeDotFilled : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className={styles.signalWrapper}>
                            <div className={styles.signalHeader}>
                                <span className={styles.signalLabel}>Brief Clarity</span>
                                <span className={styles.signalPct}>{Math.round(signalStrength)}%</span>
                            </div>
                            <div className={styles.signalTrack}>
                                <div className={styles.signalBar} style={{ width: `${barWidth}%` }} />
                            </div>
                            <p className={styles.signalHint}>{signalLabelClean}</p>
                            <p className={styles.signalMeta}>
                                {confirmedCount} of {activeCount} active {activeCount === 1 ? 'axis' : 'axes'} confirmed
                            </p>
                        </div>
                    </div>

                    <div className={styles.copyRow}>
                        <button
                            className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`}
                            onClick={handleCopyUrl}
                            disabled={confirmedCount === 0}
                        >
                            {copied ? 'Link Copied' : 'Copy Brief Link'}
                        </button>
                        <span className={styles.copyHint}>Share this configuration with your hiring team</span>
                    </div>
                </>
            )}
        </section>
    );
}
