'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';

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
  const getToken = () => Cookies.get('token');

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/projects');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Projects Management
        </h1>
        <button
          onClick={handleAddProject}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Project
        </button>
      </div>

      {isLoading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={project.image || '/project-placeholder.png'}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => { e.currentTarget.src = '/project-placeholder.png'; }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="https://example.com/image.png"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  // Use formData.technologies directly, handle array/string in value
                  value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies}
                  // Update state, keeping it as string temporarily
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Live URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.liveUrl || ''}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null); // Clear error when closing modal
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 