'use client';

import { motion } from 'framer-motion';

export function NatureBackground({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-slate-900 flex flex-col">
            {/* The Unsplash Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2574&auto=format&fit=crop" 
                    alt="Nature Abstract"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>
            
            {/* Soft Overlay Gradients */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/10 pointer-events-none" />
            
            {/* Animated Particles/Fog Effect (Subtle) */}
            <motion.div 
                className="absolute inset-0 z-0 bg-blue-500/10 mix-blend-overlay pointer-events-none"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full flex-grow flex flex-col">
                {children}
            </div>
        </div>
    );
}
