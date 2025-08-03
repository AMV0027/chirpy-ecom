import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../../assets/logo.png'

function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 500) // Wait for exit animation
    }, 3000) // Show splash for 2.5 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center space-y-8">
            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
              }}
              className="flex flex-col items-center space-y-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotateY: [0, 5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <img
                  src={logo}
                  alt="CHIRPY Logo"
                  className="h-64 w-64 object-contain"
                />
              </motion.div>

              <div className="text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.8
                  }}
                  className="text-4xl font-bold text-emerald-800"
                >
                  CHIRPY
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.0
                  }}
                  className="text-lg text-emerald-700 mt-2 font-medium"
                >
                  Your Furniture Tales
                </motion.p>
              </div>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.2
              }}
              className="flex space-x-2"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                  className="h-2 w-2 bg-emerald-600 rounded-full"
                />
              ))}
            </motion.div>

            {/* Subtle fade-in text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 1.5
              }}
              className="text-sm text-emerald-600 mt-6 font-medium"
            >
              Crafting your perfect home...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen