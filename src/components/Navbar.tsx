import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-black shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-extrabold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
          Portfolio
        </Link>
        <div className="space-x-6 md:space-x-8">
          <Link href="/#about" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">About</Link>
          <Link href="/#skills" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">Skills</Link>
          <Link href="/#projects" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">Projects</Link>
          <Link href="/#contact" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 