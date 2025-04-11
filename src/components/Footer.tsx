import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} huslee bwl yhu. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 