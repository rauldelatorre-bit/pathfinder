import React from 'react';
import { Character, InventoryItem } from '../../types';
import { Card, Stepper } from '../ui/Shared';
import { calculateBulk } from '../../lib/calculations';
import { Wallet, Package, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const InventoryScreen = ({ character, onUpdate }: { character: Character; onUpdate: (u: Partial<Character>) => void }) => {
  const bulk = calculateBulk(character);
  const bulkPercent = Math.min(100, (bulk.current / bulk.max) * 100);

  const addItem = () => {
    const newItem: InventoryItem = {
      id: uuidv4(),
      name: 'Nuevo Objeto',
      qty: 1,
      bulk: 0,
      equipped: false,
      description: '',
      notes: ''
    };
    onUpdate({ inventory: { ...character.inventory, items: [...character.inventory.items, newItem] } });
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    onUpdate({
      inventory: {
        ...character.inventory,
        items: character.inventory.items.map(i => i.id === id ? { ...i, ...updates } : i)
      }
    });
  };

  const removeItem = (id: string) => {
    onUpdate({
      inventory: {
        ...character.inventory,
        items: character.inventory.items.filter(i => i.id !== id)
      }
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
      <Card title="Monedas">
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(character.inventory.coins).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold uppercase opacity-50">{key}</span>
              <input 
                type="number"
                className="w-full bg-surface-container rounded-lg p-2 text-center text-sm font-bold border-none focus:ring-1 focus:ring-primary"
                value={val}
                onChange={e => onUpdate({ inventory: { ...character.inventory, coins: { ...character.inventory.coins, [key]: parseInt(e.target.value) || 0 } } })}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Volumen">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-xl font-bold font-serif">{bulk.current} / {bulk.max}</span>
            <span className="text-[10px] font-bold uppercase opacity-50">Sobrecargado: {bulk.encumbered}</span>
          </div>
          <div className="h-3 bg-surface-container rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                bulk.current > bulk.max ? "bg-red-500" :
                bulk.current > bulk.encumbered ? "bg-orange-500" : "bg-primary"
              )}
              style={{ width: `${bulkPercent}%` }}
            />
          </div>
        </div>
      </Card>

      <Card title="Objetos" headerAction={<button onClick={addItem} className="p-1"><Package className="w-5 h-5" /></button>}>
        <div className="flex flex-col gap-3">
          {character.inventory.items.map(item => (
            <div key={item.id} className="p-3 bg-surface border border-primary/5 rounded-xl shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <button onClick={() => updateItem(item.id, { equipped: !item.equipped })}>
                    {item.equipped ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 opacity-20" />}
                  </button>
                  <input 
                    className="font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
                    value={item.name}
                    onChange={e => updateItem(item.id, { name: e.target.value })}
                  />
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500/50 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-center px-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold opacity-40 uppercase">QTY</span>
                  <Stepper value={item.qty} onChange={val => updateItem(item.id, { qty: val })} min={0} className="scale-75" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold opacity-40 uppercase">VOL</span>
                  <input 
                    type="number"
                    step="0.1"
                    className="w-12 bg-surface-container rounded p-1 text-center text-xs font-bold border-none"
                    value={item.bulk}
                    onChange={e => updateItem(item.id, { bulk: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          ))}
          {character.inventory.items.length === 0 && (
            <div className="text-center py-8 text-on-surface/40 italic">
              Tu inventario está vacío.
            </div>
          )}
        </div>
      </Card>
      
      <button 
        onClick={addItem}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
      >
        <Package className="w-5 h-5" /> Añadir Objeto
      </button>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
