import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { BacklogItem } from '../types';

interface BacklogContainerProps {
  id: string;
  items: BacklogItem[];
  children: React.ReactNode;
  className?: string;
}

const BacklogContainer: React.FC<BacklogContainerProps> = ({ id, items, children, className }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 transition-colors duration-200 ${className} ${
        isOver ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{ position: 'relative', zIndex: 1 }} // Ensure container has a z-index context
    >
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-sm text-gray-500">Drop items here</p>
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
};

export default BacklogContainer;
