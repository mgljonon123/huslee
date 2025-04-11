'use client';

import { useEffect, useState } from 'react';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Link from 'next/link';
import CursorTrail from '@/components/CursorTrail';
import ScrollPathFollower from '@/components/ScrollPathFollower';

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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
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

    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <CursorTrail />
      <ScrollPathFollower />
      <section
  id="hero"
  className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left py-24 
             bg-gradient-to-r from-gray-800 to-black text-white relative z-10 
             border border-white/20 backdrop-blur-sm rounded-3xl overflow-hidden"
>
  <div className="absolute inset-0 bg-black opacity-30 z-0"></div> {/* Бүдэг фон */}
  <div className="max-w-3xl mx-auto px-4 relative z-10">
    <h1 className="mb-6 text-5xl md:text-6xl font-bold tracking-tighter">
      Сайн уу, би Чин Хүслэн
    </h1>
    <h2 className="mb-8 text-xl md:text-2xl font-normal text-gray-300">
      Full Stack Developer
    </h2>
    <p className="mb-12 text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
      Front-end-ийн гоо зүйн шийдлээс back-end-ийн бат бөх шийдэл хүртэл төгс тохиолдолыг бүтээж байна.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
      <Link
        href="/#projects"
        className="inline-flex items-center justify-center px-8 py-3 border border-white text-sm font-medium text-white hover:bg-white hover:text-black transition duration-300"
      >
        Проектуудыг үзэх
      </Link>
      <Link
        href="/#contact"
        className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white hover:underline transition duration-300"
      >
        Холбогдох
      </Link>
    </div>
    <div className="flex justify-center space-x-8">
      {/* Icons */}
    </div>
  </div>
</section>


<section id="about" className="py-20 bg-black text-white relative z-10">
  <div className="max-w-12xl mx-auto px-4 md:px-8">
    <div className="border border-white/10 rounded-2xl backdrop-blur-sm p-8 md:p-12">
      <About />
    </div>
  </div>
</section>


      <section id="skills" className="py-20 bg-black text-white relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skills />
        </div>
      </section>

      <section id="projects" className="py-20 bg-black text-white relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Projects projects={projects} />
        </div>
      </section>

      <section id="contact" className="py-20 bg-black text-white relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Contact />
        </div>
      </section>

      {/* Scroll Indicator Circles */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        {['hero', 'about', 'skills', 'projects', 'contact'].map((section) => (
          <div
            key={section}
            className={`w-4 h-4 rounded-full bg-white cursor-pointer transition-all duration-300 ${
              activeSection === section ? 'scale-150' : 'scale-100'
            }`}
            onClick={() => {
              document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
            }}
          ></div>
        ))}
      </div>
    </>
  );
}
