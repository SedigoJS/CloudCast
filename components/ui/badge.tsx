// components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: string; // Optional if you're using a 'variant' prop
}

const Badge: React.FC<BadgeProps> = ({ children, className, variant }) => {
  const variantStyles = variant === 'primary' 
    ? 'bg-blue-600 text-white' 
    : variant === 'secondary' 
    ? 'bg-gray-300 text-black' 
    : 'bg-gray-200 text-black';

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
