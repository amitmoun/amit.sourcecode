'use client';
import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine, ReferenceArea, Label
} from 'recharts';
import styles from './CandidateExperience.module.css';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';

/* ── Constants ───────────────────────────────────────────────────────────── */
const TARGET_HIRES = 5;
const RECRUITER_CAPACITY = 40;
const RECRUITER_WASTE_PER_FAILURE = 3;
const ENGR_WASTE_PER_FAILURE = 4;

const FEEDBACK_OPTIONS = {
    'Automated': { mult: 0.3, ideal: 0.1 },
    'Stage-Gated': { mult: 0.7, ideal: 0.3 },
    'High-Touch': { mult: 1.0, ideal: 0.7 }
};

/* ── Core Math ───────────────────────────────────────────────────────────── */
function calcMetrics(qualityPct, turnaround, feedbackKey) {
    const q = qualityPct / 100;
    const totalVolume = q === 0 ? 0 : TARGET_HIRES / q;
    
    // Edge case if 100%, totalVolume = 5. lateStageFailures = 0
    const lateStageFailures = Math.max(0, totalVolume - TARGET_HIRES);
    
    const engrHoursBurned = lateStageFailures * ENGR_WASTE_PER_FAILURE;
    const recruiterTimeWasted = lateStageFailures * RECRUITER_WASTE_PER_FAILURE;
    
    const availableCXTime = RECRUITER_CAPACITY - recruiterTimeWasted;
    
    const actualTimePerCandidate = availableCXTime < 0 ? 0 : (totalVolume > 0 ? availableCXTime / totalVolume : 0);
    
    let maxCap = 40;
    let k = 2.0;
    if (feedbackKey === 'Stage-Gated') {
        maxCap = 75;
        k = 0.8;
    } else if (feedbackKey === 'High-Touch') {
        maxCap = 100;
        k = 0.4;
    }

    const rawScore = maxCap * (1 - Math.exp(-k * actualTimePerCandidate));
    
    let slaPenaltyFactor = 1.0;
    if (turnaround > 3) {
        slaPenaltyFactor = Math.max(0, 1 - ((turnaround - 3) * 0.15));
    }
    
    const finalCXIndex = Math.round(rawScore * slaPenaltyFactor);
    
    const offerDropoffRisk = Math.min(100, 5 + (Math.max(0, turnaround - 3) * 15));
    
    const burnout = availableCXTime < 0;
    const burnoutDeficit = burnout ? Math.abs(Math.round(availableCXTime)) : 0;
    
    const recTimeReclaimed = qualityPct <= 30 ? 0 : Math.round(((TARGET_HIRES / 0.3) - totalVolume) * RECRUITER_WASTE_PER_FAILURE);
    
    return {
        totalVolume: isFinite(totalVolume) ? Math.round(totalVolume) : 0,
        engrHoursBurned: Math.round(engrHoursBurned),
        finalCXIndex: isNaN(finalCXIndex) ? 0 : Math.max(0, finalCXIndex),
        offerDropoffRisk: Math.max(0, Math.round(offerDropoffRisk)),
        recTimeReclaimed: recTimeReclaimed > 0 ? recTimeReclaimed : 0,
        burnout,
        burnoutDeficit,
    };
}

/* ── Chart Data ──────────────────────────────────────────────────────────── */
function buildChartData(turnaround, feedbackKey) {
    return Array.from({ length: 19 }, (_, i) => {
        const q = (i + 2) * 5;
        const { finalCXIndex } = calcMetrics(q, turnaround, feedbackKey);
        return { quality: q, cxIndex: finalCXIndex };
    });
}

/* ── Custom Tooltip ──────────────────────────────────────────────────────── */
function CXTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className={styles.tooltip}>
            <span className={styles.tooltipLabel}>Quality {label}%</span>
            <span className={styles.tooltipValue}>CX Index: {payload[0].value}</span>
        </div>
    );
}

