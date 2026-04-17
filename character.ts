import { v4 as uuidv4 } from 'uuid';
import { Character, Skill } from '../types';
import { SKILL_LIST } from '../constants';

export const createBlankCharacter = (): Character => {
  const skills: Skill[] = SKILL_LIST.map(s => ({
    id: uuidv4(),
    name: s.name,
    attribute: s.attr as any,
    prof: 0,
    item: 0,
    armor: 0,
    other: 0,
    trainedOnly: s.trainedOnly,
    notes: '',
    pinned: false
  }));

  return {
    id: uuidv4(),
    meta: {
      name: 'Nuevo Aventurero',
      player: '',
      level: 1,
      xp: 0,
      heroPoints: 1,
      ancestry: '',
      heritage: '',
      background: '',
      class: '',
      size: 'Mediano',
      alignment: 'N',
      deity: '',
      avatar: ''
    },
    attributes: {
      str: { score: 10, manualMod: null, partialBoost: false },
      dex: { score: 10, manualMod: null, partialBoost: false },
      con: { score: 10, manualMod: null, partialBoost: false },
      int: { score: 10, manualMod: null, partialBoost: false },
      wis: { score: 10, manualMod: null, partialBoost: false },
      cha: { score: 10, manualMod: null, partialBoost: false },
    },
    defenses: {
      ac: { dexCap: null, prof: 0, item: 0, armor: 0, other: 0, manual: null },
      saves: {
        fort: { attr: 'con', prof: 0, item: 0, other: 0 },
        ref: { attr: 'dex', prof: 0, item: 0, other: 0 },
        will: { attr: 'wis', prof: 0, item: 0, other: 0 },
      },
      shield: { name: '', hardness: 0, hpMax: 0, hpCurrent: 0, bt: 0 },
      resistances: [],
      immunities: [],
      weaknesses: [],
      conditions: []
    },
    hp: { max: 10, current: 10, temp: 0, dying: 0, wounded: 0, doomed: 0, customStates: [] },
    perception: { wisProf: 0, item: 0, other: 0, senses: [], notes: '' },
    speeds: { base: 25, climb: 0, swim: 0, fly: 0, burrow: 0, custom: [] },
    skills,
    languages: ['Común'],
    weapons: [],
    classDC: { attr: 'str', prof: 0, other: 0 },
    spellcasting: {
      tradition: '',
      attackBonus: { attr: 'int', prof: 0, other: 0 },
      dc: { attr: 'int', prof: 0, other: 0 },
      focus: { current: 1, max: 1 },
      slots: [],
      spells: [],
      rituals: []
    },
    inventory: {
      coins: { cp: 0, sp: 0, gp: 0, pp: 0 },
      items: []
    },
    feats: {
      ancestry: [],
      class: [],
      skill: [],
      general: [],
      reactions: [],
      freeActions: [],
      actions1: [],
      actions2: [],
      actions3: [],
      traits: [],
      reminders: [],
      campaignNotes: ''
    }
  };
};

export const sampleCharacter = (): Character => {
  const char = createBlankCharacter();
  char.meta.name = 'Valeros';
  char.meta.class = 'Guerrero';
  char.meta.ancestry = 'Humano';
  char.meta.level = 1;
  char.attributes.str.score = 18;
  char.attributes.dex.score = 12;
  char.attributes.con.score = 14;
  char.attributes.int.score = 10;
  char.attributes.wis.score = 12;
  char.attributes.cha.score = 10;
  
  char.hp.max = 20;
  char.hp.current = 20;
  
  char.skills.find(s => s.name === 'Atletismo')!.prof = 1;
  char.skills.find(s => s.name === 'Intimidación')!.prof = 1;
  
  char.weapons.push({
    id: uuidv4(),
    name: 'Espada Larga',
    type: 'Marcial',
    traits: ['Versátil P'],
    group: 'Espada',
    runes: '',
    prof: 1,
    attribute: 'str',
    atkOther: 0,
    damage: '1d8',
    damageType: 'C',
    extraDamage: '',
    critTraits: [],
    range: '',
    ammo: '',
    notes: ''
  });
  
  return char;
};
