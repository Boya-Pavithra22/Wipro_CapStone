import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TopPopup = ({ show, message, type }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            background: type === "error" ? "#e63946" : "#06d6a0",
            color: "#fff",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontWeight: "bold",
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopPopup;