/* ── Input Components ────────────────────────────────────────────────────── */
function ControlSlider({ label, sublabel, value, onChange, min = 0, max = 100, step = 1, suffix="%" }) {
    return (
        <div className={styles.sliderRow}>
            <div className={styles.sliderMeta}>
                <span className={styles.sliderLabel}>{label}</span>
                <span className={styles.sliderSublabel}>{sublabel}</span>
            </div>
            <div className={styles.sliderTrackWrap} draggable={false}>
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={e => onChange(parseInt(e.target.value))}
                    className={styles.sliderInput}
                    draggable={false}
                />
                <div className={styles.sliderFill} style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
                <div className={styles.sliderThumb} style={{ left: `${((value - min) / (max - min)) * 100}%` }} />
            </div>
            <span className={styles.sliderValue}>{value}{suffix}</span>
        </div>
    );
}

function ControlSelect({ label, sublabel, value, onChange, options }) {
    return (
        <div className={styles.sliderRow}>
            <div className={styles.sliderMeta}>
                <span className={styles.sliderLabel}>{label}</span>
                <span className={styles.sliderSublabel}>{sublabel}</span>
            </div>
            <select 
                value={value} 
                onChange={e => onChange(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.65rem 0.5rem',
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#e2e2e2',
                    fontSize: '0.8rem',
                    fontFamily: 'inherit',
                    marginTop: '0.2rem',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none'
                }}
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
// Custom Animated Accordion mimicking Talent Operating System styles
function NestedAccordion({ number, title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0.4, filter: 'grayscale(100%)' }}
            whileHover={{ opacity: 1, filter: 'grayscale(0%)' }}
            transition={{ duration: 0.3 }}
            style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden' }}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    width: '100%', 
                    padding: '1.2rem 1.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#eaeaea', 
                    fontSize: '1rem', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{
                        background: '#a855f7', 
                        color: '#fff', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold',
                        flexShrink: 0
                    }}>
                        {number}
                    </span>
                    <span>{title}</span>
                </div>
                <motion.span 
                    animate={{ rotate: isOpen ? 180 : 0 }} 
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ color: '#a855f7', fontSize: '0.9rem', flexShrink: 0 }}
                >
                    ▼
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #1a1a1a', marginTop: '0.25rem', paddingTop: '1.25rem' }}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function CandidateExperience() {
    const [quality, setQuality]   = useState(75);
    const [turnaround, setTurnaround] = useState(2);
    const [feedback, setFeedback] = useState('High-Touch');
    const [expanded, setExpanded] = useState(false);
    const [methodologyOpen, setMethodologyOpen] = useState(false);

    const metrics   = calcMetrics(quality, turnaround, feedback);
    const chartData = buildChartData(turnaround, feedback);

    const cxColor =
        metrics.finalCXIndex >= 70 ? '#a855f7'
        : metrics.finalCXIndex >= 40 ? '#7c3aed'
        : '#4b5563';

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

    return (
        <section className={styles.section} id="cx-index">
            <h2 className={styles.heading}>The Candidate Experience Index</h2>
            <p className={styles.subheading}>
                Candidate experience isn't an empathy problem; it's a math problem. See exactly how upstream calibration leakage destroys downstream capacity.
            </p>

            {!expanded ? (
                /* ── Collapsed Preview ─────────────────────────────────── */
                <div className={styles.previewWrapper}>
                    <div className={styles.previewChart} aria-hidden="true">
                        <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={buildChartData(3, 'Stage-Gated')} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                                <Line
                                    type="monotone"
                                    dataKey="cxIndex"
                                    stroke="#7c3aed"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.previewOverlay} />
                    <button className={styles.expandBtn} onClick={() => setExpanded(true)}>
                        Calibrate a Role
                    </button>
                </div>
            ) : (
                /* ── Full View ─────────────────────────────────────────── */
                <motion.div 
                    className={styles.dashboard}
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

                                        <div className={styles.dashboardTop}>
                    {/* Left: Controls */}
                    <div className={styles.controls} style={{ position: 'relative', zIndex: 1 }}>
                        <p className={styles.controlsHeading}>Adjust the variables</p>

                        <ControlSlider
                            label="Pipeline Quality"
                            sublabel="Early-Stage HM Pass Rate"
                            value={quality}
                            onChange={setQuality}
                            min={10}
                            max={100}
                        />
                        <ControlSlider
                            label="Hiring Manager"
                            sublabel="Turnaround (Days)"
                            value={turnaround}
                            onChange={setTurnaround}
                            min={1}
                            max={10}
                            step={1}
                            suffix="d"
                        />

                        <div className={styles.segmentedControl}>
                            <p className={styles.sliderLabel} style={{ marginBottom: '0.5rem' }}>
                                Personalized Feedback <span className={styles.sliderSublabel} style={{textTransform:'none', letterSpacing:'normal', marginLeft:'0.5rem', whiteSpace:'nowrap'}}>Who gets a custom rejection?</span>
                            </p>
                            <div className={styles.segmentedButtons} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {[
                                    { value: 'Automated', title: 'None', desc: 'Automated templates only' },
                                    { value: 'Stage-Gated', title: 'Business Interviewed Candidates', desc: 'Custom feedback' },
                                    { value: 'High-Touch', title: 'All Candidates', desc: '100% custom feedback' }
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setFeedback(opt.value)}
                                        style={{
                                            flex: 1,
                                            padding: '0.6rem 0.5rem',
                                            paddingLeft: '0.75rem',
                                            background: feedback === opt.value ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                                            color: feedback === opt.value ? '#fff' : '#a3a3a3',
                                            border: feedback === opt.value ? '1px solid #a855f7' : '1px solid #333',
                                            borderRadius: '8px',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <strong style={{ display: 'block', marginBottom: '0.2rem', color: feedback === opt.value ? '#fff' : '#eaeaea', fontSize: '0.9rem' }}>{opt.title}</strong>
                                        <span style={{ fontSize: '0.8rem', opacity: feedback === opt.value ? 1 : 0.7 }}>
                                            {opt.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {metrics.burnout && (
                            <p className={styles.burnoutWarning} style={{ marginTop: '1rem' }}>
                                System Breaking: Recruiter Deficit of {metrics.burnoutDeficit} hours.
                            </p>
                        )}
                    </div>

                    {/* Right: Chart */}
                    <div className={styles.chartPanel} style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0 }}>
                        <p className={styles.chartTitle}>CX Index across quality spectrum</p>
                        <ResponsiveContainer width="100%" height={380}>
                            <LineChart data={chartData} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                                <CartesianGrid stroke="#1e1e1e" strokeDasharray="4 4" />
                                <XAxis
                                    dataKey="quality"
                                    tickFormatter={v => `${v}%`}
                                    tick={{ fill: '#888', fontSize: 11 }}
                                    axisLine={{ stroke: '#2a2a2a' }}
                                    tickLine={false}
                                >
                                    <Label value="Pipeline Quality (Screen-to-HM Yield)" offset={-10} position="insideBottom" fill="#666" fontSize={11} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                                </XAxis>
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fill: '#888', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                >
                                    <Label value="CX INDEX SCORE" angle={-90} position="insideLeft" fill="#666" fontSize={11} style={{ textAnchor: 'middle', letterSpacing: '0.05em' }} />
                                </YAxis>
                                <Tooltip content={<CXTooltip />} />
                                <ReferenceArea x1={10} x2={25} fill="#ef4444" fillOpacity={0.15}>
                                    <Label value="BURNOUT ZONE (0% CX)" position="insideTopLeft" offset={10} fill="#ef4444" fillOpacity={0.7} style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }} />
                                </ReferenceArea>
                                <ReferenceLine x={quality} stroke="#444" strokeDasharray="3 3" />
                                <ReferenceDot x={quality} y={metrics.finalCXIndex} r={5} fill="#a855f7" stroke="#fff" strokeWidth={2} isFront={true} />
                                <Line
                                    type="monotone"
                                    dataKey="cxIndex"
                                    stroke="#a855f7"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#7c3aed', strokeWidth: 0, r: 3 }}
                                    activeDot={{ fill: '#c084fc', r: 5, strokeWidth: 0 }}
                                    animationDuration={400}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    </div>

                    {/* Bottom: 4x1 Metrics Bar */}
                    <div className={styles.metricsRow}>
                        <div className={styles.readout}>
                            <span className={styles.readoutValue} style={{ color: cxColor }}>
                                {metrics.finalCXIndex}
                            </span>
                            <span className={styles.readoutLabel}>CX Index</span>
                        </div>
                        <div className={styles.readout}>
                            <span className={styles.readoutValue}>
                                {metrics.totalVolume}
                            </span>
                            <span className={styles.readoutLabel}>Pipeline Vol.</span>
                        </div>
                        <div className={styles.readout}>
                            <span className={styles.readoutValue} style={{ color: '#ef4444' }}>
                                {metrics.engrHoursBurned}h
                            </span>
                            <span className={styles.readoutLabel}>Eng. Hours Burned</span>
                        </div>
                        <div className={styles.readout}>
                            <span className={styles.readoutValue} style={{ color: '#10b981' }}>
                                {metrics.recTimeReclaimed}h
                            </span>
                            <span className={styles.readoutLabel}>Recruiting Time Reclaimed</span>
                        </div>
                    </div>
                </motion.div>
            )}
        
            {expanded && (
                <motion.div 
                    initial={false}
                    animate={{ opacity: methodologyOpen ? 1 : 0.3, filter: methodologyOpen ? 'grayscale(0%)' : 'grayscale(100%)' }}
                    whileHover={!methodologyOpen ? { opacity: 1, filter: 'grayscale(0%)' } : {}}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{
                        maxWidth: '1000px',
                        margin: '1.5rem auto 0',
                        background: '#0a0a0a',
                        border: '1px solid #1a1a1a',
                        borderRadius: '16px',
                    }}
                >
                    <div 
                        onClick={() => setMethodologyOpen(!methodologyOpen)}
                        style={{ fontSize: '1.05rem', fontWeight: 400, color: '#eaeaea', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Methodology: The Math Behind the Model
                        </div>
                        <motion.span 
                            animate={{ rotate: methodologyOpen ? 180 : 0 }} 
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            style={{ color: '#a855f7', fontSize: '0.9rem' }}
                        >
                            ▼
                        </motion.span>
                    </div>
                    
                    <AnimatePresence initial={false}>
                        {methodologyOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ padding: '0 2rem 1.5rem 2rem', borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }}>
                    
                    <NestedAccordion number="1" title="The Engineering Tax (Why Pipeline Quality dictates capacity)">
                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Core Insight</p>
                        <p style={{ marginBottom: '1.2rem', color: '#a3a3a3', lineHeight: 1.6, fontSize: '0.9rem' }}>Every candidate who fails a late-stage onsite loop doesn't just hurt recruiter capacity; they burn expensive engineering roadmap time.</p>
                        
                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Assumption</p>
                        <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem', color: '#a3a3a3', listStyleType: 'circle', lineHeight: 1.6, fontSize: '0.9rem' }}>
                            <li style={{ marginBottom: '0.4rem' }}><strong style={{color:'#eaeaea'}}>Engineering time per late-stage failure:</strong> 4 hours (Interviewing + Debriefs)</li>
                            <li><strong style={{color:'#eaeaea'}}>Recruiter time per late-stage failure:</strong> 3 hours (Scheduling + Alignment + Rejection)</li>
                        </ul>
                        
                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Math</p>
                        <p style={{ marginBottom: '0.8rem', color: '#a3a3a3', lineHeight: 1.6, fontSize: '0.9rem' }}>When Top-of-Funnel Quality drops, late-stage volume spikes. The simulation calculates this direct pipeline waste and subtracts it from your team's available working hours.</p>
                        <div style={{ background: '#111', border: '1px solid #333', padding: '0.75rem 1rem', borderRadius: '6px', fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace', color: '#c084fc', fontSize: '0.85rem' }}>
                            Pipeline Waste = Failed Candidates × 7 hours
                        </div>
                    </NestedAccordion>

                    <NestedAccordion number="2" title="The Offer Drop-Off Risk (Why 3-Day SLAs matter)">
                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Core Insight</p>
                        <p style={{ marginBottom: '1.2rem', color: '#a3a3a3', lineHeight: 1.6, fontSize: '0.9rem' }}>Candidate Experience is a lagging indicator; Offer Acceptance Rate (OAR) is the business impact. Elite engineering and product talent do not wait in limbo.</p>

                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Assumption</p>
                        <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem', color: '#a3a3a3', listStyleType: 'circle', lineHeight: 1.6, fontSize: '0.9rem' }}>
                            <li style={{ marginBottom: '0.4rem' }}><strong style={{color:'#eaeaea'}}>Baseline market risk</strong> of offer rejection: 5%</li>
                            <li>However, as your <strong style={{color:'#eaeaea'}}>SLA Adherence</strong> (moving candidates within 3 business days) drops, candidate trust decays rapidly, driving them to competitor offers.</li>
                        </ul>

                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Math</p>
                        <p style={{ marginBottom: '0.8rem', color: '#a3a3a3', lineHeight: 1.6, fontSize: '0.9rem' }}>Drop-Off Risk is calculated as a decay curve:</p>
                        <div style={{ background: '#111', border: '1px solid #333', padding: '0.75rem 1rem', borderRadius: '6px', fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace', marginBottom: '0.8rem', color: '#c084fc', fontSize: '0.85rem' }}>
                            Drop-Off Risk = 85 - (SLA Adherence × 80)
                        </div>
                        <p style={{ color: '#a3a3a3', fontSize: '0.9rem' }}><strong>Example:</strong> If your SLA adherence drops to 50%, your drop-off risk mathematically hits <strong style={{color:'#eaeaea'}}>45%</strong>.</p>
                    </NestedAccordion>

                    <NestedAccordion number="3" title="The Empathy Bottleneck (Why you can't just care more)">
                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Core Insight</p>
                        <p style={{ marginBottom: '1.2rem', color: '#a3a3a3', lineHeight: 1.6, fontSize: '0.9rem' }}>You cannot automate a 5-star Candidate Experience. Meaningful feedback takes human minutes.</p>

                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Assumption</p>
                        <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem', color: '#a3a3a3', listStyleType: 'circle', lineHeight: 1.6, fontSize: '0.9rem' }}>
                            <li style={{ marginBottom: '0.4rem' }}><strong style={{color:'#eaeaea'}}>Recruiter capacity:</strong> Fixed (e.g., 40 hours/week)</li>
                            <li><strong style={{color:'#eaeaea'}}>Time for high-touch feedback:</strong> 0.7 hours per candidate</li>
                        </ul>

                        <p style={{ marginBottom: '0.5rem', color: '#a855f7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>The Math</p>
                        <div style={{ background: '#111', border: '1px solid #333', padding: '0.75rem 1rem', borderRadius: '6px', fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace', marginBottom: '0.8rem', color: '#c084fc', fontSize: '0.85rem' }}>
                            Actual Time Per Candidate = Available Time ÷ Total Pipeline Volume
                        </div>
                        <p style={{ color: '#a3a3a3', lineHeight: 1.6, fontSize: '0.9rem' }}><strong>Example:</strong> If low upstream quality floods the funnel with 100 candidates for 1 role, the math dictates that the recruiter simply does not have the physical minutes required to deliver high-touch feedback, causing the CX Index to crash.</p>
                    </NestedAccordion>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </section>
    );
}
