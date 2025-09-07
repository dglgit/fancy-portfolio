'use client';
import React from 'react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Collapsible } from "radix-ui";
import Card from './Card';
import CardsCarousel from './CardsCarousel';
import './about.module.css';

export default function Page() {
  const [testOpen, setTestOpen] = useState(false);
  const [experienceOpen,setExperienceOpen] = useState(false);
  const [projectsOpen,setProjectsOpen]=useState(false);
  const imageUrls = [
    '/file.svg',
    '/globe.svg',
    '/next.svg',
    '/vercel.svg',
    '/window.svg',
  ];

  const cardsData = [
    {
      title: 'Project 1',
      description: 'Description of project 1',
      imageUrls: imageUrls,
    },
    {
      title: 'Project 2',
      description: 'Description of project 2',
      imageUrls: imageUrls,
    },
    {
      title: 'Project 3',
      description: 'Description of project 3',
      imageUrls: imageUrls,
    },
  ];

  return (
    <div>
      <p style={{textAlign:'center'}}>Douglas Lin</p>
      <p style={{textAlign:'center'}}>林道可</p>
      <p style={{textAlign:'center'}}>Incoming Freshman in Computer Science at the University of Washington, Seattle</p>
      <a href="/Douglas_Lin_resume.pdf">Résumé</a>
      <Collapsible.Root className="CollapsibleRoot" open={experienceOpen} onOpenChange={setExperienceOpen}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderColor:'black',
            borderStyle:'solid',
            borderWidth:'2px'
          }}
        >
        <span className="Text" style={{ color: "white" }}>
            Experiences
          </span>
          <Collapsible.Trigger asChild>
            <button className="IconButton" style={{width:"100%",textAlign:'right'}}>
              {experienceOpen ? "im open" : "im not open"}
            </button>
          </Collapsible.Trigger>
        </div>
        <Collapsible.Content className='ExperiencesContent'>
            <CardsCarousel cards={cardsData} />
        </Collapsible.Content>
      </Collapsible.Root>
      <br />
      <p>Below are some of my personal projects</p>
      <br />
      <Collapsible.Root className="CollapsibleRoot" open={projectsOpen} onOpenChange={setProjectsOpen}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderColor:'black',
            borderStyle:'solid',
            borderWidth:'2px'
          }}
        >
        <span className="Text" style={{ color: "white" }}>
            Projects
          </span>
          <Collapsible.Trigger asChild>
            <button className="IconButton" style={{width:"100%",textAlign:'right'}}>
              {projectsOpen ? "im open" : "im not open"}
            </button>
          </Collapsible.Trigger>
        </div>
        <Collapsible.Content className='ProjectsContent'>
            <CardsCarousel cards={cardsData} />
        </Collapsible.Content>
      </Collapsible.Root>
        
    </div>
  );
}
