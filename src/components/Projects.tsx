'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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
  projects: Project[] | undefined; // undefined байж болно гэдгийг тодорхойлсон
}

const filters = [
  { id: 'all', name: 'All' },
  { id: 'featured', name: 'Featured' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const filterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function ProjectList({ projects }: ProjectListProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // projects undefined эсвэл null байвал хоосон массив буцаана
  const filteredProjects = (projects ?? []).filter((project) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'featured') return project.featured;
    return true;
  });

  return (
    <section className="bg-black text-white py-20 px-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Filter buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={containerVariants}
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
              }`}
              variants={filterVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Project Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-7xl mx-auto"
          variants={containerVariants}
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
<motion.div
  key={project.id}
  className="group flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800/50 hover:border-gray-700 transition-all duration-300 relative"
  variants={cardVariants}
  whileHover={{ scale: 1.15, boxShadow: "0 25px 35px -10px rgba(255, 255, 255, 0.3)" }} // Scale и Box shadow нэмсэн
>
  {/* Image section */}
  <div className="relative h-[350px] w-full overflow-hidden">
    {project.image ? (
      <Image
        src={project.image || '/project-placeholder.svg'}
        alt={project.title}
        width={500}
        height={350}
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.currentTarget.src = '/project-placeholder.svg';
        }}
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <span className="text-gray-400 font-medium">No Preview</span>
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
  </div>

  {/* Content section */}
  <div className="p-8 flex flex-col flex-grow relative z-20 bg-black max-w-4xl">
    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-gray-100 transition-colors">
      {project.title}
    </h3>
    <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
      {project.description}
    </p>

    {/* Tech Stack */}
    <div className="flex flex-wrap gap-3 mb-5">
      {project.technologies.map((tech) => (
        <span
          key={tech}
          className="px-4 py-1 text-xs font-medium bg-gray-800/80 text-gray-200 rounded-full border border-gray-700/50 group-hover:bg-gray-700 group-hover:text-white transition-all duration-300"
        >
          {tech}
        </span>
      ))}
    </div>

    {/* Links */}
    <div className="mt-auto flex items-center gap-4 pt-4 border-t border-gray-800">
      <Link
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:text-white hover:border-gray-600 transition-all duration-300"
      >
        <Github className="w-5 h-5" />
        <span>GitHub</span>
      </Link>
      {project.liveUrl && (
        <Link
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Live</span>
        </Link>
      )}
    </div>
  </div>
</motion.div>



            ))
          ) : (
            <motion.p 
              className="col-span-full text-center text-gray-500 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No projects found matching the selected filter.
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}