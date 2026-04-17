import React, { useState } from 'react';
import { Character } from '../../types';
import { Card } from '../ui/Shared';
import { BookOpen, Trophy, Info, MessagesSquare } from 'lucide-react';

export const NotesScreen = ({ character, onUpdate }: { character: Character; onUpdate: (u: Partial<Character>) => void }) => {
  const [activeTab, setActiveTab] = useState<'feats' | 'actions' | 'campaign'>('feats');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
      <div className="flex bg-surface-container rounded-xl p-1">
        {[
          { id: 'feats', icon: Trophy, label: 'Dotes' },
          { id: 'actions', icon: Activity, label: 'Acciones' },
          { id: 'campaign', icon: BookOpen, label: 'Campaña' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex flex-col items-center py-2 rounded-lg transition-all",
              activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-black/40"
            )}
          >
            <tab.icon className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold uppercase">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'feats' && (
        <div className="flex flex-col gap-4">
          <Card title="Dotes de Ascendencia">
            <textarea 
               className="w-full bg-surface-container/30 border-none rounded-lg p-3 text-sm min-h-[100px] outline-none"
               placeholder="Escribe tus dotes aquí..."
               value={character.feats.ancestry.join('\n')}
               onChange={e => onUpdate({ feats: { ...character.feats, ancestry: e.target.value.split('\n') } })}
            />
          </Card>
          <Card title="Dotes de Clase">
            <textarea 
               className="w-full bg-surface-container/30 border-none rounded-lg p-3 text-sm min-h-[100px] outline-none"
               placeholder="Escribe tus dotes aquí..."
               value={character.feats.class.join('\n')}
               onChange={e => onUpdate({ feats: { ...character.feats, class: e.target.value.split('\n') } })}
            />
          </Card>
        </div>
      )}

      {activeTab === 'actions' && (
        <Card title="Acciones y Reacciones">
          <textarea 
             className="w-full bg-surface-container/30 border-none rounded-lg p-3 text-sm min-h-[300px] outline-none"
             placeholder="Registra tus acciones personalizadas..."
             value={character.feats.actions1.join('\n')}
             onChange={e => onUpdate({ feats: { ...character.feats, actions1: e.target.value.split('\n') } })}
          />
        </Card>
      )}

      {activeTab === 'campaign' && (
        <Card title="Crónicas de Campaña">
          <textarea 
             className="w-full bg-surface-container/30 border-none rounded-lg p-3 text-sm min-h-[500px] outline-none"
             placeholder="Tus aventuras comienzan aquí..."
             value={character.feats.campaignNotes}
             onChange={e => onUpdate({ feats: { ...character.feats, campaignNotes: e.target.value } })}
          />
        </Card>
      )}
    </div>
  );
};

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
