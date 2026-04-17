import React, { useState } from 'react';
import { Character, Weapon, Condition } from '../../types';
import { Card, Stepper, Modal } from '../ui/Shared';
import { calculateACTotal, calculateSaveTotal, calculateWeaponAtk } from '../../lib/calculations';
import { Sword, Shield, Heart, Activity, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { CONDITIONS } from '../../constants';

export const CombatScreen = ({ character, onUpdate, onRoll }: { character: Character; onUpdate: (u: Partial<Character>) => void; onRoll: (expr: string, label: string) => void }) => {
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const ac = calculateACTotal(character);
  const hpPercent = (character.hp.current / character.hp.max) * 100;

  const toggleCondition = (condName: string, description: string) => {
    const exists = character.defenses.conditions.find(c => c.name === condName);
    if (exists) {
      onUpdate({
        defenses: {
          ...character.defenses,
          conditions: character.defenses.conditions.filter(c => c.name !== condName)
        }
      });
    } else {
      onUpdate({
        defenses: {
          ...character.defenses,
          conditions: [...character.defenses.conditions, { name: condName, value: 1, description }]
        }
      });
    }
  };

  const updateConditionValue = (name: string, val: number) => {
    onUpdate({
      defenses: {
        ...character.defenses,
        conditions: character.defenses.conditions.map(c => c.name === name ? { ...c, value: val } : c)
      }
    });
  };

  const addWeapon = () => {
    const newWeapon: Weapon = {
      id: uuidv4(),
      name: 'Nueva Arma',
      type: 'Marcial',
      traits: [],
      group: '',
      runes: '',
      prof: 0,
      attribute: 'str',
      atkOther: 0,
      damage: '1d8',
      damageType: 'C',
      extraDamage: '',
      critTraits: [],
      range: '',
      ammo: '',
      notes: ''
    };
    onUpdate({ weapons: [...character.weapons, newWeapon] });
  };

  const removeWeapon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ weapons: character.weapons.filter(w => w.id !== id) });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center p-6 border-2 border-primary/20 bg-primary/[0.02]">
          <Shield className="w-8 h-8 text-primary mb-2" />
          <span className="text-4xl font-serif font-black text-primary">{ac}</span>
          <span className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Defensa (CA)</span>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6 border-2 border-secondary/20 bg-secondary/[0.02]">
          <Heart className="w-8 h-8 text-primary mb-2" />
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-black">{character.hp.current}</span>
            <span className="text-xs opacity-50">/ {character.hp.max}</span>
          </div>
          <div className="w-full h-1 bg-black/5 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-primary" style={{ width: `${hpPercent}%` }} />
          </div>
          <Stepper 
            value={character.hp.current} 
            onChange={val => onUpdate({ hp: { ...character.hp, current: val } })}
            max={character.hp.max}
            min={0}
            className="mt-2 scale-90"
          />
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['fort', 'ref', 'will'] as const).map(key => (
          <Card key={key} className="p-3 text-center active:bg-primary/5 transition-colors" onClick={() => onRoll(`1d20 + ${calculateSaveTotal(key, character)}`, key.toUpperCase())}>
            <span className="text-[10px] uppercase font-bold opacity-50 block mb-1">{key === 'fort' ? 'FORT' : key === 'ref' ? 'REF' : 'VOL'}</span>
            <span className="text-xl font-bold">+{calculateSaveTotal(key, character)}</span>
          </Card>
        ))}
      </div>

      <Card title="Estado y Condiciones" headerAction={<button onClick={() => setIsConditionModalOpen(true)} className="p-1 text-primary"><Plus className="w-5 h-5" /></button>}>
        <div className="flex flex-wrap gap-2">
          {character.defenses.conditions.map(c => (
            <div key={c.name} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
              <span>{c.name} {c.value}</span>
              <button onClick={() => toggleCondition(c.name, c.description)} className="opacity-50 hover:opacity-100">×</button>
            </div>
          ))}
          {character.defenses.conditions.length === 0 && <span className="text-sm opacity-30 italic">Sin condiciones activas.</span>}
        </div>
      </Card>

      <Card title="Ataques" headerAction={<button onClick={addWeapon} className="p-1 text-primary"><Plus className="w-5 h-5" /></button>}>
        <div className="flex flex-col gap-3">
          {character.weapons.map(weapon => {
            const atk = calculateWeaponAtk(weapon, character);
            return (
              <div key={weapon.id} className="p-4 bg-primary/5 rounded-xl border border-primary/5 flex flex-col gap-3 group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-primary">{weapon.name}</h4>
                    <div className="flex flex-wrap gap-1">
                      {weapon.traits.map(t => <span key={t} className="text-[9px] bg-white border border-primary/10 px-1 rounded uppercase font-bold opacity-60">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white px-3 py-1 rounded-lg border border-primary/10 shadow-sm font-bold text-primary">
                      +{atk}
                    </div>
                    <button onClick={(e) => removeWeapon(weapon.id, e)} className="p-1 opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onRoll(`1d20 + ${atk}`, `Ataque con ${weapon.name}`)}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
                  >
                    Atacar
                  </button>
                  <button 
                    onClick={() => onRoll(weapon.damage, `Daño de ${weapon.name}`)}
                    className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
                  >
                    Daño
                  </button>
                </div>
              </div>
            );
          })}
          {character.weapons.length === 0 && (
            <div className="text-center py-12 text-on-surface/30 italic">
               Aún no has añadido armas. Pulsa + para empezar.
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isConditionModalOpen} onClose={() => setIsConditionModalOpen(false)} title="Añadir Condición">
         <div className="grid grid-cols-2 gap-2">
           {CONDITIONS.map(c => {
             const isActive = !!character.defenses.conditions.find(active => active.name === c.name);
             return (
               <button 
                 key={c.name}
                 onClick={() => toggleCondition(c.name, c.description)}
                 className={cn(
                   "p-3 rounded-xl border text-left flex flex-col gap-1 transition-all",
                   isActive ? "bg-primary text-white border-primary shadow-md" : "bg-white border-primary/10 hover:bg-primary/5"
                 )}
               >
                 <span className="font-bold text-sm">{c.name}</span>
                 <span className={cn("text-[9px] line-clamp-2", isActive ? "text-white/80" : "opacity-50")}>{c.description}</span>
               </button>
             );
           })}
         </div>
      </Modal>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
