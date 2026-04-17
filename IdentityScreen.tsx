import React from 'react';
import { Character } from '../../types';
import { Card, Stepper } from '../ui/Shared';
import { Camera, Plus } from 'lucide-react';

export const IdentityScreen = ({ character, onUpdate }: { character: Character; onUpdate: (u: Partial<Character>) => void }) => {
  const updateMeta = (updates: Partial<Character['meta']>) => {
    onUpdate({ meta: { ...character.meta, ...updates } });
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMeta({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <label className="relative cursor-pointer group">
          <div className="w-24 h-24 rounded-full border-2 border-primary overflow-hidden shadow-lg bg-white flex items-center justify-center">
            {character.meta.avatar ? (
              <img src={character.meta.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-primary/20" />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Plus className="text-white" />
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleAvatar} />
        </label>
        
        <div className="flex flex-col items-center">
          <input 
            className="font-serif text-2xl font-bold text-center bg-transparent border-none focus:ring-0 text-primary"
            value={character.meta.name}
            onChange={e => updateMeta({ name: e.target.value })}
            placeholder="Nombre del Personaje"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium opacity-60">Nivel</span>
            <Stepper 
              value={character.meta.level} 
              onChange={val => updateMeta({ level: val })} 
              min={1} 
              max={20}
              className="flex-row items-center !gap-2"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Características">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(character.attributes).map(([key, attr]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold uppercase opacity-50">{key}</span>
                <input 
                  type="number"
                  className="w-12 h-12 rounded-lg bg-primary/5 border-none text-center font-bold text-lg"
                  value={attr.score}
                  onChange={e => {
                    const score = parseInt(e.target.value) || 10;
                    onUpdate({ attributes: { ...character.attributes, [key]: { ...attr, score } } });
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Detalles">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase opacity-50">Ancestría y Herencia</span>
              <input 
                className="bg-transparent border-b border-primary/10 focus:border-primary outline-none py-1"
                value={`${character.meta.ancestry} ${character.meta.heritage}`}
                onChange={e => updateMeta({ ancestry: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase opacity-50">Trasfondo</span>
              <input 
                className="bg-transparent border-b border-primary/10 focus:border-primary outline-none py-1"
                value={character.meta.background}
                onChange={e => updateMeta({ background: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase opacity-50">Clase</span>
              <input 
                className="bg-transparent border-b border-primary/10 focus:border-primary outline-none py-1"
                value={character.meta.class}
                onChange={e => updateMeta({ class: e.target.value })}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card title="Velocidades">
        <div className="flex flex-wrap gap-6 justify-around">
          {Object.entries(character.speeds).filter(([k]) => k !== 'custom').map(([key, value]) => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase opacity-50">{key}</span>
              <Stepper 
                value={value as number} 
                onChange={val => onUpdate({ speeds: { ...character.speeds, [key]: val } })} 
                className="scale-75"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Idiomas">
        <div className="flex flex-wrap gap-2">
          {character.languages.map((lang, i) => (
            <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold border border-secondary/20">
              {lang}
            </span>
          ))}
          <button 
            onClick={() => {
              const res = prompt('Nuevo idioma:');
              if (res) onUpdate({ languages: [...character.languages, res] });
            }}
            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20"
          >
            + Añadir
          </button>
        </div>
      </Card>
    </div>
  );
};
