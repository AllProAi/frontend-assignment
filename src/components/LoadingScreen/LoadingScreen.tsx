import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { EncordLogo } from './EncordLogo';

const fadeOut = keyframes`
  0% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; visibility: hidden; }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseScale = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInFromBottom = keyframes`
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px rgba(110, 69, 226, 0.7); }
  50% { box-shadow: 0 0 20px rgba(110, 69, 226, 0.9), 0 0 30px rgba(110, 69, 226, 0.5); }
  100% { box-shadow: 0 0 10px rgba(110, 69, 226, 0.7); }
`;

const particleDrift = keyframes`
  0% { transform: translate(0, 0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
`;

const LoadingScreenContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #6e45e2, #88d3ce, #6e45e2, #d585ff);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite, 
             ${props => props.isVisible ? 'none' : css`${fadeOut} 1.5s ease-in forwards`};
  opacity: ${props => (props.isVisible ? 1 : 0)};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.5s ease, visibility 0.5s;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  width: 280px;
  height: auto;
  margin-bottom: 2rem;
  animation: ${pulseScale} 3s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${slideInFromBottom} 1s ease-out forwards;
`;

const Tagline = styled.div`
  font-size: 1.4rem;
  color: white;
  text-align: center;
  max-width: 600px;
  margin: 2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const SubTagline = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  max-width: 700px;
  padding: 0 2rem;
  line-height: 1.5;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
`;

const LoadingBar = styled.div`
  width: 280px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-top: 3rem;
  box-shadow: 0 0 15px rgba(110, 69, 226, 0.6);
  animation: ${glowAnimation} 2s ease-in-out infinite;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    background: white;
    animation: loading 2.8s ease-in-out forwards;
  }

  @keyframes loading {
    0% { width: 0; }
    20% { width: 20%; }
    50% { width: 60%; }
    80% { width: 85%; }
    100% { width: 100%; }
  }
`;

const Particle = styled.div<{ index: number }>`
  position: absolute;
  width: ${props => 4 + Math.random() * 6}px;
  height: ${props => 4 + Math.random() * 6}px;
  background: rgba(255, 255, 255, ${props => 0.3 + Math.random() * 0.5});
  border-radius: 50%;
  top: ${props => Math.random() * 100}vh;
  left: ${props => Math.random() * 100}vw;
  --tx: ${props => -50 + Math.random() * 100}px;
  --ty: ${props => -50 + Math.random() * 100}px;
  animation: ${particleDrift} ${props => 3 + Math.random() * 6}s linear infinite;
  animation-delay: ${props => Math.random() * 5}s;
`;

// Generate an array of 30 particles
const particles = Array.from({ length: 30 }, (_, i) => i);

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4900); // Match with animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingScreenContainer isVisible={visible}>
      {particles.map(index => (
        <Particle key={index} index={index} />
      ))}
      
      <ContentContainer>
        <LogoContainer>
          <EncordLogo />
        </LogoContainer>
        
        <Tagline>
          The fastest way to manage, curate and annotate AI data
        </Tagline>
        
        <SubTagline>
          Transform petabytes of unstructured data into high quality data for training, fine-tuning, 
          and aligning AI models, fast.
        </SubTagline>
        
        <LoadingBar />
      </ContentContainer>
    </LoadingScreenContainer>
  );
}; 