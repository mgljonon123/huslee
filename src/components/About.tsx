'use client';

import Image from 'next/image';
import { Code2, Database, Layout, Server, Download } from 'lucide-react';
import Link from 'next/link';

export default function About() {
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
            <p>
              I'm a results-oriented Full Stack Developer based in [Your City/Country], driven by a passion for crafting efficient, scalable, and user-friendly web applications. My journey into the world of code began with a fascination for the web, evolving into a career dedicated to building impactful digital solutions.
            </p>
            <p>
              With expertise spanning both front-end and back-end development, I enjoy tackling complex problems and turning innovative ideas into reality. I thrive in collaborative environments and am constantly seeking opportunities to learn and grow within the ever-evolving tech landscape.
            </p>
          </div>
          
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <Code2 className="w-6 h-6 text-primary" />
              Core Technical Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm"
                >
                  {skill.icon} 
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/resume.pdf"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark/90 transition duration-300 ease-in-out shadow-md transform hover:-translate-y-0.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Resume
            </Link>
          </div>
        </div>
        
        <div className="relative group flex justify-center md:justify-end">
           <div className="relative h-80 w-80 md:h-96 md:w-96 overflow-hidden rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
             <Image
               src="/profile-placeholder.jpg"
               alt="Munkhtulga - Profile Picture"
               fill
               className="object-cover"
               sizes="(max-width: 768px) 320px, 384px"
               priority
             />
           </div>
        </div>
      </div>
    </>
  );
} 