import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotateAnimation = keyframes`
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const colorPulse = keyframes`
  0% { stop-color: #5e35b1; }
  25% { stop-color: #7e57c2; }
  50% { stop-color: #3f51b5; }
  75% { stop-color: #673ab7; }
  100% { stop-color: #5e35b1; }
`;

const colorPulse2 = keyframes`
  0% { stop-color: #9575cd; }
  25% { stop-color: #b39ddb; }
  50% { stop-color: #7986cb; }
  75% { stop-color: #9fa8da; }
  100% { stop-color: #9575cd; }
`;

const dash = keyframes`
  0% { stroke-dashoffset: 1000; }
  60% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
`;

const shimmer = keyframes`
  0% { 
    opacity: 0.4;
    transform: translateX(-100%) rotate(-45deg);
  }
  100% { 
    opacity: 0;
    transform: translateX(100%) rotate(-45deg);
  }
`;

const shineEffect = keyframes`
  0% { filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.5)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)); }
  100% { filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.5)); }
`;

const popIn = keyframes`
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const LogoWrapper = styled.div`
  width: 100%;
  height: 100%;
  perspective: 1000px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${floatAnimation} 3s ease-in-out infinite;
`;

const SymbolContainer = styled.div`
  transform-style: preserve-3d;
  animation: ${rotateAnimation} 6s ease-in-out infinite;
  position: relative;
`;

const TextContainer = styled.div`
  margin-left: 15px;
  position: relative;
  animation: ${popIn} 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  opacity: 0;

  path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: ${dash} 2.5s cubic-bezier(0.29, 0.84, 0.32, 1.3) forwards;
    animation-delay: 0.5s;
    filter: drop-shadow(0 0 3px rgba(255,255,255,0.7));
  }
`;

const ShimmerEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: ${shimmer} 3s ease-out infinite;
  animation-delay: 2s;
  pointer-events: none;
  z-index: 10;
`;

// Define animated gradient colors
const AnimatedGradientStop1 = styled.stop`
  animation: ${colorPulse} 4s ease-in-out infinite;
`;

const AnimatedGradientStop2 = styled.stop`
  animation: ${colorPulse2} 4s ease-in-out infinite;
`;

// Fix for StyledPath by properly typing it with delay as optional prop
interface StyledPathProps {
  delay?: string;
}

const StyledPath = styled.path<StyledPathProps>`
  animation: ${shineEffect} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || "0s"};
  transform-origin: center;
  filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));
`;

export const EncordLogo: React.FC = () => {
  return (
    <LogoWrapper>
      <LogoContainer>
        <SymbolContainer>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <AnimatedGradientStop1 offset="0%" stopColor="#5e35b1" />
                <AnimatedGradientStop2 offset="100%" stopColor="#9575cd" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Stylized E symbol with 3 stacked elements */}
            <g filter="url(#glow)">
              <StyledPath delay="0s" d="M10 15 L50 15 L45 25 L15 25 Z" fill="url(#logoGradient)" />
              <StyledPath delay="0.2s" d="M15 35 L45 35 L40 45 L10 45 Z" fill="url(#logoGradient)" />
              <StyledPath delay="0.4s" d="M20 25 L40 25 L35 35 L15 35 Z" fill="url(#logoGradient)" />
            </g>
          </svg>
          <ShimmerEffect />
        </SymbolContainer>
        
        <TextContainer>
          <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <filter id="textGlow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* ENCORD text with enhanced styling */}
            <g filter="url(#textGlow)">
              <path d="M10 8H30V13H16V18H28V23H16V28H30V33H10V8Z" 
                    stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M35 8H40V28H55V33H35V8Z" 
                    stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M60 8H75L82 20L89 8H104V33H99V12H95L86 33H78L69 12H65V33H60V8Z" 
                    stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M109 8H129C135 8 138 13 138 18C138 23 135 28 129 28H114V33H109V8ZM114 23H128C131 23 133 21 133 18C133 15 131 13 128 13H114V23Z" 
                    stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M143 8H148V33H143V8Z" 
                    stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <ShimmerEffect />
        </TextContainer>
      </LogoContainer>
    </LogoWrapper>
  );
}; 