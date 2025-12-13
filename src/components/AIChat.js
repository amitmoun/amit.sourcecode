'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AIChat.module.css';
import SemanticAvatar from './SemanticAvatar';

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello. I am the interface to Amit’s career data.\nQuery me on his hiring metrics, scalability logic, granular project outcomes, or his strategic deployment of AI." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e, textOverride = null) => {
        if (e) e.preventDefault();

        const textToSend = textOverride || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage = { role: 'user', content: textToSend };
        // Create a new history array including the new message
        const newMessages = [...messages, userMessage];

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // FIX: Server expects 'messages' array, not single 'message'
                body: JSON.stringify({ messages: newMessages })
            });

            if (!res.ok) {
                // Handle non-200 responses (e.g., 500, 404)
                throw new Error(`Server returned ${res.status}`);
            }

            const data = await res.json();

            // Safety: Ensure content exists before using it
            const aiContent = data.content || "I'm connected, but I received an empty response. Try asking something else.";

            setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "My connection is a bit unstable (Client-Side Error). Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Parser to highlight metrics
    const formatContent = (text) => {
        // Regex to find numbers with % or "hours" or "hired" context, roughly
        // Matches: 30%, 25 hours, 100 people etc.
        if (!text || typeof text !== 'string') return null;

        const parts = text.split(/(\d+(?:%|\+| hours| candidates| hires| days)?)/g);

        return parts.map((part, i) => {
            if (/\d/.test(part) && part.length < 15) { // Simple heuristic for metric-like snippets
                return (
                    <span key={i} className={styles.highlightMetric}>
                        {part}
                        <span className={styles.checkIcon}>✓</span>
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className={styles.container}>
            {!isOpen && (
                <button className={styles.chatButton} onClick={() => setIsOpen(true)}>
                    <div className={styles.statusIcon}></div>
                    <div className={styles.btnTextCol}>
                        <span className={styles.btnTitle}>Amit_Neural</span>
                    </div>
                </button>
            )}

            {isOpen && (
                <div className={styles.chatCard}>
                    <div className={styles.cardInner}>

                        {/* FRONT (Chat Interface) */}
                        <div className={styles.cardFront}>
                            <div className={styles.glassHeader}>
                                <div className={styles.avatarWrapper}>
                                    <SemanticAvatar isThinking={isLoading} />
                                </div>
                                <div className={styles.headerInfo}>
                                    <h3>Amit_Neural</h3>
                                    <span className={styles.statusDot}>{isLoading ? 'PROCESSING...' : 'ONLINE'}</span>
                                </div>
                                <div className={styles.headerControls}>
                                    <button className={styles.iconBtn} onClick={() => setIsOpen(false)}>✕</button>
                                </div>
                            </div>

                            <div className={styles.messages}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.bot}`}>
                                        {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggested Question Chips (Impress Me) */}
                            {messages.length === 1 && (
                                <div className={styles.chipContainer}>
                                    {[
                                        { label: "💰 Closing Strategy", trigger: "closing strategy" },
                                        { label: "🤖 AI Innovation", trigger: "ai strategy" },
                                        { label: "🕵️ Hidden Talent", trigger: "invisible talent" }
                                    ].map((chip) => (
                                        <button
                                            key={chip.label}
                                            className={styles.chip}
                                            onClick={() => {
                                                setInput(chip.trigger);
                                                // Small delay to let state update or just pass directly
                                                // We can bypass state for the send, but setting it is nice for UI
                                                // Let's call a send function that accepts text
                                                handleSendMessage(null, chip.trigger);
                                            }}
                                        >
                                            {chip.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className={styles.inputForm}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Query database..."
                                    className={styles.input}
                                    autoFocus
                                />
                                <button type="submit" className={styles.sendButton} disabled={isLoading}>Run</button>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
