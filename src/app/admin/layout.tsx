'use client';

import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Briefcase, 
  Code, 
  MessageSquare, 
  Home,
  User,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Navigation items
const navigation = [
  { name: 'DASHBOARD', href: '/admin/dashboard', icon: <Home className="w-4 h-4" /> },
  { name: 'PROJECTS', href: '/admin/projects', icon: <Briefcase className="w-4 h-4" /> },
  { name: 'ABOUT', href: '/admin/about', icon: <User className="w-4 h-4" /> },
  { name: 'SKILLS', href: '/admin/skills', icon: <Code className="w-4 h-4" /> },
  { name: 'MESSAGES', href: '/admin/contacts', icon: <MessageSquare className="w-4 h-4" /> },
];

// Image grid items for fashion-style layout


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-light">
      {/* Fixed top navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center">
                <span className="text-white font-light text-xl tracking-widest">ADMIN PANEL</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-xs tracking-widest transition-all duration-300 ${
                      isActive 
                        ? 'text-white border-b border-white pb-1' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-white/80 hover:text-white transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <button 
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div 
          className="fixed inset-0 bg-black z-40 md:hidden pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-lg tracking-widest transition-all duration-300 ${
                    isActive 
                      ? 'text-white border-b border-white pb-1' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="pt-16">
        {/* Hero section with fashion aesthetic */}
        <div className="w-full bg-gradient-to-b from-black to-gray-900 px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-light tracking-wider mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              ADMIN INTERFACE
            </motion.h1>
            <motion.p 
              className="text-sm tracking-wider text-gray-400 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              WE ELEVATE MINIMALISM BRINGING THE ESSENCE OF DESIGN TO THE FOREFRONT OF FUNCTIONALITY
            </motion.p>
          </div>
        </div>



        {/* Main content container with design inspiration from fashion website */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Side column with navigation items in vertical list */}
            <div className="hidden md:block">
              <div className="sticky top-24">
                <h3 className="text-xs tracking-widest mb-6 text-gray-500">NAVIGATION</h3>
                <div className="flex flex-col space-y-6">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-xs tracking-widest transition-all duration-300 flex items-center space-x-3 ${
                          isActive 
                            ? 'text-white' 
                            : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="md:col-span-3">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8">
                {children}
              </div>
            </div>
          </div>
        </main>

        {/* Footer with fashion site styling */}
        <footer className="w-full bg-black border-t border-gray-900 px-4 py-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs tracking-widest mb-4">ABOUT</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Modern administration interface with minimalist aesthetic inspired by high-end fashion presentations.
              </p>
            </div>
            <div>
              <h4 className="text-xs tracking-widest mb-4">LINKS</h4>
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-xs text-gray-500 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-widest mb-4">CONTACT</h4>
              <p className="text-xs text-gray-500">
                admin@example.com<br />
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}