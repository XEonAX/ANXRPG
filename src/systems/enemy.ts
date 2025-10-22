/**
 * Enemy System
 * 
 * Manages enemy creation, team generation, and boss mechanics
 */

import type { Enemy, EnemyTemplate, EnemyTier } from '../types/enemy';
import type { CharacterStats } from '../types/character';
import { 
  getEnemyTemplate,
  getRandomEnemyTemplateForTier,
  getBossTemplateForTier,
  ENEMY_TEMPLATES_BY_TIER
} from '../data/enemies';
import { randomInt } from '../utils/random';

// Re-export for use in other systems
export { getEnemyTemplate };

let enemyIdCounter = 0;

/**
 * Generate unique enemy ID
 */
function generateEnemyId(): string {
  return `enemy_${++enemyIdCounter}_${Date.now()}`;
}

/**
 * Calculate enemy stats based on template and level
 */
export function calculateEnemyStats(template: EnemyTemplate, level: number): CharacterStats {
  const stats: CharacterStats = { ...template.baseStats };
  
  // Apply level scaling
  const levelsToGrow = level - 1;
  
  if (template.statGrowthPerLevel.maxHp) {
    stats.maxHp += template.statGrowthPerLevel.maxHp * levelsToGrow;
  }
  if (template.statGrowthPerLevel.atk) {
    stats.atk += template.statGrowthPerLevel.atk * levelsToGrow;
  }
  if (template.statGrowthPerLevel.def) {
    stats.def += template.statGrowthPerLevel.def * levelsToGrow;
  }
  if (template.statGrowthPerLevel.mag) {
    stats.mag += template.statGrowthPerLevel.mag * levelsToGrow;
  }
  if (template.statGrowthPerLevel.res) {
    stats.res += template.statGrowthPerLevel.res * levelsToGrow;
  }
  if (template.statGrowthPerLevel.spd) {
    stats.spd += template.statGrowthPerLevel.spd * levelsToGrow;
  }
  if (template.statGrowthPerLevel.crt) {
    stats.crt += template.statGrowthPerLevel.crt * levelsToGrow;
  }
  if (template.statGrowthPerLevel.eva) {
    stats.eva += template.statGrowthPerLevel.eva * levelsToGrow;
  }
  if (template.statGrowthPerLevel.acc) {
    stats.acc += template.statGrowthPerLevel.acc * levelsToGrow;
  }
  
  // Apply boss multiplier if applicable
  if (template.isBoss && template.bossMultiplier) {
    const multiplier = template.bossMultiplier;
    stats.maxHp = Math.floor(stats.maxHp * multiplier);
    stats.atk = Math.floor(stats.atk * multiplier);
    stats.def = Math.floor(stats.def * multiplier);
    stats.mag = Math.floor(stats.mag * multiplier);
    stats.res = Math.floor(stats.res * multiplier);
    // Boss speed not multiplied
    stats.crt = Math.min(100, Math.floor(stats.crt * multiplier));
    stats.eva = Math.min(95, Math.floor(stats.eva * multiplier));
    stats.acc = Math.min(100, Math.floor(stats.acc * multiplier));
  }
  
  // Round all stats
  stats.maxHp = Math.floor(stats.maxHp);
  stats.atk = Math.floor(stats.atk);
  stats.def = Math.floor(stats.def);
  stats.mag = Math.floor(stats.mag);
  stats.res = Math.floor(stats.res);
  stats.spd = Math.floor(stats.spd);
  
  // Cap percentages
  stats.crt = Math.max(0, Math.min(100, Math.floor(stats.crt)));
  stats.eva = Math.max(0, Math.min(95, Math.floor(stats.eva)));
  stats.acc = Math.max(5, Math.min(100, Math.floor(stats.acc)));
  
  // Set current HP to max
  stats.hp = stats.maxHp;
  
  return stats;
}

/**
 * Create an enemy from a template
 */
export function createEnemy(templateId: string, level: number, isSummoned: boolean = false): Enemy {
  const template = getEnemyTemplate(templateId);
  
  if (!template) {
    throw new Error(`Enemy template not found: ${templateId}`);
  }
  
  const stats = calculateEnemyStats(template, level);
  
  const enemy: Enemy = {
    id: generateEnemyId(),
    templateId: template.id,
    name: template.name,
    tier: template.tier,
    role: template.role,
    level,
    stats,
    currentAp: template.apRegen, // Start with base AP
    statusEffects: [],
    abilities: [...template.abilities],
    isBoss: template.isBoss,
    isAlive: true,
    isSummoned,
  };
  
  // Initialize boss state
  if (template.isBoss && template.canSummon) {
    enemy.hasUsedSummon = template.summonTriggers?.map(() => false) || [];
    enemy.currentSummons = [];
  }
  
  return enemy;
}

/**
 * Generate a random enemy team for a stage
 * 
 * @param stage - Stage number (1-100)
 * @param teamSize - Number of enemies (1-3)
 * @param levelVariance - Optional level variance (e.g., 3 level 1 enemies at stage 5)
 */
