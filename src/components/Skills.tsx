'use client';

import { useEffect, useState } from 'react';
import { 
  Code2, 
  Database, 
  Layout, 
  Server, 
  Globe,
} from 'lucide-react';

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
        // Sort skills by order
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 py-8">
        {error}
      </div>
    );
  }

  const groupedSkills = groupSkillsByCategory(skills);
  const categories = Object.keys(groupedSkills).sort();
  const levelToPercentage = (level: number) => {
    return Math.min(Math.max(level, 0), 5) * 20;
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconComponents[iconName.toLowerCase() as keyof typeof iconComponents] || Code2;
    return <IconComponent className="w-5 h-5 text-primary" />;
  };

  return (
    <>
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Technical Skillset
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A breakdown of my proficiency across different technologies.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-2xl font-semibold capitalize text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
              {category}
            </h3>
            <div className="space-y-5">
              {groupedSkills[category].map((skill) => (
                <div key={skill.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getIconComponent(skill.icon)}
                      <span className="text-md font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary/70 to-primary dark:from-primary-dark/70 dark:to-primary-dark h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${levelToPercentage(skill.level)}%` }} 
                      role="progressbar"
                      aria-valuenow={levelToPercentage(skill.level)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name} proficiency`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 