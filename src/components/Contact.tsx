'use client';

import { useState, useEffect } from 'react';
import { Mail, MapPin, Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface AboutData {
  email: string;
  location: string | null;
  socialLinks: {
    [key: string]: string;
  } | null;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactInfo, setContactInfo] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) {
          throw new Error('Failed to fetch contact information');
        }
        const data = await response.json();
        setContactInfo(data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getContactItems = () => {
    if (!contactInfo) return [];

    const items = [];

    if (contactInfo.email) {
      items.push({
        icon: Mail,
        title: 'Email',
        content: contactInfo.email,
        link: `mailto:${contactInfo.email}`
      });
    }

    if (contactInfo.location) {
      items.push({
        icon: MapPin,
        title: 'Location',
        content: contactInfo.location,
        link: '#'
      });
    }

    return items;
  };

  return (
    <>
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Get In Touch
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Have a question or want to work together? Send me a message!
        </p>
        <p className="text-gray-400">
          I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div className="space-y-6">
           <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
             Contact Details
           </h3>
           {isLoading ? (
             <div className="flex justify-center items-center h-32">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
             </div>
           ) : (
             getContactItems().map((item) => (
               <a
                 key={item.title}
                 href={item.link}
                 target={item.link !== '#' ? "_blank" : undefined}
                 rel="noopener noreferrer"
                 className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200 group"
               >
                 <div className="flex-shrink-0 mt-1 p-2.5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary">
                   <item.icon className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
                   <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary-light break-words">
                     {item.content}
                   </p>
                 </div>
               </a>
             ))
           )}
           {contactInfo?.socialLinks && (
             <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
               <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                 Social Links
               </h4>
               <div className="flex gap-4">
                 {Object.entries(contactInfo.socialLinks).map(([platform, url]) => (
                   <a
                     key={platform}
                     href={url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                   >
                     {platform.charAt(0).toUpperCase() + platform.slice(1)}
                   </a>
                 ))}
               </div>
             </div>
           )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
             Send a Message
           </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 focus:border-primary dark:focus:border-primary outline-none transition duration-150 ease-in-out shadow-sm"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 focus:border-primary dark:focus:border-primary outline-none transition duration-150 ease-in-out shadow-sm"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/60 focus:border-primary dark:focus:border-primary outline-none transition duration-150 ease-in-out shadow-sm resize-none"
                placeholder="Your Message"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-900 ${ 
                isSubmitting
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark dark:hover:bg-primary-dark/90 transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="flex items-center justify-center p-3 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-700">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Message sent successfully! I'll be in touch soon.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center justify-center p-3 rounded-md bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-700">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
} 