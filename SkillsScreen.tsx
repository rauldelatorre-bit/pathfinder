import React, { useState } from 'react';
import { Character, Skill } from '../../types';
import { Card, ProfPill } from '../ui/Shared';
import { calculateSkillTotal } from '../../lib/calculations';
import { Search, Star } from 'lucide-react';

export const SkillsScreen = ({ character, onUpdate, onRoll }: { character: Character; onUpdate: (u: Partial<Character>) => void; onRoll: (expr: string, label: string) => void }) => {
  const [search, setSearch] = useState('');

  const filteredSkills = character.skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const pinnedSkills = character.skills.filter(s => s.pinned);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
      skills: character.skills.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s)
    });
  };

  const updateProf = (id: string, rank: number) => {
    onUpdate({
      skills: character.skills.map(s => s.id === id ? { ...s, prof: rank } : s)
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        <input 
          className="w-full bg-white border border-primary/10 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-primary outline-none"
          placeholder="Buscar habilidad..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {pinnedSkills.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-serif font-bold text-primary flex items-center gap-2">
            <Star className="w-4 h-4 fill-primary" /> Favoritas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {pinnedSkills.map(s => (
              <Card key={s.id} className="p-3" onClick={() => onRoll(`1d20 + ${calculateSkillTotal(s, character.meta.level, character)}`, s.name)}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase opacity-50">{s.attribute}</span>
                  <button onClick={(e) => togglePin(s.id, e)}>
                    <Star className="w-3 h-3 fill-primary text-primary" />
                  </button>
                </div>
                <div className="flex justify-between items-end mt-1">
                  <span className="font-bold text-sm">{s.name}</span>
                  <span className="text-xl font-serif font-bold">+{calculateSkillTotal(s, character.meta.level, character)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="font-serif font-bold text-primary">Todas las Habilidades</h3>
        <Card className="p-0">
          <div className="divide-y divide-primary/5">
            {filteredSkills.map(s => (
              <div 
                key={s.id} 
                className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={() => onRoll(`1d20 + ${calculateSkillTotal(s, character.meta.level, character)}`, s.name)}
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => togglePin(s.id, e)}
                    className={cn("p-1", s.pinned ? "text-primary" : "text-black/10")}
                  >
                    <Star className={cn("w-4 h-4", s.pinned && "fill-primary")} />
                  </button>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{s.name}</span>
                    <span className="text-[10px] uppercase opacity-50">{s.attribute}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ProfPill rank={s.prof} onChange={(rank) => updateProf(s.id, rank)} />
                  <span className="text-lg font-serif font-bold w-12 text-right">
                    +{calculateSkillTotal(s, character.meta.level, character)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
