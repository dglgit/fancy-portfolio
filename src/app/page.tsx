'use client';

import { useState } from 'react';
import ProjectsCarousel from './components/ProjectsCarousel';
import ExperiencesCarousel from './components/ExperiencesCarousel';
import styles from './portfolio.module.css';

export default function Home() {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [isExperiencesExpanded, setIsExperiencesExpanded] = useState(false);

  return (
    <div className={`min-h-screen ${styles.portfolioContainer}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-7xl font-bold text-slate-800 dark:text-white mb-4">
            Douglas Lin
          </h1>
          <div className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-2">
            林道可
          </div>
          <div className="text-md text-slate-600 dark:text-slate-300 mb-2">
            Computer Science and Engineering @ University of Washington
          </div>
          <div className="text-slate-600 dark:text-slate-300 mb-8">
            <a
              href="/Douglas_Lin_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Résumé
            </a>
            <span className="mx-3">|</span>
            <a
              href="mailto:dlin26@cs.washington.edu"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              dlin26@cs.washington.edu
            </a>
            <span className="mx-3">|</span>
            <a
              href="https://github.com/dglgit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </header>

        {/* Description Section */}
        <section className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            I am an incoming student to the University of Washington for Computer Science.
            My experiences and interests lie in a combination of computational and synthetic biology. 
            My ultimate goal in life is to find cures to incurable diseases and revolutionize what humans can do with biology.
            
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Projects
              </h2>
              <svg
                className={`w-6 h-6 text-slate-600 dark:text-slate-300 transition-transform ${
                  isProjectsExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isProjectsExpanded && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                <ProjectsCarousel />
              </div>
            )}
          </div>
        </section>

        {/* Experiences Section */}
        <section className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setIsExperiencesExpanded(!isExperiencesExpanded)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Experiences
              </h2>
              <svg
                className={`w-6 h-6 text-slate-600 dark:text-slate-300 transition-transform ${
                  isExperiencesExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isExperiencesExpanded && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                <ExperiencesCarousel />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
