'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';

// Define Project type directly (should match the one passed from Projects.tsx)
interface Project {
  id: string;
  title: string;
  description: string;
  image: string | null;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string | null;
  featured?: boolean;
  order?: number;
  createdAt?: Date; // Add other fields if needed/passed
  updatedAt?: Date;
}

interface ProjectListProps {
  projects: Project[];
}

const filters = [
  { id: 'all', name: 'All' },
  { id: 'featured', name: 'Featured' },
  // { id: 'web', name: 'Web Apps' }, 
  // { id: 'mobile', name: 'Mobile Apps' }, 
];

export default function ProjectList({ projects }: ProjectListProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'featured') return project.featured;
    return true; 
  });

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-12">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${ 
              activeFilter === filter.id
                ? 'bg-primary text-white border-primary shadow-sm' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src={project.image || '/project-placeholder.png'} // Fallback image
                alt={project.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-5">
                {(project.technologies || []).map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out shadow-sm"
                >
                  <Github className="w-3.5 h-3.5" />
                  Code
                </Link>
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark/90 transition duration-150 ease-in-out shadow-sm"
                  >
                     <ExternalLink className="w-3.5 h-3.5" />
                    Live Demo
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
           <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No projects found matching the selected filter.</p>
        )}
      </div>
    </>
  );
} 