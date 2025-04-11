'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch('/api/contact', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch contacts');
      }
      
      const data = await response.json();
      setContacts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete contact');
      }

      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact. Please try again later.');
    }
  };

  const toggleReadStatus = async (id: string, currentReadStatus: boolean) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ read: !currentReadStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update contact status');
      }

      const updatedContact = await response.json();
      setContacts(contacts.map(contact => 
        contact.id === id ? updatedContact : contact
      ));
    } catch (err) {
      console.error('Error updating contact status:', err);
      alert('Failed to update contact status. Please try again later.');
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
          Contact Messages
        </h1>
        <p className="text-sm tracking-wider text-gray-400 max-w-lg mb-12">
          MANAGE YOUR INCOMING MESSAGES AND COMMUNICATIONS
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
              <div className="flex justify-end">
                <button
                  onClick={fetchContacts}
                  className="px-6 py-2 border border-white/30 hover:bg-white/5 text-white text-xs tracking-widest transition-all duration-300"
                >
                  REFRESH MESSAGES
                </button>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 tracking-wider">NO MESSAGES FOUND</p>
                  <p className="text-sm text-gray-500 mt-2 tracking-wider">NO CONTACT MESSAGES HAVE BEEN RECEIVED YET</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`border border-gray-800 rounded-lg p-6 hover:bg-gray-900 transition-colors ${
                        !contact.read ? 'border-l-4 border-l-white' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg tracking-wider uppercase font-light text-white">
                            {contact.name}
                          </h3>
                          <p className="text-sm text-gray-400 tracking-wider mt-1">
                            {contact.email}
                          </p>
                          <p className="text-xs text-gray-500 tracking-wider mt-2">
                            {new Date(contact.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => toggleReadStatus(contact.id, contact.read)}
                            className={`px-4 py-2 text-xs tracking-widest rounded-lg transition-colors ${
                              contact.read 
                                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white' 
                                : 'bg-white text-black hover:bg-white/90'
                            }`}
                          >
                            {contact.read ? 'MARK AS UNREAD' : 'MARK AS READ'}
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="px-4 py-2 text-xs tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-400 tracking-wider whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 