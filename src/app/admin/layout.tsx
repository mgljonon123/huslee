'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Projects', href: '/admin/projects' },
  { name: 'About Me', href: '/admin/about' },
  { name: 'Skills', href: '/admin/skills' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register';

  const handleLogout = () => {
    // Clear cookie
    document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {!isAuthPage && (
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
                    Admin Panel
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? 'border-blue-500 text-gray-900 dark:text-white'
                          : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={`${isAuthPage ? '' : 'max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'}`}>
        {children}
      </main>
    </div>
  );
} 