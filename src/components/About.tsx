'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Code2, Database, Layout, Server, Download } from 'lucide-react';
import Link from 'next/link';

interface AboutData {
  bio: string;
  profileImage: string;
  resumeUrl: string | null;
  email: string;
  location: string | null;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    [key: string]: string | undefined;
  } | null;
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) {
          throw new Error('Failed to fetch about data');
        }
        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError('Failed to load about information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 py-8">
        {error}
      </div>
    );
  }

  if (!aboutData) {
    return null;
  }

  const skills = [
    { name: 'React', icon: <Code2 className="w-5 h-5 text-primary" /> },
    { name: 'Next.js', icon: <Layout className="w-5 h-5 text-primary" /> },
    { name: 'Node.js', icon: <Server className="w-5 h-5 text-primary" /> },
    { name: 'TypeScript', icon: <Code2 className="w-5 h-5 text-primary" /> },
    { name: 'MongoDB', icon: <Database className="w-5 h-5 text-primary" /> },
    { name: 'Tailwind CSS', icon: <Layout className="w-5 h-5 text-primary" /> },
  ];

  return (
    <>
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          About Me
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A brief introduction to my background, passion for development, and key skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="space-y-6">
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: aboutData.bio }} />
          </div>
          
          <div className="space-y-4 pt-4">
            {aboutData.location && (
              <p className="text-gray-600 dark:text-gray-300">
                📍 {aboutData.location}
              </p>
            )}
            
            {aboutData.email && (
              <p className="text-gray-600 dark:text-gray-300">
                ✉️ {aboutData.email}
              </p>
            )}

            {aboutData.socialLinks && (
              <div className="flex gap-4">
                {Object.entries(aboutData.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {aboutData.resumeUrl && (
            <div className="pt-6">
              <Link
                href={aboutData.resumeUrl}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark/90 transition duration-300 ease-in-out shadow-md transform hover:-translate-y-0.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </Link>
            </div>
          )}
        </div>
        
        <div className="relative group flex justify-center md:justify-end">
           <div className="relative h-80 w-80 md:h-96 md:w-96 overflow-hidden rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
             <img
               src={aboutData.profileImage || '/profile-placeholder.svg'}
               alt="Profile Picture"
               className="absolute inset-0 w-full h-full object-cover"
               onError={(e) => { 
                 e.currentTarget.src = '/profile-placeholder.svg'; 
               }}
             />
           </div>
        </div>
      </div>
    </>
  );
} 