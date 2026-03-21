import React from 'react';
import styles from './EasterEggCTA.module.css';

export default function EasterEggCTA() {
    return (
        <section className={styles.section} id="easter-egg">
            <div className={styles.terminal}>
                <div className={styles.terminalDots}>
                    <span />
                    <span />
                    <span />
                </div>
                <p className={styles.output}>
                    Models are perfect; pipelines are not. If you&apos;re scaling a team and trying to pinpoint exactly where your process is leaking capacity, I&apos;d love to{' '}
                    <a
                        href="mailto:getamitquick@gmail.com"
                        className={styles.link}
                    >
                        connect
                    </a>
                    {' '}and map your actual data against these benchmarks.
                </p>
            </div>
        </section>
    );
}
