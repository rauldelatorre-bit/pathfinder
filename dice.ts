export interface RollResult {
  total: number;
  expression: string;
  rolls: { dice: string; values: number[] }[];
  modifier: number;
  label?: string;
  timestamp: number;
  critical?: 'success' | 'failure' | 'normal' | 'crit-success' | 'crit-failure';
}

export function rollDice(expression: string, label?: string, dc?: number): RollResult {
  const diceRegex = /(\d+)d(\d+)/g;
  let match;
  let total = 0;
  const rolls: { dice: string; values: number[] }[] = [];
  
  let cleanExpr = expression.replace(/\s+/g, '');
  
  // Extract and sum dice
  let diceExpr = cleanExpr;
  while ((match = diceRegex.exec(cleanExpr)) !== null) {
    const qty = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const values: number[] = [];
    for (let i = 0; i < qty; i++) {
        const r = Math.floor(Math.random() * sides) + 1;
        values.push(r);
        total += r;
    }
    rolls.push({ dice: `${qty}d${sides}`, values });
    diceExpr = diceExpr.replace(match[0], '');
  }
  
  // Parse remaining modifiers
  // This is a naive parser but handles +X -Y
  const modTotal = eval(diceExpr || '0');
  total += modTotal;

  let critical: RollResult['critical'] = 'normal';
  if (dc !== undefined) {
    // PF2e rules: 10 over = crit success, 10 under = crit failure
    // Hard to determine nat 20 impact without knowing which part is the d20 roll
    // We assume the first d20 is the main roll for crit checks
    const mainD20 = rolls.find(r => r.dice === '1d20');
    let shift = 0;
    if (mainD20) {
      if (mainD20.values[0] === 20) shift = 1;
      if (mainD20.values[0] === 1) shift = -1;
    }

    if (total >= dc + 10) critical = 'crit-success';
    else if (total >= dc) critical = 'success';
    else if (total > dc - 10) critical = 'failure';
    else critical = 'crit-failure';

    // Shift result
    const stages: RollResult['critical'][] = ['crit-failure', 'failure', 'success', 'crit-success'];
    let idx = stages.indexOf(critical);
    idx = Math.max(0, Math.min(3, idx + shift));
    critical = stages[idx];
  }

  return {
    total,
    expression,
    rolls,
    modifier: modTotal,
    label,
    timestamp: Date.now(),
    critical
  };
}

export function rollD20(modVal: number, label?: string, dc?: number): RollResult {
  return rollDice(`1d20 + ${modVal}`, label, dc);
}
