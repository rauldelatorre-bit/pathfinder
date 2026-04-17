export interface Attribute {
  score: number;
  manualMod: number | null;
  partialBoost: boolean;
}

export interface Condition {
  name: string;
  value: number | null;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  attribute: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
  prof: number; // 0-4
  item: number;
  armor: number;
  other: number;
  trainedOnly: boolean;
  notes: string;
  pinned: boolean;
}

export interface Weapon {
  id: string;
  name: string;
  type: string;
  traits: string[];
  group: string;
  runes: string;
  prof: number;
  attribute: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
  atkOther: number;
  damage: string;
  damageType: string;
  extraDamage: string;
  critTraits: string[];
  range: string;
  ammo: string;
  notes: string;
}

export interface Spell {
  rank: number;
  name: string;
  description: string;
  prepared: boolean;
  isCantrip: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  qty: number;
  bulk: number; // 0 for light, 0.1 for light? No, standard PF2e is L (0.1) or whole numbers.
  equipped: boolean;
  description: string;
  notes: string;
}

export interface Character {
  id: string;
  meta: {
    name: string;
    player: string;
    level: number;
    xp: number;
    heroPoints: number;
    ancestry: string;
    heritage: string;
    background: string;
    class: string;
    size: string;
    alignment: string;
    deity: string;
    avatar: string;
  };
  attributes: {
    str: Attribute;
    dex: Attribute;
    con: Attribute;
    int: Attribute;
    wis: Attribute;
    cha: Attribute;
  };
  defenses: {
    ac: { dexCap: number | null; prof: number; item: number; armor: number; other: number; manual: number | null };
    saves: {
      fort: { attr: 'con'; prof: number; item: number; other: number };
      ref: { attr: 'dex'; prof: number; item: number; other: number };
      will: { attr: 'wis'; prof: number; item: number; other: number };
    };
    shield: { name: string; hardness: number; hpMax: number; hpCurrent: number; bt: number };
    resistances: { type: string; value: number }[];
    immunities: string[];
    weaknesses: { type: string; value: number }[];
    conditions: Condition[];
  };
  hp: {
    max: number;
    current: number;
    temp: number;
    dying: number;
    wounded: number;
    doomed: number;
    customStates: string[];
  };
  perception: { wisProf: number; item: number; other: number; senses: string[]; notes: string };
  speeds: { base: number; climb: number; swim: number; fly: number; burrow: number; custom: { name: string; value: number }[] };
  skills: Skill[];
  languages: string[];
  weapons: Weapon[];
  classDC: { attr: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'; prof: number; other: number };
  spellcasting: {
    tradition: string;
    attackBonus: { attr: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'; prof: number; other: number };
    dc: { attr: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'; prof: number; other: number };
    focus: { current: number; max: number };
    slots: { rank: number; max: number; used: number }[];
    spells: Spell[];
    rituals: string[];
  };
  inventory: {
    coins: { cp: number; sp: number; gp: number; pp: number };
    items: InventoryItem[];
  };
  feats: {
    ancestry: string[];
    class: string[];
    skill: string[];
    general: string[];
    reactions: string[];
    freeActions: string[];
    actions1: string[];
    actions2: string[];
    actions3: string[];
    traits: string[];
    reminders: string[];
    campaignNotes: string;
  };
}

export interface AppSettings {
  darkMode: boolean;
  units: 'ft' | 'm';
  autoCalc: boolean;
  showMagic: boolean;
}

export interface AppState {
  characters: Character[];
  activeCharacterId: string | null;
  settings: AppSettings;
}
