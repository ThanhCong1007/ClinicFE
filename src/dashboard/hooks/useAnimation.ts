import { useEffect, useRef } from 'react';
const anime = require('animejs');

export const useAnimation = () => {
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  const fadeIn = (target: string | HTMLElement | HTMLElement[], duration = 1000) => {
    animationRef.current = anime({
      targets: target,
      opacity: [0, 1],
      duration: duration,
      easing: 'easeOutQuad'
    });
  };

  const slideIn = (target: string | HTMLElement | HTMLElement[], direction: 'left' | 'right' | 'up' | 'down' = 'left', duration = 1000) => {
    const translateX = direction === 'left' ? [-100, 0] : direction === 'right' ? [100, 0] : [0, 0];
    const translateY = direction === 'up' ? [-100, 0] : direction === 'down' ? [100, 0] : [0, 0];

    animationRef.current = anime({
      targets: target,
      translateX: translateX,
      translateY: translateY,
      opacity: [0, 1],
      duration: duration,
      easing: 'easeOutQuad'
    });
  };

  const staggerIn = (target: string | HTMLElement | HTMLElement[], duration = 1000) => {
    animationRef.current = anime({
      targets: target,
      opacity: [0, 1],
      translateY: [50, 0],
      delay: anime.stagger(100),
      duration: duration,
      easing: 'easeOutQuad'
    });
  };

  const scaleIn = (target: string | HTMLElement | HTMLElement[], duration = 1000) => {
    animationRef.current = anime({
      targets: target,
      scale: [0.5, 1],
      opacity: [0, 1],
      duration: duration,
      easing: 'easeOutQuad'
    });
  };

  const bounceIn = (target: string | HTMLElement | HTMLElement[], duration = 1000) => {
    animationRef.current = anime({
      targets: target,
      translateY: [-100, 0],
      opacity: [0, 1],
      duration: duration,
      easing: 'easeOutBounce'
    });
  };

  const pulse = (target: string | HTMLElement | HTMLElement[], duration = 1000) => {
    animationRef.current = anime({
      targets: target,
      scale: [1, 1.1, 1],
      duration: duration,
      easing: 'easeInOutQuad',
      loop: true
    });
  };

  const shake = (target: string | HTMLElement | HTMLElement[], duration = 1000) => {
    animationRef.current = anime({
      targets: target,
      translateX: [0, -10, 10, -10, 10, 0],
      duration: duration,
      easing: 'easeInOutQuad'
    });
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  return {
    fadeIn,
    slideIn,
    staggerIn,
    scaleIn,
    bounceIn,
    pulse,
    shake,
    stopAnimation
  };
}; 