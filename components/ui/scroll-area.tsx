// app/components/ui/scroll-area.tsx
import React, { ReactNode } from 'react';

interface ScrollAreaProps {
  children: ReactNode;
  className?: string; // Add className to the props
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className }) => {
  return (
    <div className={`overflow-auto max-h-[400px] border border-gray-300 rounded-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export default ScrollArea;
