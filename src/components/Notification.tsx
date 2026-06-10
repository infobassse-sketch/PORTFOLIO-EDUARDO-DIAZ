import { motion, AnimatePresence } from 'motion/react';
import { BellRing, Check } from 'lucide-react';

interface NotificationProps {
  message: string | null;
  onClear: () => void;
}

export default function Notification({ message, onClear }: NotificationProps) {
  return (
    <AnimatePresence>
      {message && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm select-none pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto bg-black text-white border border-brand-border/30 rounded-2xl p-4 shadow-2xl flex items-start gap-3.5"
          >
            {/* Elegant blue-lit indicator Icon */}
            <div className="w-8 h-8 rounded-full bg-brand-blue/15 flex items-center justify-center shrink-0 border border-brand-blue/30">
              <Check className="w-4 h-4 text-brand-blue" />
            </div>

            <div className="space-y-1 flex-1">
              <h5 className="font-sans text-[9px] tracking-widest text-[#0052FF] uppercase font-black">
                SISTEMA NOTIFICACIÓN
              </h5>
              <p className="font-sans text-xs text-neutral-300 font-medium leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onClear}
              className="text-neutral-500 hover:text-white font-sans text-[10px] uppercase font-bold px-1.5 py-0.5 rounded cursor-pointer"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
