import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Character, AppSettings } from '../types';
import { sampleCharacter, createBlankCharacter } from '../lib/character';

const STORAGE_KEY = 'pf2e-character-sheet-v1';

export const useAppState = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    const firstChar = sampleCharacter();
    return {
      characters: [firstChar],
      activeCharacterId: firstChar.id,
      settings: {
        darkMode: false,
        units: 'ft',
        autoCalc: true,
        showMagic: true
      }
    };
  });

  const [lastSaved, setLastSaved] = useState(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setLastSaved(Date.now());
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  const updateCharacter = useCallback((id: string, updates: Partial<Character> | ((prev: Character) => Character)) => {
    setState(prev => ({
      ...prev,
      characters: prev.characters.map(c => {
        if (c.id === id) {
          if (typeof updates === 'function') {
            return updates(c);
          }
          return { ...c, ...updates };
        }
        return c;
      })
    }));
  }, []);

  const addCharacter = useCallback(() => {
    const newChar = createBlankCharacter();
    setState(prev => ({
      ...prev,
      characters: [...prev.characters, newChar],
      activeCharacterId: newChar.id
    }));
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setState(prev => {
      const remaining = prev.characters.filter(c => c.id !== id);
      const nextActiveId = prev.activeCharacterId === id 
        ? (remaining.length > 0 ? remaining[0].id : null)
        : prev.activeCharacterId;
      return {
        ...prev,
        characters: remaining,
        activeCharacterId: nextActiveId
      };
    });
  }, []);

  const setActiveCharacter = useCallback((id: string) => {
    setState(prev => ({ ...prev, activeCharacterId: id }));
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  }, []);

  const activeCharacter = state.characters.find(c => c.id === state.activeCharacterId) || null;

  return {
    state,
    activeCharacter,
    updateCharacter,
    addCharacter,
    deleteCharacter,
    setActiveCharacter,
    updateSettings,
    lastSaved
  };
};
