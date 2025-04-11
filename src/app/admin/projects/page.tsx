'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

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

// Define a more specific type for the form data
interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  image: string | null;
  technologies: string[] | string; // Allow both array and string during input
  githubUrl: string;
  liveUrl?: string | null;
  featured?: boolean;
  order?: number;
}

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  image: null,
  technologies: [], // Start with empty array
  githubUrl: '',
  liveUrl: '',
  featured: false,
  order: 0
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  // Use the more specific type for formData state
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  // Function to get token from cookie
  const getToken = () => {
    // Try to get token from js-cookie first
    const tokenFromJsCookie = Cookies.get('token');
    if (tokenFromJsCookie) return tokenFromJsCookie;
    
    // Try to get token from localStorage
    if (typeof window !== 'undefined') {
      const tokenFromLocalStorage = localStorage.getItem('token');
      if (tokenFromLocalStorage) return tokenFromLocalStorage;
    }
    
    // Fallback to document.cookie if js-cookie doesn't find it
    const tokenFromDocCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
      
    return tokenFromDocCookie || null;
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/projects', {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    setEditingProject(null);
    setFormData(initialFormData); // Reset with initial state
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    // Convert Project to ProjectFormData, ensuring technologies is array
    setFormData({ 
      ...project, 
      technologies: Array.isArray(project.technologies) ? project.technologies : [] 
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    const token = getToken();
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this project?')) {
      setError(null); // Clear previous errors
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // Add Authorization header
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete project');
        }
        await fetchProjects(); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    const method = editingProject ? 'PUT' : 'POST';
    const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';

    let technologiesArray: string[] = [];
    const techInput = formData.technologies;
    if (Array.isArray(techInput)) {
        technologiesArray = techInput;
    } else if (typeof techInput === 'string') { // Now this check should be safer
        technologiesArray = techInput.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    // Prepare data for API (ensure technologies is array of strings)
    const dataToSend = {
      ...formData,
      id: editingProject ? editingProject.id : undefined, // Remove id if creating
      technologies: technologiesArray
    };
    // Remove id from dataToSend if it's a new project
    if (!editingProject) {
        delete dataToSend.id;
    }

    setError(null); // Clear previous errors before submitting
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add Authorization header
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingProject ? 'update' : 'create'} project`);
      }

      setIsModalOpen(false);
      await fetchProjects();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during submission');
    }
  };

  return (
    <div>
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-light tracking-widest mb-8 uppercase">
          Projects
        </h1>
        <p className="text-sm tracking-wider text-gray-400 max-w-lg mb-12">
          MANAGE YOUR PORTFOLIO PROJECTS AND SHOWCASE YOUR WORK
        </p>
      </motion.div>

      <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-t border-white animate-spin rounded-full"></div>
            </div>
          ) : error ? (
            <div className="border border-gray-800 px-6 py-4 text-white" role="alert">
              <span className="tracking-wider text-xs">ERROR</span>
              <span className="block mt-2 text-gray-400"> {error}</span>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button
                  onClick={handleAddProject}
                  className="px-6 py-2 border border-white/30 hover:bg-white/5 text-white text-xs tracking-widest transition-all duration-300"
                >
                  ADD NEW PROJECT
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 tracking-wider">NO PROJECTS FOUND</p>
                  <p className="text-sm text-gray-500 mt-2 tracking-wider">ADD YOUR FIRST PROJECT TO BEGIN</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group"
                    >
                      <div className="relative h-48">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            width={400}
                            height={192}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/project-placeholder.svg';
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <span className="text-gray-500 text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl tracking-wider uppercase font-light text-white mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 tracking-wider mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(project.technologies || []).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-sm bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-gray-400 hover:text-white transition-colors tracking-wider"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors tracking-wider"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-gray-800 max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl tracking-wider uppercase font-light text-white">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {error && (
              <div className="border border-gray-800 px-6 py-4 text-white mb-6" role="alert">
                <span className="tracking-wider text-xs">ERROR</span>
                <span className="block mt-2 text-gray-400"> {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                  placeholder="https://example.com/image.png"
                />
              </div>
              
              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                  Live URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.liveUrl || ''}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                />
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white text-xs tracking-widest"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-white text-white hover:bg-white/10 text-xs tracking-widest transition-colors"
                >
                  {editingProject ? 'SAVE CHANGES' : 'ADD PROJECT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 