import { Character, Skill, Weapon } from '../types';
import { mod, profBonus } from './utils';

export function calculateSkillTotal(skill: Skill, level: number, character: Character): number {
  const attrScore = character.attributes[skill.attribute].score;
  const attrMod = character.attributes[skill.attribute].manualMod ?? mod(attrScore);
  const bonus = profBonus(skill.prof, level);
  return attrMod + bonus + skill.item + skill.other - (skill.armor || 0);
}

export function calculateSaveTotal(saveKey: 'fort' | 'ref' | 'will', character: Character): number {
  const save = character.defenses.saves[saveKey];
  const attrScore = character.attributes[save.attr].score;
  const attrMod = character.attributes[save.attr].manualMod ?? mod(attrScore);
  const bonus = profBonus(save.prof, character.meta.level);
  return attrMod + bonus + save.item + save.other;
}

export function calculateACTotal(character: Character): number {
  if (character.defenses.ac.manual !== null) return character.defenses.ac.manual;
  
  const dexScore = character.attributes.dex.score;
  const dexMod = character.attributes.dex.manualMod ?? mod(dexScore);
  const cappedDex = character.defenses.ac.dexCap !== null ? Math.min(dexMod, character.defenses.ac.dexCap) : dexMod;
  const bonus = profBonus(character.defenses.ac.prof, character.meta.level);
  
  return 10 + cappedDex + bonus + character.defenses.ac.item + character.defenses.ac.other;
}

export function calculatePerceptionTotal(character: Character): number {
  const wisScore = character.attributes.wis.score;
  const wisMod = character.attributes.wis.manualMod ?? mod(wisScore);
  const bonus = profBonus(character.perception.wisProf, character.meta.level);
  return wisMod + bonus + character.perception.item + character.perception.other;
}

export function calculateWeaponAtk(weapon: Weapon, character: Character): number {
  const attrScore = character.attributes[weapon.attribute].score;
  const attrMod = character.attributes[weapon.attribute].manualMod ?? mod(attrScore);
  const bonus = profBonus(weapon.prof, character.meta.level);
  return attrMod + bonus + weapon.atkOther;
}

export function calculateBulk(character: Character): { current: number; encumbered: number; max: number } {
  const strScore = character.attributes.str.score;
  const strMod = character.attributes.str.manualMod ?? mod(strScore);
  
  let currentBulk = 0;
  character.inventory.items.forEach(item => {
    currentBulk += item.bulk * item.qty;
  });
  
  // PF2e standard: 5 + strMod, 10 + strMod
  return {
    current: Math.floor(currentBulk), // Usually floor for display if using 0.1 for Light
    encumbered: 5 + strMod,
    max: 10 + strMod
  };
}
