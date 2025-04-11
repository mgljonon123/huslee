'use client';

import { useEffect, useState } from 'react';
import { Code2, Database, Layout, Server, Download, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const skillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) throw new Error('Failed to fetch about data');
        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        console.error('Error:', err);
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
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-black rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-black py-8"
      >
        {error}
      </motion.div>
    );
  }

  if (!aboutData) return null;

  const skills = [
    { name: 'React', icon: <Code2 className="w-5 h-5" /> },
    { name: 'Next.js', icon: <Layout className="w-5 h-5" /> },
    { name: 'Node.js', icon: <Server className="w-5 h-5" /> },
    { name: 'TypeScript', icon: <Code2 className="w-5 h-5" /> },
    { name: 'MongoDB', icon: <Database className="w-5 h-5" /> },
    { name: 'Tailwind CSS', icon: <Layout className="w-5 h-5" /> },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }} // Scroll болгонд trigger хийнэ
      variants={textVariants}
      className="bg-white text-black py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          className="text-center mb-16"
          variants={textVariants}
        >
          <h2 className="text-5xl font-bold mb-4">
            About Me
          </h2>
          <p className="text-xl max-w-4xl mx-auto">
            A brief introduction to my background, passion for development, and key skills.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          variants={textVariants}
        >
          <div className="bg-gray-100 p-10 rounded-2xl shadow-xl border border-gray-200 space-y-6 w-full max-w-[700px]">
            <motion.div
              variants={textVariants}
              className="prose text-black max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutData.bio }}
            />

            <motion.div className="text-black space-y-3" variants={textVariants}>
              {aboutData.location && (
                <p><span className="mr-2">📍</span>{aboutData.location}</p>
              )}
              {aboutData.email && (
                <p><span className="mr-2">✉️</span>{aboutData.email}</p>
              )}
            </motion.div>

            <motion.div 
              className="flex gap-6 pt-2"
              variants={textVariants}
            >
              {aboutData.socialLinks?.github && (
                <a href={aboutData.socialLinks.github} target="_blank" className="hover:text-gray-600 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {aboutData.socialLinks?.linkedin && (
                <a href={aboutData.socialLinks.linkedin} target="_blank" className="hover:text-gray-600 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {aboutData.socialLinks?.twitter && (
                <a href={aboutData.socialLinks.twitter} target="_blank" className="hover:text-gray-600 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </motion.div>

            {aboutData.resumeUrl && (
              <motion.div 
                className="pt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={textVariants}
              >
                <Link
                  href={aboutData.resumeUrl}
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </Link>
              </motion.div>
            )}

            <motion.div className="pt-6" variants={textVariants}>
              <h3 className="text-2xl font-semibold mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    variants={skillVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full text-black border border-gray-300 hover:bg-gray-300 transition-colors"
                  >
                    {skill.icon}
                    <span>{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="relative h-96 w-96 md:h-[500px] md:w-[500px] mx-auto md:mx-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200">
              <Image
                src={aboutData.profileImage || '/profile-placeholder.svg'}
                alt="Profile"
                width={500}
                height={500}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}