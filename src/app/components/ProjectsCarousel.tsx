'use client';

import { useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../portfolio.module.css';
interface ProjectImage {
  src: string;
  alt: string;
  description: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  images: ProjectImage[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  youtubeUrl?: string;
}

const projects: Project[] = [
  {
    id: 3,
    title: "Biology RAG",
    description: "I built a RAG pipeline for biology using LangChain and Google Gemini. It uses the textbooks most recommended for the USA Biology Olympiad for its knowledge abse. It can answer questions about biology and cite sources. It currently runs as a self-contained microservice.",
    technologies: ["python", "LangChain", "Google Gemini","Large Language Models"],
    githubUrl: "https://github.com/dglgit/bio-rag",
    liveUrl: "https://fancy-portfolio-88xz.vercel.app/bio-rag",
    youtubeUrl: "",
    images: []
  },
  {
    id: 5,
    title: "Multicellular simulator",
    description: "Python + Numpy + Numba based implementation of the Gillespie algorithm for stochastic chemical kinetics. I used it to extend the capabilities of Virtual Cell to simulate multicellular systems. Paper available here: https://doi.org/10.3389/fmolb.2025.1595363",
    technologies: ["python", "Numpy", "Numba"],
    githubUrl: "https://github.com/dglgit/multicellular-simulator",
    liveUrl: "",
    youtubeUrl: "",
    images: [
      {
        src: "/project-images/kinetics-GA2.png",
        alt: "Graphical abstract",
        description: "Graphical abstract of my research"
      },
      {
        src: '/project-images/10cell-sim.png',
        alt: '10 cell simulation',
        description: '10 cell simulation'
      },
      {
        src: '/project-images/100cell-sim.png',
        alt: '100 cell simulation',
        description: '100 cell simulation'
      }
    ]
  },
  {
    id: 1,
    title: "Protein melting",
    description: "I used OpenMM to simulate proteins at 500K to see how their structure changes. Makes for pretty fun animations.",
    technologies: ["python", "OpenMM"],
    githubUrl: "https://github.com/dglgit/melting-md",
    liveUrl: "",
    youtubeUrl: "https://youtu.be/DAiMOT86srI",
    images: [
      {
        src: "/project-images/openmm-logo.png",
        alt: "OpenMM logo",
        description: "OpenMM logo (library used for molecule dynamics)"
      },
      {
        src: "/project-images/start-melt.png",
        alt: "Protein at the start of the simulation",
        description: "Protein at the start of the simulation"
      },
      {
        src: "/project-images/end-melt.png",
        alt: "Protein at the end of the simulation",
        description: "Protein at the end of the simulation"
      }
    ]
  },
  {
    id: 4,
    title: "MMPBSA.py pipeline",
    description: "Python and command line tools to run a MMPBSA.py calculation on a protein-ligand complex using OpenMM and ambertools. You only need to provide a single PDB with the complex. ",
    technologies: ["python", "OpenMM", "ambertools"],
    githubUrl: "https://github.com/dglgit/mmpbsapy-pipline",
    liveUrl: "",
    youtubeUrl: "",
    images: []
  },
  {
    id: 2,
    title: "Membrane simulation",
    description: "I simulated a phospholipid bilayer using OpenMM in water and ethanol. I hoped the ethanol would dissolve the membrane but that didn't happen. I did get to see the effects of how solvent density affects the membrane's packing.",
    technologies: ["OpenMM", "python"],
    githubUrl: "https://github.com/dglgit/membrane-testing",
    liveUrl: "",
    youtubeUrl: "https://youtu.be/m6CewOsVv3s",
    images: [
      {
        src: "/project-images/membrane-sim-pic.png",
        alt: "Membrane simulation",
        description: "Membrane simulation screenshot"
      },
    ]
  },
  
];

const ProjectCard = ({ project }: { project: Project }) => {
  const [isImageCarouselExpanded, setIsImageCarouselExpanded] = useState(false);

  const imageSliderSettings = {
    dots: project.images.length > 1,
    infinite: project.images.length > 1,
    speed: 500,
    slidesToShow: Math.min(3, project.images.length),
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, project.images.length),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className={`bg-white dark:bg-slate-700 rounded-lg shadow-lg p-6 mx-4 h-full ${styles.cardContainer}`}>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
        {project.title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
        {project.description}
      </p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
          Technologies:
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {project.images.length > 0 && (
        <>
          <div className="mb-4">
            <button
              onClick={() => setIsImageCarouselExpanded(!isImageCarouselExpanded)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <span>{isImageCarouselExpanded ? 'Hide' : 'Show'} Project Images</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isImageCarouselExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {isImageCarouselExpanded && (
            <div className="mb-4">
              <Slider {...imageSliderSettings} className={styles.projectImageSlider}>
                {project.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-contain"
                        onError={() => console.error('Image failed to load:', image.src)}
                        onLoad={() => console.log('Image loaded successfully:', image.src)}
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                          <h4 className="font-semibold mb-2">{image.alt}</h4>
                          <p className="text-sm">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </>
      )}

      <div className="flex gap-3 mt-auto flex-wrap">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        )}
        {project.youtubeUrl && (
          <a
            href={project.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch Video
          </a>
        )}
        {project.liveUrl && project.liveUrl !== "TBD" && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {project.liveUrl.includes('doi.org') ? 'Read Paper' : 'Live Demo'}
          </a>
        )}
      </div>
    </div>
  );
};

const ProjectsCarousel = () => {
  const [isGridView, setIsGridView] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState<Slider | null>(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handleProjectSelect = (projectIndex: number) => {
    if (sliderRef) {
      sliderRef.slickGoTo(projectIndex);
    }
  };

  return (
    <div className={styles.projectsCarousel}>
      <div className="flex justify-between items-center mb-4">
        {!isGridView && (
          <div className="flex items-center gap-2">
            <label htmlFor="project-select" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Jump to project:
            </label>
            <select
              id="project-select"
              value={currentSlide}
              onChange={(e) => handleProjectSelect(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {projects.map((project, index) => (
                <option key={project.id} value={index}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          {isGridView ? 'Carousel View' : 'Grid View'}
        </button>
      </div>
      
      {isGridView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Slider ref={setSliderRef} {...sliderSettings}>
          {projects.map((project) => (
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProjectsCarousel; 