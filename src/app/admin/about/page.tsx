'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

  return (
    <div>
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-light tracking-widest mb-8 uppercase">
          About Me
        </h1>
        <p className="text-sm tracking-wider text-gray-400 max-w-lg mb-12">
          MANAGE YOUR PERSONAL INFORMATION AND PROFILE
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
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                      Profile Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative h-32 w-32">
                        <Image
                          src={imagePreview || formData.profileImage}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-gray-800 file:text-white
                          hover:file:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                      Location (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
                      Resume URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.resumeUrl || ''}
                      onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                      className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest text-gray-400 mb-2 uppercase">
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
                      className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                      placeholder='{"github": "https://github.com/username", "linkedin": "https://linkedin.com/in/username"}'
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white text-xs tracking-widest"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 border border-white text-white hover:bg-white/10 text-xs tracking-widest transition-colors"
                    >
                      SAVE CHANGES
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className="relative h-32 w-32">
                      <Image
                        src={aboutData.profileImage}
                        alt="Profile"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl tracking-wider uppercase font-light text-white">
                        Profile Information
                      </h2>
                      <p className="text-gray-400 mt-2 text-sm tracking-wider">
                        Click "Edit About Me" to update your profile information.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg tracking-wider uppercase font-light text-white mb-4">
                      Bio
                    </h3>
                    <p className="text-gray-400 tracking-wider">
                      {aboutData.bio}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg tracking-wider uppercase font-light text-white mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-400 tracking-wider">
                        <span className="text-white">Email:</span> {aboutData.email}
                      </p>
                      {aboutData.location && (
                        <p className="text-gray-400 tracking-wider">
                          <span className="text-white">Location:</span> {aboutData.location}
                        </p>
                      )}
                      {aboutData.resumeUrl && (
                        <p className="text-gray-400 tracking-wider">
                          <span className="text-white">Resume:</span>{' '}
                          <a 
                            href={aboutData.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            View Resume
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  {aboutData.socialLinks && (
                    <div>
                      <h3 className="text-lg tracking-wider uppercase font-light text-white mb-4">
                        Social Links
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(aboutData.socialLinks).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-sm bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 border border-white/30 hover:bg-white/5 text-white text-xs tracking-widest transition-all duration-300"
                    >
                      EDIT ABOUT ME
                    </button>
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