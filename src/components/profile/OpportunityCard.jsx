import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Briefcase, Users } from 'lucide-react';

const typeConfig = {
  teammate: {
    icon: Users,
    label: 'Teammate',
    color: '#3f51b5'
  },
  hackathon: {
    icon: Calendar,
    label: 'Hackathon',
    color: '#00bcd4'
  },
  role: {
    icon: Briefcase,
    label: 'Role',
    color: '#9c27b0'
  }
};

const isCreatedToday = (createdAt) => {
  if (!createdAt) return false;

  const created = new Date(createdAt);
  const today = new Date();

  return (
    created.getDate() === today.getDate() &&
    created.getMonth() === today.getMonth() &&
    created.getFullYear() === today.getFullYear()
  );
};

export default function OpportunityCard({ opportunity, className }) {
  const {
    title,
    description,
    type,
    skills_needed = [],
    deadline,
    created_at,
    status
  } = opportunity;

  const config = typeConfig[type] || typeConfig.role;
  const Icon = config.icon;
  const isClosed = status === 'closed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative border transition-all duration-500 overflow-hidden ${isClosed
          ? 'bg-[#0a0a0a]/40 border-[#1f1f1f] opacity-50'
          : 'bg-[#0a0a0a] border-[#1f1f1f] hover:border-[#e8ff47]/30'
        } ${className || ''}`}
    >
      {/* "CLOSED" Badge */}
      {isClosed && (
        <div className="absolute top-3 right-3 z-20 bg-[#333] text-[#666] text-[9px] font-bold font-mono px-2 py-0.5">
          CLOSED
        </div>
      )}

      <div className="relative p-5 space-y-4">
        {/* Card Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#111] border border-[#1f1f1f] group-hover:border-[#e8ff47]/20 transition-colors">
            <Icon size={16} className="text-[#666] group-hover:text-[#e8ff47] transition-colors" style={{ color: config.color }} />
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-bold tracking-tight transition-colors ${isClosed ? 'text-[#444]' : 'text-white group-hover:text-[#e8ff47]'
              }`}>
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-[#444]">{config.label}</span>
              {deadline && (
                <>
                  <span className="text-[8px] text-[#333]">•</span>
                  <span className="text-[10px] font-mono text-[#444] flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs leading-relaxed line-clamp-2 min-h-[32px] ${isClosed ? 'text-[#333]' : 'text-[#666]'
          }`}>
          {description}
        </p>

        {/* Skills Needed */}
        {skills_needed.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills_needed.slice(0, 3).map(skill => (
              <span
                key={skill}
                className="text-[9px] font-mono text-[#444] border border-[#1f1f1f] px-1.5 py-0.5 hover:border-[#e8ff47]/30 hover:text-[#888] transition-colors"
              >
                {skill}
              </span>
            ))}
            {skills_needed.length > 3 && (
              <span className="text-[9px] font-mono text-[#333]">+{skills_needed.length - 3} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            <Target size={12} className="text-[#444]" />
            <span className="text-[10px] font-mono text-[#444]">
              {type === 'teammate' ? 'Looking for team' : type === 'hackathon' ? 'Hackathon event' : 'Open role'}
            </span>
          </div>
        </div>
      </div>

      {/* Subtle border line on bottom that grows on hover */}
      {!isClosed && (
        <div className="absolute bottom-0 left-0 h-[1px] bg-[#e8ff47] w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
      )}
    </motion.div>
  );
}
