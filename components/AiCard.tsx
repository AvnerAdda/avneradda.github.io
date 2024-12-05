import { ReactNode } from 'react';

interface AiCardProps {
  children: ReactNode;
  className?: string;
}

export default function AiCard({ children, className = '' }: AiCardProps) {
  return (
    <div 
      className={`
        relative p-[1px] rounded-2xl
        bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-teal-500/20
        hover:from-blue-500/30 hover:via-purple-500/30 hover:to-teal-500/30
        transition-all duration-300
        ${className}
      `}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 blur-xl" />
      
      <div className="relative rounded-2xl bg-gray-900/90 backdrop-blur-xl p-6">
        {children}
      </div>
    </div>
  );
} 