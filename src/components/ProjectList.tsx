'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';

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
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectListProps {
  projects: Project[];
}

const filters = [
  { id: 'all', name: 'All' },
  { id: 'featured', name: 'Featured' },
];

export default function ProjectList({ projects }: ProjectListProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'featured') return project.featured;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`relative px-8 py-4 rounded-full font-medium text-base transition-all duration-300 ease-in-out
              ${activeFilter === filter.id
                ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg transform scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
              }`}
          >
            {filter.name}
            {activeFilter === filter.id && (
              <span className="absolute inset-0 rounded-full border border-indigo-300/30 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Image Section */}
            <div className="relative h-72 w-full overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image || '/project-placeholder.svg'}
                  alt={project.title}
                  width={500}
                  height={288}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/project-placeholder.svg';
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <span className="text-gray-400 dark:text-gray-500 font-medium">No Preview</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-500 transition-colors">
                {project.title}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-3 mb-6">
                {(project.technologies || []).map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
            No projects found. Try adjusting your filter!
          </p>
        )}
      </div>
    </div>
  );
}
