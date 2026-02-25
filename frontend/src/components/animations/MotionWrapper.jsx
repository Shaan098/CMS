import React from 'react';
import { motion } from 'framer-motion';

export const Reveal = ({ children, delay = 0, width = "fit-content" }) => {
    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export const StaggerContainer = ({ children, delay = 0, staggerChildren = 0.1 }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren: delay,
                        staggerChildren: staggerChildren
                    }
                }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};
