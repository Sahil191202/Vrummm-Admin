import React, { useState, useEffect, useRef } from 'react';

/**
 * React Bits - DecryptedText
 * Terminal-style scrambled character decipher effect.
 * /unslop: Runs briefly on mount or hover, immediately resolves to target text.
 */
export function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 8,
  sequential = true,
  revealDirection = 'start', // 'start' | 'end' | 'center'
  useOriginalCharsOnly = false,
  characters = '0123456789ABCDEF!@#$*&',
  className = '',
  parentClassName = '',
  encryptedClassName = 'opacity-60 text-[#15803D] dark:text-[#1FD88A]',
  animateOn = 'mount', // 'mount' | 'hover'
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef(null);

  const getNextChar = (originalChar) => {
    if (originalChar === ' ' || originalChar === '-' || originalChar === '_') return originalChar;
    if (useOriginalCharsOnly) {
      const chars = text.split('').filter((c) => c !== ' ');
      return chars[Math.floor(Math.random() * chars.length)] || originalChar;
    }
    return characters[Math.floor(Math.random() * characters.length)];
  };

  const scramble = () => {
    if (!text) return;
    let iteration = 0;
    const textArray = text.split('');
    const len = textArray.length;

    clearInterval(intervalRef.current);
    setIsScrambling(true);

    intervalRef.current = setInterval(() => {
      iteration++;

      const nextText = textArray
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (sequential) {
            const revealedLength = Math.floor((iteration / maxIterations) * len);
            if (revealDirection === 'start' && index < revealedLength) return char;
            if (revealDirection === 'end' && index >= len - revealedLength) return char;
          } else {
            if (iteration >= maxIterations) return char;
          }
          return getNextChar(char);
        })
        .join('');

      setDisplayText(nextText);

      if (iteration >= maxIterations + (sequential ? len : 0)) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'mount') {
      scramble();
    } else {
      setDisplayText(text);
    }
    return () => clearInterval(intervalRef.current);
  }, [text, animateOn]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      setIsHovering(true);
      scramble();
    }
  };

  const handleMouseLeave = () => {
    if (animateOn === 'hover') {
      setIsHovering(false);
    }
  };

  return (
    <span
      className={`inline-block font-mono ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className={isScrambling ? encryptedClassName : className}>
        {displayText}
      </span>
    </span>
  );
}
