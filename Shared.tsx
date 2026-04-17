import React from 'react';
import { cn, mod, profBonus } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  headerAction?: React.ReactNode;
  key?: string | number;
}

export const Card = ({ children, className, onClick, title, headerAction }: CardProps) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white dark:bg-[#1F1B16] border border-primary/10 rounded-xl shadow-sm overflow-hidden",
      onClick && "active:scale-[0.98] transition-transform cursor-pointer",
      className
    )}
  >
    {title && (
      <div className="px-4 py-2 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
        <h3 className="font-serif font-bold text-primary dark:text-secondary">{title}</h3>
        {headerAction}
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </div>
);

interface StepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export const Stepper = ({ value, onChange, min, max, label, className }: StepperProps) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (min !== undefined && value <= min) return;
    onChange(value - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (max !== undefined && value >= max) return;
    onChange(value + 1);
  };

  return (
    <div className={cn("flex flex-col gap-1 items-center", className)}>
      {label && <span className="text-[10px] uppercase font-bold text-on-surface/50">{label}</span>}
      <div className="flex items-center gap-2 bg-surface-container rounded-lg p-1">
        <button 
          onClick={handleDecrement}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-primary border border-primary/10 active:bg-primary/10 disabled:opacity-50"
          disabled={min !== undefined && value <= min}
        >
          -
        </button>
        <span className="w-8 text-center font-bold text-sm">{value}</span>
        <button 
          onClick={handleIncrement}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-primary border border-primary/10 active:bg-primary/10 disabled:opacity-50"
          disabled={max !== undefined && value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

export const ProfPill = ({ rank, onChange }: { rank: number; onChange?: (rank: number) => void }) => {
  const labels = ['N', 'E', 'Ex', 'M', 'L'];
  const handleClick = (e: React.MouseEvent) => {
    if (!onChange) return;
    e.stopPropagation();
    onChange((rank + 1) % 5);
  };

  return (
    <button 
      onClick={handleClick}
      className={cn(
        "px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
        rank === 0 ? "bg-on-surface/10 text-on-surface/40" : 
        rank === 1 ? "bg-primary/20 text-primary" :
        rank === 2 ? "bg-secondary/20 text-secondary" :
        rank === 3 ? "bg-secondary text-white" : "bg-primary text-white"
      )}
    >
      {labels[rank]}
    </button>
  );
};

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-surface border-b border-primary/10 p-4 flex justify-between items-center z-10">
          <h2 className="font-serif text-xl font-bold text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
