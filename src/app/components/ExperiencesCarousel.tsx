'use client';

import { useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../portfolio.module.css';

interface ExperienceImage {
  src: string;
  alt: string;
  description: string;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  duration: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  images: ExperienceImage[];
  companyUrl?: string;
}

const experiences: Experience[] = [
  {
    id: 1,
    title: "Data analyst intern",
    company: "Ericsson",
    duration: "Summer 2021",
    description: "Processed 5G coverage data to demonstrate to clients the value of indoor 5G hotspots. Improved processing runtimes by over 60,000%",
    responsibilities: [
      "Map areas of poor and good 5G coverage",
      "Compare cellular data coverage indoor vs outdoor, distance from cell tower, location, etc.",
      "Organized findings into presentations used in client meetings"
    ],
    technologies: ["Python", "Numba", "Numpy", "Pandas", "Geographic Information Systems"],
    companyUrl: "https://www.ericsson.com/en/network-slicing/one-network/solution-overview",
    images: []
  },
  {
    id: 2,
    title: "iGEM President and Founder",
    company: "Kentucky's first and only iGEM team",
    duration: "November 2022 - May 2025",
    description: "I founded and led Kentucky's first iGEM team to an international Gold medal, raising $30,000+, discovering new ways PFAS (fluorine-containing forever chemical pollutants) might cause cancer, and engineering organisms to detect PFAS",
    responsibilities: [
      "Secured support from university faculty and school administration starting from nothing",
      "Raised $30,000+ from NIH grants, corporate sponsors, and donations from fundraiser campaigns",
      "Managed team of 23 students to work on advancing science while outreaching to the community for feedback and education",
      "Directed mathematical modeling of genetic circuits",
      "Experimentally implicated 2 novel human proteins in their role in PFAS-induced cancer using computational screening and manual curation",
      "Developed team wiki to document experiments and progress for judging"
    ],
    technologies: ["HTML/CSS/JS", "Kinetic Modeling", "Molecular Biology", "Genetic Engineering"],
    companyUrl: "https://2024.igem.wiki/gcm-ky/",
    images: [
      {
        src: "/experience2-image1.jpg",
        alt: "Web Application",
        description: "Main web application dashboard with user analytics"
      },
      {
        src: "/experience2-image2.jpg",
        alt: "Development Environment",
        description: "Development setup with code editor and debugging tools"
      },
      {
        src: "/experience2-image3.jpg",
        alt: "Team Meeting",
        description: "Sprint planning and feature discussion with the team"
      }
    ]
  },
  {
    id: 3,
    title: "Molecular Dynamics Machine Learning Research Intern",
    company: "Marinescu Lab at University of California, Santa Cruz",
    duration: "Summer 2025",
    description: "I developed a pipeline to embed ligands into machine-learned coarse-grained protein simulations",
    responsibilities: [
      "Develop new methods to embed ligands as a single bead while retaining chemical identity and orientation in space",
      "Collaborated with graduate researchers in a shared workspace and had direct meetings with the professor to resolve problems",
      "Quickly grasped complexity of existing codebase to develop drop-in solution",
      "Submitted work to NeurIPS 2025 Machine Learning for Physical Sciences"
    ],
    technologies: ["PyTorch", "RDKit", "Scientific Software Development", "Paper Preparation"],
    companyUrl: "https://razvanmarinescu.com/",
    images: [
      {
        src: "/project-images/coarse-grained-example.png",
        alt: "Research Lab",
        description: "Example of a coarse-grained system with a ligand"
      }
    ]
  }
];

const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const [isImageCarouselExpanded, setIsImageCarouselExpanded] = useState(false);

  const imageSliderSettings = {
    dots: experience.images.length > 1,
    infinite: experience.images.length > 1,
    speed: 500,
    slidesToShow: Math.min(3, experience.images.length),
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, experience.images.length),
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
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">
          {experience.title}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
            {experience.company}
          </span>
          {experience.companyUrl && (
            <a
              href={experience.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {experience.duration}
        </p>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
        {experience.description}
      </p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
          Key Responsibilities:
        </h4>
        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
          {experience.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
          Technologies:
        </h4>
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {experience.images.length > 0 && (
        <>
          <div className="mb-4">
            <button
              onClick={() => setIsImageCarouselExpanded(!isImageCarouselExpanded)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <span>{isImageCarouselExpanded ? 'Hide' : 'Show'} Experience Images</span>
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
              <Slider {...imageSliderSettings} className={styles.experienceImageSlider}>
                {experience.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-contain"
                        onError={(e) => console.error('Image failed to load:', image.src)}
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
    </div>
  );
};

const ExperiencesCarousel = () => {
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

  const handleExperienceSelect = (experienceIndex: number) => {
    if (sliderRef) {
      sliderRef.slickGoTo(experienceIndex);
    }
  };

  return (
    <div className={styles.experiencesCarousel}>
      <div className="flex justify-between items-center mb-4">
        {!isGridView && (
          <div className="flex items-center gap-2">
            <label htmlFor="experience-select" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Jump to experience:
            </label>
            <select
              id="experience-select"
              value={currentSlide}
              onChange={(e) => handleExperienceSelect(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {experiences.map((experience, index) => (
                <option key={experience.id} value={index}>
                  {experience.title} - {experience.company}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      ) : (
        <Slider ref={setSliderRef} {...sliderSettings}>
          {experiences.map((experience) => (
            <div key={experience.id}>
              <ExperienceCard experience={experience} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ExperiencesCarousel; 