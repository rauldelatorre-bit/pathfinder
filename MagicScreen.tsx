import React from 'react';
import { Character } from '../../types';
import { Card, Stepper } from '../ui/Shared';
import { calculateACTotal } from '../../lib/calculations';
import { Wand2, Zap, LayoutGrid } from 'lucide-react';

export const MagicScreen = ({ character, onUpdate, onRoll }: { character: Character; onUpdate: (u: Partial<Character>) => void; onRoll: (expr: string, label: string) => void }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center p-6 bg-primary/5">
          <Wand2 className="w-6 h-6 text-primary mx-auto mb-2" />
          <span className="text-[10px] font-bold uppercase opacity-50 block">Ataque Mágico</span>
          <span className="text-4xl font-serif font-black">+8</span>
        </Card>
        <Card className="text-center p-6 bg-secondary/5">
          <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
          <span className="text-[10px] font-bold uppercase opacity-50 block">CD de Conjuro</span>
          <span className="text-4xl font-serif font-black">18</span>
        </Card>
      </div>

      <Card title="Puntos de Foco" headerAction={
        <div className="flex gap-1">
          {[...Array(character.spellcasting.focus.max)].map((_, i) => (
            <div 
              key={i} 
              className={cn("w-3 h-3 rounded-full border border-primary/20", i < character.spellcasting.focus.current ? "bg-primary" : "bg-transparent")}
            />
          ))}
        </div>
      }>
        <div className="flex justify-center">
          <Stepper 
            value={character.spellcasting.focus.current} 
            max={character.spellcasting.focus.max}
            onChange={val => onUpdate({ spellcasting: { ...character.spellcasting, focus: { ...character.spellcasting.focus, current: val } } })}
          />
        </div>
      </Card>

      <Card title="Espacios de Conjuro">
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rank => (
            <div key={rank} className="flex items-center justify-between p-2 rounded-lg bg-surface-container">
              <span className="font-bold text-sm">Rango {rank}</span>
              <div className="flex items-center gap-4">
                 <div className="flex gap-1">
                   {[...Array(4)].map((_, i) => (
                     <div key={i} className="w-4 h-4 border border-primary/20 rounded-sm bg-primary/5" />
                   ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Conjuros Preparados">
        <div className="text-center py-8 text-on-surface/40 italic">
          No tienes conjuros registrados aún.
        </div>
      </Card>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
