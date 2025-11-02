import React from "react";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";

function OverlayLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl border border-white/10"
      >
        <div className="relative">
          <Spinner
            size="lg"
            color="primary"
            className="w-20 h-20"
            classNames={{
              wrapper: "w-20 h-20",
              circle1: "border-[3px] border-primary-500/80",
              circle2: "border-[3px] border-primary-500/40",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl"
          />
        </div>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/90 text-lg font-medium tracking-wide"
        >
          Loading...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default OverlayLoader;
