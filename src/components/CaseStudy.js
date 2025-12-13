"use client";
import React from 'react';
import { projects } from '@/lib/data';
import styles from './CaseStudy.module.css';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

// Premium Glass Card with 16:9 Ratio
function ImpactCard({ project }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ clientX, clientY, currentTarget }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div className={styles.cardWrapper}>
            <motion.div
                className={styles.impactCard}
                onMouseMove={handleMouseMove}
                style={{ position: 'relative', overflow: 'hidden' }}
                whileHover={{ scale: 1.02 }}
            >
                {/* Subtle White Spotlight Overlay */}
                <motion.div
                    className="spotlight-overlay"
                    style={{
                        pointerEvents: 'none',
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        background: useMotionTemplate`
                            radial-gradient(
                                600px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.08),
                                transparent 80%
                            )
                        `
                    }}
                />

                <div className={styles.cardContent}>
                    {/* Header Group */}
                    <div className={styles.cardHeader}>
                        {/* Subtitle as "Business Result" tag */}
                        <span className={styles.impactTag}>{project.subtitle}</span>
                        <h3 className={styles.cardTitle}>{project.title}</h3>
                    </div>

                    {/* Story Body */}
                    <div className={styles.cardStory}>
                        <div className={styles.storyRow}>
                            <span className={styles.label}>Challenge:</span>
                            <p>{project.content.problem}</p>
                        </div>
                        <div className={styles.storyRow}>
                            <span className={styles.label}>Strategy:</span>
                            <p>{project.content.solution}</p>
                        </div>
                    </div>

                    {/* Footer Impact */}
                    <div className={styles.cardFooter}>
                        <div className={styles.impactMetric}>
                            {project.content.impact}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function ImpactArchitecture() {
    // Double the list for infinite seamless scrolling
    const carouselItems = React.useMemo(() => [...projects, ...projects, ...projects], []);
    const scrollRef = React.useRef(null);
    const [isPaused, setIsPaused] = React.useState(false);

    React.useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId;
        const scrollSpeed = 1; // Increased speed for visibility

        const scroll = () => {
            // Pause auto-scroll if user is hovering
            if (!isPaused) {
                // Move scroll position
                scrollContainer.scrollLeft += scrollSpeed;

                // Infinite seamless loop logic
                // We have 3 sets of items. When we scroll past the first set (1/3 of width), 
                // we instantly snap back to 0. Because set 2 starts exactly where set 1 started visually,
                // this snap is invisible to the user.
                const oneSetWidth = scrollContainer.scrollWidth / 3;

                if (scrollContainer.scrollLeft >= oneSetWidth) {
                    scrollContainer.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        // Start loop
        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused]);

    return (
        <section className={styles.section}>
            <div className={styles.headerContainer}>
                <h2 className={styles.heading}>Impact Architecture</h2>
                <p className={styles.subheading}>Designing systems that scale human potential.</p>
            </div>

            {/* Scroll Window with Native Control + Auto Drift */}
            <div
                className={styles.scrollWindow}
                ref={scrollRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                <div className={styles.scrollTrack}>
                    {carouselItems.map((project, index) => (
                        <ImpactCard
                            key={`${index}`}
                            project={project}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
