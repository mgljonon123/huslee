'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.add('animate-fade-in');
    }
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="text-center">
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Your Name
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I&apos;m a passionate developer who loves building beautiful and functional web applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#contact"
              className="btn-primary group flex items-center gap-2"
            >
              Contact Me
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/resume.pdf"
              className="btn-secondary group flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
          <div className="w-1 h-3 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
} 