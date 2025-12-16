import React, { useState } from 'react';
import styles from './WaysOfWorking.module.css';
import { equalizerData } from '@/lib/data';
import SpotlightCard from './SpotlightCard';

export default function WaysOfWorking() {
    // Initialize state from data. Using index as key for simplicity since data is static.
    const [sliderValues, setSliderValues] = useState(
        equalizerData.map(item => item.value)
    );

    const handleSliderChange = (index, newValue) => {
        const newValues = [...sliderValues];
        newValues[index] = newValue;
        setSliderValues(newValues);
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>The Calibration Equalizer</h2>
            <p className={styles.subheading}>
                Every role requires a different configuration. I help managers tune the dials before we launch.
            </p>

            <SpotlightCard className={styles.dashboardContainer}>
                <div className={styles.dashboardContent}>
                    {equalizerData.map((item, index) => (
                        <div key={index} className={styles.sliderContainer}>
                            <div className={styles.sliderHeader}>
                                <span className={styles.label}>{item.label}</span>
                            </div>

                            <div className={styles.trackWrapper}>
                                <span className={styles.trackLabelLeft}>{item.left}</span>

                                <div className={styles.track}>
                                    {/* Invisible Range Input for Interaction */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={sliderValues[index]}
                                        onChange={(e) => handleSliderChange(index, parseInt(e.target.value))}
                                        className={styles.rangeInput}
                                    />

                                    {/* Visual Track Elements */}
                                    <div
                                        className={styles.thumb}
                                        style={{ left: `${sliderValues[index]}%` }}
                                    />
                                    <div
                                        className={styles.fill}
                                        style={{ width: `${sliderValues[index]}%` }}
                                    />
                                </div>

                                <span className={styles.trackLabelRight}>{item.right}</span>
                            </div>

                            <p className={styles.caption}>"{item.caption}"</p>
                        </div>
                    ))}
                </div>
            </SpotlightCard>
        </section>
    );
}
