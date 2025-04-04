import React, { useState } from 'react';
import { 
  SidebarContainer, 
  SidebarToggle, 
  SidebarContent, 
  ProjectLink,
  SidebarHeader,
  ProjectsList
} from './styles';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Project links data
  const projects = [
    { 
      name: "Novus Nexum Energy Generation", 
      url: "https://novusnexumenergygen.replit.app/",
      description: "Energy generation project"
    },
    { 
      name: "AllPro Consulting Survey", 
      url: "https://allpro-consulting-survey.replit.app/",
      description: "Consulting survey platform"
    },
    { 
      name: "Critical Infrastructure", 
      url: "https://www.novusnexum.com/newsletter/CriticalInfrastructureNeeded/index.html",
      description: "AI infrastructure newsletter"
    },
    { 
      name: "Phnix Arcade", 
      url: "https://phnixarcade.lol/",
      description: "Gaming arcade platform"
    },
    { 
      name: "Novus Nexum", 
      url: "https://www.NovusNexum.com/",
      description: "Main company website"
    }
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarToggle onClick={toggleSidebar}>
        {isOpen ? '◀' : '▶'}
      </SidebarToggle>
      
      <SidebarContent isOpen={isOpen}>
        <SidebarHeader>
          <h3>Daniel Hill Projects</h3>
          <p>NOVUS | NEXUM</p>
        </SidebarHeader>

        <ProjectsList>
          {projects.map((project, index) => (
            <li key={index}>
              <ProjectLink 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {project.name}
                <span>{project.description}</span>
              </ProjectLink>
            </li>
          ))}
        </ProjectsList>
      </SidebarContent>
    </SidebarContainer>
  );
};