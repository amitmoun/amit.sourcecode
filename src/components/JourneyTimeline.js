
import React from 'react';
import styles from './JourneyTimeline.module.css';

import { journey } from '@/lib/data';

export default function JourneyTimeline() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Engineering Journey</h2>
            <div className={styles.timeline}>
                {journey.map((item, index) => (
                    <div key={index} className={styles.item}>
                        <div className={styles.marker}></div>
                        <div className={styles.content}>
                            <div className={styles.header}>
                                <h3 className={styles.role}>{item.role}</h3>
                                <span className={styles.company}>{item.company}</span>
                            </div>
                            <div className={styles.meta}>
                                <span>{item.period}</span> • <span>{item.location}</span>
                            </div>
                            <p className={styles.description}>{item.description}</p>
                            <ul className={styles.achievements}>
                                {item.achievements.map((ach, i) => (
                                    <li key={i}>{ach}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
