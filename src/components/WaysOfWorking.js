import React from 'react';
import styles from './WaysOfWorking.module.css';
import { equalizerData } from '@/lib/data';
import SpotlightCard from './SpotlightCard';

export default function WaysOfWorking() {
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
                                    <div
                                        className={styles.thumb}
                                        style={{ left: `${item.value}%` }}
                                    />
                                    <div
                                        className={styles.fill}
                                        style={{ width: `${item.value}%` }}
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