export function generateEnemyTeam(
  stage: number,
  teamSize: number = randomInt(1, 3),
  levelVariance: number = 0
): Enemy[] {
  // Determine tier based on stage
  const tier = Math.min(7, Math.ceil(stage / 10)) as EnemyTier;
  
  // Determine average level (roughly matches stage)
  const avgLevel = stage;
  
  const enemies: Enemy[] = [];
  
  for (let i = 0; i < teamSize; i++) {
    // Get random template for tier
    const template = getRandomEnemyTemplateForTier(tier);
    
    // Calculate level with variance
    const levelAdjustment = levelVariance > 0 
      ? randomInt(-levelVariance, levelVariance) 
      : 0;
    const enemyLevel = Math.max(1, avgLevel + levelAdjustment);
    
    // Create enemy
    const enemy = createEnemy(template.id, enemyLevel);
    enemies.push(enemy);
  }
  
  return enemies;
}

/**
 * Generate a boss encounter for a stage
 * 
 * @param stage - Stage number (must be divisible by 10)
 * @returns Solo boss enemy
 */
export function generateBossEncounter(stage: number): Enemy[] {
  if (stage % 10 !== 0) {
    console.warn(`Stage ${stage} is not a boss stage (not divisible by 10)`);
  }
  
  // Determine tier
  const tier = Math.min(7, Math.ceil(stage / 10)) as EnemyTier;
  
  // Get boss template
  const bossTemplate = getBossTemplateForTier(tier);
  
  // Create boss at stage level
  const boss = createEnemy(bossTemplate.id, stage);
  
  return [boss];
}

/**
 * Check if a boss should summon minions
 * Returns array of minion template IDs to summon
 */
export function checkBossSummonTriggers(boss: Enemy, template: EnemyTemplate): string[] {
  if (!boss.isBoss || !template.canSummon || !template.summonTriggers || !template.summonPool) {
    return [];
  }
  
  const toSummon: string[] = [];
  
  // Check each summon trigger
  template.summonTriggers.forEach((trigger, index) => {
    // Skip if already used
    if (boss.hasUsedSummon && boss.hasUsedSummon[index]) {
      return;
    }
    
    let shouldTrigger = false;
    
    if (trigger.type === 'hp-threshold') {
      const hpPercent = (boss.stats.hp / boss.stats.maxHp) * 100;
      shouldTrigger = hpPercent <= trigger.value;
    }
    // Note: turn-interval triggers would be checked in combat system
    
    if (shouldTrigger) {
      // Mark trigger as used
      if (!boss.hasUsedSummon) {
        boss.hasUsedSummon = [];
      }
      boss.hasUsedSummon[index] = true;
      
      // Determine how many to summon (1-2, limited by maxSummons)
      const currentSummonCount = boss.currentSummons?.length || 0;
      const maxSummons = template.maxSummons || 2;
      const canSummon = maxSummons - currentSummonCount;
      
      if (canSummon > 0 && template.summonPool) {
        const summonCount = Math.min(canSummon, randomInt(1, 2));
        
        for (let i = 0; i < summonCount; i++) {
          // Pick random minion from summon pool
          const minionTemplateId = template.summonPool[
            randomInt(0, template.summonPool.length - 1)
          ];
          toSummon.push(minionTemplateId);
        }
      }
    }
  });
  
  return toSummon;
}

/**
 * Summon minions for a boss
 * Creates minion enemies and adds to boss's current summons
 */
export function summonMinions(
  boss: Enemy,
  minionTemplateIds: string[]
): Enemy[] {
  const minions: Enemy[] = [];
  
  for (const templateId of minionTemplateIds) {
    // Summon at boss's level (or slightly lower)
    const minionLevel = Math.max(1, boss.level - randomInt(0, 2));
    const minion = createEnemy(templateId, minionLevel, true);
    
    minions.push(minion);
    
    // Track summon
    if (!boss.currentSummons) {
      boss.currentSummons = [];
    }
    boss.currentSummons.push(minion.id);
  }
  
  return minions;
}

/**
 * Remove dead summons from boss tracking
 */
export function cleanupDeadSummons(boss: Enemy, deadEnemyId: string): void {
  if (!boss.currentSummons) {
    return;
  }
  
  boss.currentSummons = boss.currentSummons.filter(id => id !== deadEnemyId);
}

/**
 * Get enemy's name with level (for display)
 */
export function getEnemyDisplayName(enemy: Enemy): string {
  return `${enemy.name} (Lv.${enemy.level})`;
}

/**
 * Calculate total XP reward for defeating an enemy
 * Based on enemy level and boss status
 */
export function calculateEnemyXpReward(enemy: Enemy): number {
  // Base XP formula: level^2 * 10
  let xp = enemy.level * enemy.level * 10;
  
  // Boss bonus: 5x XP
  if (enemy.isBoss) {
    xp *= 5;
  }
  
  return Math.floor(xp);
}

/**
 * Generate equipment drop chance for an enemy
 * Returns true if equipment should drop
 */
export function rollEquipmentDrop(enemy: Enemy): boolean {
  const template = getEnemyTemplate(enemy.templateId);
  
  if (!template) {
    return false;
  }
  
  // Roll against drop chance
  const roll = Math.random();
  return roll <= template.equipmentDropChance;
}

/**
 * Get enemies available at a specific tier
 */
export function getEnemiesForTier(tier: EnemyTier): EnemyTemplate[] {
  return ENEMY_TEMPLATES_BY_TIER[tier] || [];
}

/**
 * Check if stage is a boss stage
 */
export function isBossStage(stage: number): boolean {
  return stage % 10 === 0;
}
