import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { IdentityScreen } from './components/screens/IdentityScreen';
import { CombatScreen } from './components/screens/CombatScreen';
import { SkillsScreen } from './components/screens/SkillsScreen';
import { MagicScreen } from './components/screens/MagicScreen';
import { InventoryScreen } from './components/screens/InventoryScreen';
import { NotesScreen } from './components/screens/NotesScreen';
import { DiceRoller } from './components/DiceRoller';
import { Modal } from './components/ui/Shared';
import { RollResult } from './lib/dice';
import { 
  User, 
  Swords, 
  Wand2, 
  Backpack, 
  ScrollText, 
  Dice6, 
  Settings as SettingsIcon,
  Star,
  Users
} from 'lucide-react';

export default function App() {
  const { 
    state, 
    activeCharacter, 
    updateCharacter, 
    addCharacter, 
    deleteCharacter, 
    setActiveCharacter, 
    updateSettings 
  } = useAppState();

  const [activeTab, setActiveTab] = useState('identidad');
  const [isDiceOpen, setIsDiceOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);

  const handleRoll = (res: RollResult) => {
    setRollHistory(prev => [...prev, res].slice(-50));
    setIsDiceOpen(true);
  };

  const handleQuickRoll = (expr: string, label: string) => {
    // We import rollDice here or pass it? Better to import it since it's a pure fn
    import('./lib/dice').then(({ rollDice }) => {
      handleRoll(rollDice(expr, label));
    });
  };

  if (!activeCharacter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-surface">
        <h1 className="font-serif text-3xl font-bold text-primary mb-4">Grimorio de Leyendas</h1>
        <p className="opacity-60 mb-8">No hay personajes guardados. ¡Crea uno nuevo para empezar!</p>
        <button 
          onClick={addCharacter}
          className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg"
        >
          Nuevo Personaje
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'identidad', icon: User, label: 'Identidad' },
    { id: 'combate', icon: Swords, label: 'Combate' },
    { id: 'habilidades', icon: Star, label: 'Habilidades' },
    ...(state.settings.showMagic ? [{ id: 'magia', icon: Wand2, label: 'Magia' }] : []),
    { id: 'inventario', icon: Backpack, label: 'Inventario' },
    { id: 'notas', icon: ScrollText, label: 'Notas' }
  ];

  return (
    <div className={state.settings.darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-surface flex flex-col pb-24 dark:bg-[#1F1B16]">
        
        {/* Top Bar */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-primary/10 flex items-center justify-between px-4 z-40 dark:bg-[#1F1B16]/80 no-print">
          <button 
            onClick={() => setIsSwitcherOpen(true)}
            className="flex items-center gap-3 active:opacity-50 transition-opacity max-w-[60%]"
          >
            <div className="w-8 h-8 rounded-full border border-primary overflow-hidden shrink-0">
              {activeCharacter.meta.avatar && <img src={activeCharacter.meta.avatar} alt="Avatar" className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="font-serif font-bold text-primary truncate w-full">{activeCharacter.meta.name}</span>
              <span className="text-[10px] uppercase font-bold text-on-surface/40 leading-none">Nvl {activeCharacter.meta.level} • {activeCharacter.meta.class}</span>
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-1 items-center">
              {[...Array(3)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => updateCharacter(activeCharacter.id, { meta: { ...activeCharacter.meta, heroPoints: i < activeCharacter.meta.heroPoints ? i : i + 1 } })}
                  className={cn("w-3 h-3 rounded-full border border-primary/30", i < activeCharacter.meta.heroPoints ? "bg-secondary" : "bg-transparent")}
                />
              ))}
            </div>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-primary">
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pt-20 pb-4 max-w-2xl mx-auto w-full">
           {activeTab === 'identidad' && <IdentityScreen character={activeCharacter} onUpdate={u => updateCharacter(activeCharacter.id, u)} />}
           {activeTab === 'combate' && <CombatScreen character={activeCharacter} onUpdate={u => updateCharacter(activeCharacter.id, u)} onRoll={handleQuickRoll} />}
           {activeTab === 'habilidades' && <SkillsScreen character={activeCharacter} onUpdate={u => updateCharacter(activeCharacter.id, u)} onRoll={handleQuickRoll} />}
           {activeTab === 'magia' && state.settings.showMagic && <MagicScreen character={activeCharacter} onUpdate={u => updateCharacter(activeCharacter.id, u)} onRoll={handleQuickRoll} />}
           {activeTab === 'inventario' && <InventoryScreen character={activeCharacter} onUpdate={u => updateCharacter(activeCharacter.id, u)} />}
           {activeTab === 'notas' && <NotesScreen character={activeCharacter} onUpdate={u => updateCharacter(activeCharacter.id, u)} />}
        </main>

        {/* FAB */}
        <button 
          onClick={() => setIsDiceOpen(true)}
          className="fixed bottom-28 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40 no-print"
        >
          <Dice6 className="w-8 h-8" />
        </button>

        {/* Bottom Tabs */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 border-t border-primary/10 flex items-center justify-around px-2 z-40 backdrop-blur-md dark:bg-[#1F1B16]/95 no-print">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center transition-all",
                activeTab === tab.id ? "text-primary scale-110" : "text-black/30"
              )}
            >
              <tab.icon className={cn("w-6 h-6 mb-1", activeTab === tab.id && "fill-primary/10")} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Modals */}
        <Modal isOpen={isDiceOpen} onClose={() => setIsDiceOpen(false)} title="Lanzador de Dados">
          <DiceRoller history={rollHistory} onRoll={handleRoll} />
        </Modal>

        <Modal isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} title="Personajes">
          <div className="flex flex-col gap-4">
            {state.characters.map(char => (
              <div 
                key={char.id} 
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-between transition-all",
                  char.id === activeCharacter.id ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-primary/10"
                )}
                onClick={() => { setActiveCharacter(char.id); setIsSwitcherOpen(false); }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-primary overflow-hidden">
                    {char.meta.avatar && <img src={char.meta.avatar} alt="Avatar" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">{char.meta.name}</span>
                    <span className="text-xs opacity-50">{char.meta.ancestry} {char.meta.class} • Nivel {char.meta.level}</span>
                  </div>
                </div>
                {char.id !== activeCharacter.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); if (confirm('¿Borrar?')) deleteCharacter(char.id); }}
                    className="p-2 text-red-500/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button 
              onClick={() => { addCharacter(); setIsSwitcherOpen(false); }}
              className="w-full py-4 border-2 border-dashed border-primary/20 rounded-xl text-primary font-bold hover:bg-primary/5"
            >
              + Nuevo Personaje
            </button>
          </div>
        </Modal>

        <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Ajustes">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold">Modo Oscuro</span>
                <span className="text-xs opacity-50">Próximamente...</span>
              </div>
              <input 
                type="checkbox" 
                checked={state.settings.darkMode} 
                onChange={e => updateSettings({ darkMode: e.target.checked })}
                className="w-10 h-6 bg-primary/20 rounded-full appearance-none relative checked:bg-primary transition-colors cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold">Mostrar Magia</span>
                <span className="text-xs opacity-50">Habilita la pestaña de Magia</span>
              </div>
              <input 
                type="checkbox" 
                checked={state.settings.showMagic} 
                onChange={e => updateSettings({ showMagic: e.target.checked })}
                className="w-10 h-6 bg-primary/20 rounded-full appearance-none relative checked:bg-primary transition-colors cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">Unidades</span>
              <div className="flex bg-surface-container rounded-lg p-1">
                <button 
                  onClick={() => updateSettings({ units: 'ft' })}
                  className={cn("px-4 py-1 rounded-md text-xs font-bold", state.settings.units === 'ft' ? "bg-white shadow-sm" : "opacity-40")}
                >
                  PIES
                </button>
                <button 
                  onClick={() => updateSettings({ units: 'm' })}
                  className={cn("px-4 py-1 rounded-md text-xs font-bold", state.settings.units === 'm' ? "bg-white shadow-sm" : "opacity-40")}
                >
                  METROS
                </button>
              </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="w-full bg-surface-container py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-primary/10"
            >
              <ScrollText className="w-5 h-5" /> Imprimir Hoja
            </button>
            <div className="text-center">
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Grimorio de Leyendas v1.0</p>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}

const DiceIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l10 5v10l-10 5-10-5V7l10-5z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
