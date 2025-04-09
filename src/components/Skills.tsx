'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Code2, 
  Database, 
  Layout, 
  Server, 
  Globe,
} from 'lucide-react';

interface Skill {
  name: string;
  icon: React.ReactNode;
  level: number;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
}

const skills: Skill[] = [
  { name: 'React', icon: <Code2 className="w-5 h-5 text-blue-500" />, level: 5, category: 'frontend' },
  { name: 'Next.js', icon: <Globe className="w-5 h-5 text-green-500" />, level: 4, category: 'frontend' },
  { name: 'Node.js', icon: <Server className="w-5 h-5 text-purple-500" />, level: 4, category: 'backend' },
  { name: 'TypeScript', icon: <Code2 className="w-5 h-5 text-sky-500" />, level: 4, category: 'frontend' },
  { name: 'MongoDB', icon: <Database className="w-5 h-5 text-emerald-500" />, level: 3, category: 'database' },
  { name: 'Tailwind CSS', icon: <Layout className="w-5 h-5 text-teal-500" />, level: 5, category: 'frontend' },
];
const groupSkillsByCategory = (skills: Skill[]) => {
  return skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as { [key in Skill['category']]: Skill[] });
};

export default function Skills() {
  const groupedSkills = groupSkillsByCategory(skills);
  const categories = Object.keys(groupedSkills) as Skill['category'][];
  const levelToPercentage = (level: number) => {
    return Math.min(Math.max(level, 0), 5) * 20;
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
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {skill.icon} 
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