'use client';

import { motion } from 'framer-motion';
import { 
  Star, 
  Briefcase, 
  Code, 
  MessageSquare, 
  Eye, 
  Plus, 
  CheckCircle, 
  ArrowRight,
  Github,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-300 mt-1">Welcome to your cosmic control center</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
          <span className="text-sm text-gray-300">Live</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-white/20 transition-all duration-300"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-white" />
                <span className="text-sm text-gray-300">0</span>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-white">Projects</h3>
            <p className="mt-1 text-sm text-gray-400">Total active projects</p>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-gray-700 to-gray-500"></div>
        </motion.div>

        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-white/20 transition-all duration-300"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-white" />
                <span className="text-sm text-gray-300">0</span>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-white">Skills</h3>
            <p className="mt-1 text-sm text-gray-400">Technical abilities</p>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-gray-700 to-gray-500"></div>
        </motion.div>

        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-white/20 transition-all duration-300"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-white" />
                <span className="text-sm text-gray-300">3</span>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-white">Messages</h3>
            <p className="mt-1 text-sm text-gray-400">Unread messages</p>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-gray-700 to-gray-500"></div>
        </motion.div>

        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-white/20 transition-all duration-300"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-white" />
                <span className="text-sm text-gray-300">0</span>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-white">Profile Views</h3>
            <p className="mt-1 text-sm text-gray-400">Total visitors</p>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-gray-700 to-gray-500"></div>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-lg"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <div className="flex items-center space-x-1 text-white text-sm">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-white">
                    New project <span className="font-medium text-white">E-Commerce Platform</span> added
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-white">
                    Updated <span className="font-medium text-white">About Me</span> section
                  </p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Featured Projects
            </h2>
            <Link href="/admin/projects" className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-white/20 transition-all duration-300"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
                >
                  <div className="relative h-48">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={400}
                        height={192}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-gray-800/50 text-white rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 