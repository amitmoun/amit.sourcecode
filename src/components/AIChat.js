'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './AIChat.module.css';
import { MessageSquare, Bot } from 'lucide-react'; // Changed imports

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

    // Parser to highlight metrics and Markdown bold
    const formatContent = (text) => {
        if (!text || typeof text !== 'string') return null;

        // Split by simple Markdown bold syntax (**text**)
        // Capture group includes the delimiters for easier processing? 
        // Actually, let's just split by the bold markers and iterate.
        // We will do a 2-pass approach: 1. Split by Bold, 2. Split by Metric

        const boldParts = text.split(/(\*\*.*?\*\*)/g);

        return boldParts.map((boldPart, i) => {
            if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                // This is a bold chunk, remove stars and render strong
                const content = boldPart.slice(2, -2);
                return <strong key={i} style={{ color: '#fff' }}>{content}</strong>;
            }

            // If not bold, process for metrics as before
            const metricParts = boldPart.split(/(\d+(?:%|\+| hours| candidates| hires| days)?)/g);
            return metricParts.map((part, j) => {
                if (/\d/.test(part) && part.length < 15) {
                    return (
                        <span key={`${i}-${j}`} className={styles.highlightMetric}>
                            {part}
                            <span className={styles.checkIcon}>✓</span>
                        </span>
                    );
                }
                return part;
            });
        });
    };

    return (
        <div className={styles.container}>
            {!isOpen && (
                <button className={styles.chatButton} onClick={() => setIsOpen(true)}>
                    <div className={styles.iconWrapper}>
                        <MessageSquare size={20} className={styles.chatIcon} />
                        <span className={styles.statusDotOnline}></span>
                    </div>
                    <div className={styles.btnTextCol}>
                        <span className={styles.btnTitle}>Ask Amit_Neural</span>
                        <span className={styles.btnSubtitle}>AI Agent Online</span>
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
                                    <Bot size={24} color="#4ade80" />
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
