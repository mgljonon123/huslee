'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, X } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  category: string;
  order: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    icon: '',
    level: 1,
    category: '',
    order: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch('/api/skills', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch skills');
      }
      
      const data = await response.json();
      setSkills(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      icon: '',
      level: 1,
      category: 'other',
      order: 0
    });
    setIsModalOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData(skill);
    setIsModalOpen(true);
  };

  const handleDeleteSkill = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }
        
        const response = await fetch(`/api/skills/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete skill');
        }

        setSkills(skills.filter(skill => skill.id !== id));
      } catch (err) {
        console.error('Error deleting skill:', err);
        alert('Failed to delete skill. Please try again later.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSkill 
        ? `/api/skills/${editingSkill.id}` 
        : '/api/skills';
      
      const method = editingSkill ? 'PUT' : 'POST';
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingSkill ? 'update' : 'create'} skill`);
      }

      const data = await response.json();
      
      if (editingSkill) {
        setSkills(skills.map(skill => 
          skill.id === editingSkill.id ? data : skill
        ));
      } else {
        setSkills([...skills, data]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error(`Error ${editingSkill ? 'updating' : 'creating'} skill:`, err);
      alert(`Failed to ${editingSkill ? 'update' : 'create'} skill. Please try again later.`);
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(skills.map(skill => skill.category)));
  
  // Filter skills by active category
  const filteredSkills = activeCategory 
    ? skills.filter(skill => skill.category === activeCategory)
    : skills;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-t border-white animate-spin rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-gray-800 px-6 py-4 text-white" role="alert">
        <span className="tracking-wider text-xs">ERROR</span>
        <span className="block mt-2 text-gray-400"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-light tracking-widest mb-8 uppercase">
          Skills
        </h1>
        <p className="text-sm tracking-wider text-gray-400 max-w-lg mb-12">
          MANAGE YOUR PROFESSIONAL EXPERTISE AND CAPABILITIES
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex overflow-x-auto pb-2 space-x-6">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs tracking-widest uppercase transition-all duration-300 pb-1 ${
                activeCategory === null 
                  ? 'text-white border-b border-white' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              ALL
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-xs tracking-widest uppercase transition-all duration-300 pb-1 whitespace-nowrap ${
                  activeCategory === category 
                    ? 'text-white border-b border-white' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleAddSkill}
            className="px-4 py-2 border border-white/30 hover:bg-white/5 text-white text-xs tracking-widest transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>ADD SKILL</span>
          </button>
        </div>
      </motion.div>

      {filteredSkills.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-sm tracking-wider">NO SKILLS FOUND</p>
          <p className="text-xs mt-2 text-gray-600">ADD YOUR FIRST SKILL TO BEGIN</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="bg-black p-6 relative group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                <button
                  onClick={() => handleEditSkill(skill)}
                  className="text-white/70 hover:text-white"
                  aria-label="Edit skill"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-white/70 hover:text-white"
                  aria-label="Delete skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-6">
                <span className="text-3xl block mb-4">{skill.icon}</span>
                <h3 className="text-lg tracking-wider uppercase font-light">
                  {skill.name}
                </h3>
                <div className="mt-4 text-xs tracking-wider text-gray-500 uppercase">
                  {skill.category}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 mt-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-px w-8 ${
                      index < skill.level
                        ? 'bg-white'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs text-gray-400">{skill.level}/5</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal with fashion styling */}
      {isModalOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-black border border-gray-800 max-w-md w-full p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl tracking-wider uppercase font-light">
                {editingSkill ? 'Edit Skill' : 'New Skill'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs tracking-wider text-gray-400 mb-2 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-gray-400 mb-2 uppercase">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-gray-400 mb-2 uppercase">
                  Proficiency (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.level || 1}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-gray-400 mb-2 uppercase">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category || 'other'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-gray-400 mb-2 uppercase">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full bg-black border border-gray-800 p-3 text-white focus:border-gray-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white text-xs tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-white text-white hover:bg-white/10 text-xs tracking-wider transition-colors"
                >
                  {editingSkill ? 'SAVE' : 'ADD'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}