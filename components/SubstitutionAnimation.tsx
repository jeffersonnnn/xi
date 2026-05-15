'use client';
import { motion, AnimatePresence } from 'framer-motion';

type SubstitutionAnimationProps = {
  slotKey: string;
  children: React.ReactNode;
  playerId: string | null;
};

/**
 * Wraps a player card slot. When the playerId changes, the outgoing card
 * slides down and fades (red OFF), the incoming card slides up (green ON).
 * Reduced motion: simple cross-fade.
 */
export function SubstitutionAnimation({ slotKey, children, playerId }: SubstitutionAnimationProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${slotKey}-${playerId}`}
        initial="enter"
        animate="center"
        exit="exit"
        variants={{
          enter: { y: 24, opacity: 0, scale: 0.95 },
          center: { y: 0, opacity: 1, scale: 1 },
          exit: { y: -24, opacity: 0, scale: 0.95 },
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

type SubBannerProps = {
  show: boolean;
  outPlayer?: string;
  inPlayer?: string;
  slot?: string;
};

/**
 * Broadcast SUBSTITUTION banner that sweeps horizontally across the screen.
 * Total ~800ms: in 300ms ease-out, hold, out 500ms ease-in-out.
 * Panel background, gold "SUBSTITUTION" in Teko, status colors for names.
 * Reduced motion: cross-fade.
 */
export function SubstitutionBanner({ show, outPlayer, inPlayer, slot }: SubBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-20 left-0 right-0 z-50 flex justify-center pointer-events-none"
          initial="enter"
          animate="center"
          exit="exit"
          variants={{
            enter: { x: '-100%', opacity: 0 },
            center: { x: 0, opacity: 1 },
            exit: { x: '100%', opacity: 0 },
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="bg-panel border-y border-line w-full max-w-2xl mx-4 px-6 py-3 flex items-center gap-5">
            {/* SUBSTITUTION title */}
            <span className="font-display text-gold text-lg sm:text-xl font-semibold uppercase tracking-[0.15em] leading-none select-none whitespace-nowrap">
              Substitution
            </span>

            {/* Player swap details */}
            <div className="flex items-center gap-3 text-sm min-w-0">
              {/* Outgoing: red arrow down + OFF tag */}
              {outPlayer && (
                <span className="flex items-center gap-1.5 text-behind truncate">
                  <span className="text-[10px] leading-none">&#9660;</span>
                  <span className="font-mono text-xs uppercase tracking-wide truncate">
                    {outPlayer}
                  </span>
                  <span className="bg-behind/20 text-behind text-[9px] font-display uppercase tracking-wider px-1.5 py-0.5 rounded-sm leading-none">
                    OFF
                  </span>
                </span>
              )}

              {/* Incoming: green arrow up + ON tag */}
              {inPlayer && (
                <span className="flex items-center gap-1.5 text-live truncate">
                  <span className="text-[10px] leading-none">&#9650;</span>
                  <span className="font-mono text-xs uppercase tracking-wide truncate">
                    {inPlayer}
                  </span>
                  <span className="bg-live/20 text-live text-[9px] font-display uppercase tracking-wider px-1.5 py-0.5 rounded-sm leading-none">
                    ON
                  </span>
                </span>
              )}
            </div>

            {/* Slot label pushed to the right */}
            {slot && (
              <span className="font-display text-chalk-dim text-xs uppercase tracking-wider ml-auto shrink-0">
                {slot}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
