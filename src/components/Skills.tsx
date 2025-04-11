'use client';

import { useEffect, useState } from 'react';
import { Code2, Database, Layout, Server, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  category: string;
  order: number;
}

const iconComponents = {
  code: Code2,
  database: Database,
  layout: Layout,
  server: Server,
  globe: Globe,
};

const groupSkillsByCategory = (skills: Skill[]) => {
  return skills.reduce((acc, skill) => {
    const category = skill.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as { [key: string]: Skill[] });
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const progressVariants = {
  hidden: { width: 0 },
  visible: (custom: number) => ({
    width: `${Math.min(Math.max(custom, 0), 5) * 20}%`,
    transition: { duration: 0.8, ease: "easeOut" }
  })
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch skills');
        }
        const data = await response.json();
        const sortedSkills = data.sort((a: Skill, b: Skill) => a.order - b.order);
        setSkills(sortedSkills);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-gray-400 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-500 py-8"
      >
        {error}
      </motion.div>
    );
  }

  const groupedSkills = groupSkillsByCategory(skills);
  const categories = Object.keys(groupedSkills).sort();

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconComponents[iconName.toLowerCase() as keyof typeof iconComponents] || Code2;
    return <IconComponent className="w-6 h-6 text-gray-400" />;
  };

  const getProgressColor = (level: number) => {
    const percentage = Math.min(Math.max(level, 0), 5) * 20;
    if (percentage <= 40) return 'from-red-500 to-red-300';
    if (percentage <= 70) return 'from-yellow-500 to-yellow-300';
    return 'from-green-500 to-green-300';
  };

  return (
    <section className="bg-black text-white py-20">
      <motion.div 
        className="max-w-5xl mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Technical Skillset
          </h2>
        </motion.div>

        <div className="space-y-16">
          {categories.map((category) => (
            <motion.div 
              key={category}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
            >
              <motion.h3 
                className="text-2xl font-semibold capitalize mb-6 pb-2 border-b border-gray-800"
                variants={itemVariants}
              >
                {category}
              </motion.h3>
              <div className="space-y-6">
                {groupedSkills[category].map((skill) => {
                  const percentage = Math.min(Math.max(skill.level, 0), 5) * 20;
                  return (
                    <motion.div 
                      key={skill.id}
                      variants={itemVariants}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getIconComponent(skill.icon)}
                          <span className="text-lg font-medium text-white group-hover:text-gray-300 transition-colors">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className={`bg-gradient-to-r ${getProgressColor(skill.level)} h-2 rounded-full`}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: false }}
                          variants={progressVariants}
                          custom={skill.level}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}