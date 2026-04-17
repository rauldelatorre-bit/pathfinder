import React, { useState } from 'react';
import { RollResult, rollDice } from '../lib/dice';
import { Card } from './ui/Shared';
import { Shield, Dice6, Zap, Trash2, History } from 'lucide-react';

export const DiceRoller = ({ history, onRoll }: { history: RollResult[]; onRoll: (res: RollResult) => void }) => {
  const [expr, setExpr] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced' | 'history'>('quick');

  const handleRoll = (e: string, label?: string) => {
    const res = rollDice(e, label);
    onRoll(res);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-surface-container rounded-xl p-1">
        {['quick', 'advanced', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "flex-1 py-3 px-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all",
              activeTab === tab ? "bg-white text-primary shadow-sm" : "text-black/40"
            )}
          >
            {tab === 'quick' ? 'Rápido' : tab === 'advanced' ? 'Avanzado' : 'Historial'}
          </button>
        ))}
      </div>

      {activeTab === 'quick' && (
        <div className="grid grid-cols-4 gap-3">
          {[4, 6, 8, 10, 12, 20, 100].map(sides => (
            <button
              key={sides}
              onClick={() => handleRoll(`1d${sides}`, `Dado d${sides}`)}
              className="aspect-square flex flex-col items-center justify-center bg-white border border-primary/10 rounded-2xl shadow-sm active:scale-90 transition-transform hover:bg-primary/5"
            >
              <Dice6 className="w-6 h-6 text-primary mb-1" />
              <span className="font-bold text-sm">d{sides}</span>
            </button>
          ))}
        </div>
      )}

      {activeTab === 'advanced' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold opacity-50">Expresión (e.g. 2d6+4)</span>
            <input 
              className="w-full bg-white border border-primary/10 rounded-xl p-4 text-xl font-mono text-primary outline-none focus:ring-1 focus:ring-primary"
              value={expr}
              onChange={e => setExpr(e.target.value)}
              placeholder="1d20 + 5"
            />
          </div>
          <button 
            onClick={() => handleRoll(expr, 'Tirada Avanzada')}
            disabled={!expr}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 active:scale-[0.98]"
          >
            Tirar Dados
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
          {history.length === 0 && <p className="text-center py-8 opacity-40 italic">Aún no hay tiradas.</p>}
          {history.map((h, i) => (
            <div key={i} className="bg-white border border-primary/5 p-3 rounded-xl flex justify-between items-center shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold opacity-40 uppercase">{h.label || 'Tirada'}</span>
                <span className="text-sm font-medium">{h.expression}</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-2xl font-serif font-black text-primary">{h.total}</span>
                 <span className="text-[8px] opacity-30">{new Date(h.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          )).reverse()}
        </div>
      )}

      {/* Result Display at Top if exists */}
      {history.length > 0 && activeTab !== 'history' && (
        <div className="animate-in zoom-in-95 duration-200">
          <Card className="bg-primary/5 border-primary/20 p-6 text-center">
             <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 block">Resultado</span>
             <span className="text-6xl font-serif font-black text-primary leading-none block mb-2">{history[history.length-1].total}</span>
             <span className="text-sm opacity-60 font-medium">{history[history.length-1].expression} ({history[history.length-1].rolls.map(r => r.values.join('+')).join(', ')})</span>
          </Card>
        </div>
      )}
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
