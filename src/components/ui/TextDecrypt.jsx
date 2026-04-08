/*
  TextDecrypt.jsx
  ---------------
  Smooth terminal-style text decryption effect.
  Zero glitch - each character is a stable DOM node.
*/

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, useInView, animate } from "framer-motion"

const CHARS = "!<>-_\\/[]{}—=+*^?#_"

export default function TextDecrypt({ text, as: Component = "h1", className, speed = 1200 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const hasAnimated = useRef(false)
  
  const chars = useMemo(() => text.split(""), [text])
  const [lockedIndices, setLockedIndices] = useState(new Set())
  const [scrambledValues, setScrambledValues] = useState(() =>
    text.split("").map(char => char === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)])
  )

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const controls = animate(0, 1, {
      duration: speed / 1000,
      ease: "circOut",
      onUpdate: (latest) => {
        const lockedCount = Math.floor(latest * chars.length)
        const currentLocked = new Set()
        for (let j = 0; j < lockedCount; j++) {
          currentLocked.add(j)
        }
        setLockedIndices(currentLocked)

        setScrambledValues(prev =>
          chars.map((char, i) => {
            if (currentLocked.has(i) || chars[i] === " ") return chars[i]
            // Maintain scrambling variety even as we settle
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
        )
      }
    })

    return () => controls.stop()
  }, [isInView, chars, speed])

  return (
    <Component ref={ref} className={className}>
      <motion.span
        className="inline-block font-mono"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {(() => {
          const result = [];
          let currentWord = [];
          
          scrambledValues.forEach((char, i) => {
            const charElement = (
              <span
                key={i}
                className="text-white"
                style={{
                  display: "inline-block",
                  fontVariantNumeric: "tabular-nums",
                  fontFeatureSettings: '"tnum"',
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
            
            if (char === " ") {
              // Finish current word and add the space
              if (currentWord.length > 0) {
                result.push(
                  <span key={`word-${result.length}`} className="inline-block whitespace-nowrap">
                    {currentWord}
                  </span>
                );
                currentWord = [];
              }
              result.push(charElement);
            } else {
              currentWord.push(charElement);
            }
          });
          
          if (currentWord.length > 0) {
            result.push(
              <span key={`word-${result.length}`} className="inline-block whitespace-nowrap">
                {currentWord}
              </span>
            );
          }
          
          return result;
        })()}
      </motion.span>
    </Component>
  )
}
