'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AboutData {
  id?: string;
  bio: string;
  profileImage: string;
  resumeUrl?: string;
  email: string;
  location?: string;
  socialLinks?: any;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData>({
    bio: '',
    profileImage: '/profile-placeholder.svg',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AboutData>({
    bio: '',
    profileImage: '/profile-placeholder.svg',
    email: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setIsLoading(true);
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch('/api/about', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch about data');
      }
      
      const data = await response.json();
      
      // If we got data, use it; otherwise use default values
      if (data) {
        setAboutData(data);
        setFormData(data);
      } else {
        // Set default values if no data was returned
        const defaultData = {
          bio: 'Welcome to my portfolio! I am a passionate developer with expertise in web technologies.',
          profileImage: '/profile-placeholder.svg',
          email: 'your.email@example.com',
          location: 'Your Location',
          resumeUrl: '',
          socialLinks: {},
        };
        setAboutData(defaultData);
        setFormData(defaultData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('Failed to load about data. Please try again later.');
      
      // Set default values in case of error
      const defaultData = {
        bio: 'Welcome to my portfolio! I am a passionate developer with expertise in web technologies.',
        profileImage: '/profile-placeholder.svg',
        email: 'your.email@example.com',
        location: 'Your Location',
        resumeUrl: '',
        socialLinks: {},
      };
      setAboutData(defaultData);
      setFormData(defaultData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update about data');
      }

      const data = await response.json();
      setAboutData(data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating about data:', err);
      alert('Failed to update about data. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          About Me Management
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Cancel Editing' : 'Edit About Me'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative h-32 w-32">
                    <img
                      src={imagePreview || formData.profileImage}
                      alt="Profile"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      onError={(e) => { 
                        console.error('Image loading error:', e);
                        e.currentTarget.src = '/profile-placeholder.svg'; 
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      dark:file:bg-blue-900 dark:file:text-blue-200
                      hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.resumeUrl || ''}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Links (JSON format)
                </label>
                <textarea
                  value={formData.socialLinks ? JSON.stringify(formData.socialLinks, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      const socialLinks = e.target.value ? JSON.parse(e.target.value) : null;
                      setFormData({ ...formData, socialLinks });
                    } catch (err) {
                      // Invalid JSON, but we'll let the user continue typing
                    }
                  }}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder='{"github": "https://github.com/username", "linkedin": "https://linkedin.com/in/username"}'
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-32 w-32">
                  <Image
                    src={aboutData.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Click "Edit About Me" to update your profile information.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Bio
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {aboutData.bio}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Email:</span> {aboutData.email}
                  </p>
                  {aboutData.location && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Location:</span> {aboutData.location}
                    </p>
                  )}
                  {aboutData.resumeUrl && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Resume:</span>{' '}
                      <a 
                        href={aboutData.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Resume
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {aboutData.socialLinks && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Social Links
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(aboutData.socialLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 