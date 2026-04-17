import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function profBonus(rank: number, level: number): number {
  if (rank === 0) return 0;
  return level + rank * 2;
}

export function getRankLabel(rank: number): string {
  switch (rank) {
    case 0: return 'N';
    case 1: return 'E';
    case 2: return 'Ex';
    case 3: return 'M';
    case 4: return 'L';
    default: return 'N';
  }
}

export function getRankName(rank: number): string {
  switch (rank) {
    case 0: return 'Novato';
    case 1: return 'Entrenado';
    case 2: return 'Experto';
    case 3: return 'Maestro';
    case 4: return 'Legendario';
    default: return 'Novato';
  }
}
