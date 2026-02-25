import React, { useEffect, useState } from 'react';

const CursorGlow = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Update CSS variables for the background glow
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

            // Check if hovering over a clickable element
            const target = e.target;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a')
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <div className="cursor-glow-container" />
            <div
                className="custom-cursor"
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isPointer ? 1.5 : 1})`,
                    backgroundColor: isPointer ? 'var(--color-secondary)' : 'var(--color-primary)'
                }}
            />
            <div
                className="custom-cursor-follower"
                style={{
                    transform: `translate3d(${position.x - 12}px, ${position.y - 12}px, 0) scale(${isPointer ? 2 : 1})`,
                    borderColor: isPointer ? 'var(--color-secondary)' : 'var(--color-primary)'
                }}
            />
        </>
    );
};

export default CursorGlow;
