import styled from 'styled-components';

// Interface for sidebar props
interface SidebarProps {
  isOpen: boolean;
}

export const SidebarContainer = styled.div<SidebarProps>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => (props.isOpen ? '280px' : '40px')};
  background-color: #333;
  color: white;
  transition: width 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
`;

export const SidebarToggle = styled.button`
  position: absolute;
  right: 0;
  top: 20px;
  width: 30px;
  height: 30px;
  background-color: #6e45e2;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  outline: none;
  z-index: 10;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background-color: #5a39b8;
  }
`;

export const SidebarContent = styled.div<SidebarProps>`
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s;
  padding: 20px;
  width: 280px;
  overflow-y: auto;
  height: 100%;
`;

export const SidebarHeader = styled.div`
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: #6e45e2;
  }
  
  p {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;

export const ProjectsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 15px;
  }
`;

export const ProjectLink = styled.a`
  display: block;
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #6e45e2;
  }
  
  span {
    display: block;
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: 5px;
  }
`;

export const LogoImage = styled.img`
  width: 100%;
  max-width: 200px;
  margin: 0 auto 20px;
  display: block;
`; 