/**
 * Skill Tree Definitions
 * 
 * Each character type has ~20 skill tree nodes arranged in linear progression.
 * Nodes provide EITHER stat bonuses OR ability unlocks (never both).
 * 
 * Design Philosophy:
 * - Early nodes (levels 1-20): Basic stat improvements and core abilities
 * - Mid nodes (levels 21-50): Enhanced stats and 5th ability slot
 * - Late nodes (levels 51-80): Advanced abilities and 6th ability slot
 * - End nodes (levels 81-100): Mastery bonuses
 */

import type { SkillTree } from '../types/skillTree';

/**
 * ALPHA (PALADIN) SKILL TREE
 * Focus: Defense, HP, healing support
 */
export const ALPHA_SKILL_TREE: SkillTree = {
  characterType: 'Alpha',
  maxAbilitySlots: 6,
  nodes: [
    // Row 1: Early game (levels 1-10)
    {
      id: 'alpha_hp_1',
      name: 'Fortified Health I',
      description: '+25 Max HP',
      type: 'stat',
      statBonus: { maxHp: 25 },
      requiredLevel: 1,
      requiredNodes: [],
      skillPointCost: 1,
      row: 1,
      column: 1
    },
    {
      id: 'alpha_def_1',
      name: 'Shield Mastery I',
      description: '+8 DEF',
      type: 'stat',
      statBonus: { def: 8 },
      requiredLevel: 3,
      requiredNodes: ['alpha_hp_1'],
      skillPointCost: 1,
      row: 1,
      column: 2
    },
    {
      id: 'alpha_res_1',
      name: 'Holy Resistance I',
      description: '+6 RES',
      type: 'stat',
      statBonus: { res: 6 },
      requiredLevel: 5,
      requiredNodes: ['alpha_def_1'],
      skillPointCost: 1,
      row: 1,
      column: 3
    },
    
    // Row 2: Early-mid game (levels 10-25)
    {
      id: 'alpha_atk_1',
      name: 'Righteous Might I',
      description: '+10 ATK',
      type: 'stat',
      statBonus: { atk: 10 },
      requiredLevel: 10,
      requiredNodes: ['alpha_res_1'],
      skillPointCost: 1,
      row: 2,
      column: 1
    },
    {
      id: 'alpha_hp_2',
      name: 'Fortified Health II',
      description: '+40 Max HP',
      type: 'stat',
      statBonus: { maxHp: 40 },
      requiredLevel: 15,
      requiredNodes: ['alpha_atk_1'],
      skillPointCost: 2,
      row: 2,
      column: 2
    },
    {
      id: 'alpha_def_2',
      name: 'Shield Mastery II',
      description: '+12 DEF',
      type: 'stat',
      statBonus: { def: 12 },
      requiredLevel: 20,
      requiredNodes: ['alpha_hp_2'],
      skillPointCost: 1,
      row: 2,
      column: 3
    },
    {
      id: 'alpha_acc_1',
      name: 'Divine Precision',
      description: '+5% ACC',
      type: 'stat',
      statBonus: { acc: 5 },
      requiredLevel: 25,
      requiredNodes: ['alpha_def_2'],
      skillPointCost: 1,
      row: 2,
      column: 4
    },
    
    // Row 3: Mid game (levels 30-50)
    {
      id: 'alpha_ability_5',
      name: 'Divine Arsenal',
      description: 'Unlock 5th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 30,
      requiredNodes: ['alpha_acc_1'],
      skillPointCost: 2,
      row: 3,
      column: 1
    },
    {
      id: 'alpha_hp_3',
      name: 'Fortified Health III',
      description: '+60 Max HP',
      type: 'stat',
      statBonus: { maxHp: 60 },
      requiredLevel: 35,
      requiredNodes: ['alpha_ability_5'],
      skillPointCost: 2,
      row: 3,
      column: 2
    },
    {
      id: 'alpha_atk_2',
      name: 'Righteous Might II',
      description: '+18 ATK',
      type: 'stat',
      statBonus: { atk: 18 },
      requiredLevel: 40,
      requiredNodes: ['alpha_hp_3'],
      skillPointCost: 2,
      row: 3,
      column: 3
    },
    {
      id: 'alpha_res_2',
      name: 'Holy Resistance II',
      description: '+10 RES',
      type: 'stat',
      statBonus: { res: 10 },
      requiredLevel: 45,
      requiredNodes: ['alpha_atk_2'],
      skillPointCost: 1,
      row: 3,
      column: 4
    },
    {
      id: 'alpha_def_3',
      name: 'Shield Mastery III',
      description: '+20 DEF',
      type: 'stat',
      statBonus: { def: 20 },
      requiredLevel: 50,
      requiredNodes: ['alpha_res_2'],
      skillPointCost: 2,
      row: 3,
      column: 5
    },
    
    // Row 4: Late game (levels 55-75)
    {
      id: 'alpha_spd_1',
      name: 'Blessed Agility',
      description: '+8 SPD',
      type: 'stat',
      statBonus: { spd: 8 },
      requiredLevel: 55,
      requiredNodes: ['alpha_def_3'],
      skillPointCost: 1,
      row: 4,
      column: 1
    },
    {
      id: 'alpha_hp_4',
      name: 'Fortified Health IV',
      description: '+100 Max HP',
      type: 'stat',
      statBonus: { maxHp: 100 },
      requiredLevel: 60,
      requiredNodes: ['alpha_spd_1'],
      skillPointCost: 3,
      row: 4,
      column: 2
    },
    {
      id: 'alpha_ability_6',
      name: 'Holy Mastery',
      description: 'Unlock 6th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 65,
      requiredNodes: ['alpha_hp_4'],
      skillPointCost: 3,
      row: 4,
      column: 3
    },
    {
      id: 'alpha_atk_3',
      name: 'Righteous Might III',
      description: '+30 ATK',
      type: 'stat',
      statBonus: { atk: 30 },
      requiredLevel: 70,
      requiredNodes: ['alpha_ability_6'],
      skillPointCost: 2,
      row: 4,
      column: 4
    },
    {
      id: 'alpha_def_4',
      name: 'Shield Mastery IV',
      description: '+35 DEF',
      type: 'stat',
      statBonus: { def: 35 },
      requiredLevel: 75,
      requiredNodes: ['alpha_atk_3'],
      skillPointCost: 3,
      row: 4,
      column: 5
    },
    
    // Row 5: End game (levels 80-100)
    {
      id: 'alpha_res_3',
      name: 'Holy Resistance III',
      description: '+18 RES',
      type: 'stat',
      statBonus: { res: 18 },
      requiredLevel: 80,
      requiredNodes: ['alpha_def_4'],
      skillPointCost: 2,
      row: 5,
      column: 1
    },
    {
      id: 'alpha_hp_5',
      name: 'Divine Fortitude',
      description: '+150 Max HP',
      type: 'stat',
      statBonus: { maxHp: 150 },
      requiredLevel: 90,
      requiredNodes: ['alpha_res_3'],
      skillPointCost: 3,
      row: 5,
      column: 2
    },
    {
      id: 'alpha_master',
      name: 'Paladin Grandmaster',
      description: '+50 HP, +25 ATK, +25 DEF, +15 RES',
      type: 'stat',
      statBonus: { maxHp: 50, atk: 25, def: 25, res: 15 },
      requiredLevel: 100,
      requiredNodes: ['alpha_hp_5'],
      skillPointCost: 3,
      row: 5,
      column: 3
    }
  ]
};

/**
 * BETA (ROGUE) SKILL TREE
 * Focus: Speed, Critical, Evasion, Accuracy
 */
export const BETA_SKILL_TREE: SkillTree = {
  characterType: 'Beta',
  maxAbilitySlots: 6,
  nodes: [
    // Row 1: Early game
    {
      id: 'beta_spd_1',
      name: 'Swift Footwork I',
      description: '+10 SPD',
      type: 'stat',
      statBonus: { spd: 10 },
      requiredLevel: 1,
      requiredNodes: [],
      skillPointCost: 1,
      row: 1,
      column: 1
    },
    {
      id: 'beta_crt_1',
      name: 'Critical Strike I',
      description: '+5% CRT',
      type: 'stat',
      statBonus: { crt: 5 },
      requiredLevel: 3,
      requiredNodes: ['beta_spd_1'],
      skillPointCost: 1,
      row: 1,
      column: 2
    },
    {
      id: 'beta_eva_1',
      name: 'Evasive Maneuvers I',
      description: '+8% EVA',
      type: 'stat',
      statBonus: { eva: 8 },
      requiredLevel: 5,
      requiredNodes: ['beta_crt_1'],
      skillPointCost: 1,
      row: 1,
      column: 3
    },
    
    // Row 2: Early-mid game
    {
      id: 'beta_atk_1',
      name: 'Deadly Precision I',
      description: '+12 ATK',
      type: 'stat',
      statBonus: { atk: 12 },
      requiredLevel: 10,
      requiredNodes: ['beta_eva_1'],
      skillPointCost: 1,
      row: 2,
      column: 1
    },
    {
      id: 'beta_acc_1',
      name: 'Lethal Accuracy I',
      description: '+8% ACC',
      type: 'stat',
      statBonus: { acc: 8 },
      requiredLevel: 15,
      requiredNodes: ['beta_atk_1'],
      skillPointCost: 1,
      row: 2,
      column: 2
    },
    {
      id: 'beta_crt_2',
      name: 'Critical Strike II',
      description: '+8% CRT',
      type: 'stat',
      statBonus: { crt: 8 },
      requiredLevel: 20,
      requiredNodes: ['beta_acc_1'],
      skillPointCost: 2,
      row: 2,
      column: 3
    },
    {
      id: 'beta_spd_2',
      name: 'Swift Footwork II',
      description: '+15 SPD',
      type: 'stat',
      statBonus: { spd: 15 },
      requiredLevel: 25,
      requiredNodes: ['beta_crt_2'],
      skillPointCost: 1,
      row: 2,
      column: 4
    },
    
    // Row 3: Mid game
    {
      id: 'beta_ability_5',
      name: 'Shadow Arsenal',
      description: 'Unlock 5th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 30,
      requiredNodes: ['beta_spd_2'],
      skillPointCost: 2,
      row: 3,
      column: 1
    },
    {
      id: 'beta_atk_2',
      name: 'Deadly Precision II',
      description: '+22 ATK',
      type: 'stat',
      statBonus: { atk: 22 },
      requiredLevel: 35,
      requiredNodes: ['beta_ability_5'],
      skillPointCost: 2,
      row: 3,
      column: 2
    },
    {
      id: 'beta_eva_2',
      name: 'Evasive Maneuvers II',
      description: '+12% EVA',
      type: 'stat',
      statBonus: { eva: 12 },
      requiredLevel: 40,
      requiredNodes: ['beta_atk_2'],
      skillPointCost: 2,
      row: 3,
      column: 3
    },
    {
      id: 'beta_crt_3',
      name: 'Critical Strike III',
      description: '+12% CRT',
      type: 'stat',
      statBonus: { crt: 12 },
      requiredLevel: 45,
      requiredNodes: ['beta_eva_2'],
      skillPointCost: 2,
      row: 3,
      column: 4
    },
    {
      id: 'beta_hp_1',
      name: 'Survivalist Training',
      description: '+50 Max HP',
      type: 'stat',
      statBonus: { maxHp: 50 },
      requiredLevel: 50,
      requiredNodes: ['beta_crt_3'],
      skillPointCost: 1,
      row: 3,
      column: 5
    },
    
    // Row 4: Late game
    {
      id: 'beta_spd_3',
      name: 'Swift Footwork III',
      description: '+25 SPD',
      type: 'stat',
      statBonus: { spd: 25 },
      requiredLevel: 55,
      requiredNodes: ['beta_hp_1'],
      skillPointCost: 2,
      row: 4,
      column: 1
    },
    {
      id: 'beta_acc_2',
      name: 'Lethal Accuracy II',
      description: '+12% ACC',
      type: 'stat',
      statBonus: { acc: 12 },
      requiredLevel: 60,
      requiredNodes: ['beta_spd_3'],
      skillPointCost: 2,
      row: 4,
      column: 2
    },
    {
      id: 'beta_ability_6',
      name: 'Assassin Mastery',
      description: 'Unlock 6th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 65,
      requiredNodes: ['beta_acc_2'],
      skillPointCost: 3,
      row: 4,
      column: 3
    },
    {
      id: 'beta_atk_3',
      name: 'Deadly Precision III',
      description: '+40 ATK',
      type: 'stat',
      statBonus: { atk: 40 },
      requiredLevel: 70,
      requiredNodes: ['beta_ability_6'],
      skillPointCost: 3,
      row: 4,
      column: 4
    },
    {
      id: 'beta_crt_4',
      name: 'Critical Strike IV',
      description: '+15% CRT',
      type: 'stat',
      statBonus: { crt: 15 },
      requiredLevel: 75,
      requiredNodes: ['beta_atk_3'],
      skillPointCost: 3,
      row: 4,
      column: 5
    },
    
    // Row 5: End game
    {
      id: 'beta_eva_3',
      name: 'Evasive Maneuvers III',
      description: '+18% EVA',
      type: 'stat',
      statBonus: { eva: 18 },
      requiredLevel: 80,
      requiredNodes: ['beta_crt_4'],
      skillPointCost: 2,
      row: 5,
      column: 1
    },
    {
      id: 'beta_hp_2',
      name: 'Iron Resolve',
      description: '+100 Max HP',
      type: 'stat',
      statBonus: { maxHp: 100 },
      requiredLevel: 90,
      requiredNodes: ['beta_eva_3'],
      skillPointCost: 2,
      row: 5,
      column: 2
    },
    {
      id: 'beta_master',
      name: 'Rogue Grandmaster',
      description: '+50 ATK, +30 SPD, +20% CRT, +15% EVA',
      type: 'stat',
      statBonus: { atk: 50, spd: 30, crt: 20, eva: 15 },
      requiredLevel: 100,
      requiredNodes: ['beta_hp_2'],
      skillPointCost: 3,
      row: 5,
      column: 3
    }
  ]
};

/**
 * GAMMA (MAGE) SKILL TREE
 * Focus: Magic, Resistance, AoE power
 */
export const GAMMA_SKILL_TREE: SkillTree = {
  characterType: 'Gamma',
  maxAbilitySlots: 6,
  nodes: [
    // Row 1: Early game
    {
      id: 'gamma_mag_1',
      name: 'Arcane Power I',
      description: '+12 MAG',
      type: 'stat',
      statBonus: { mag: 12 },
      requiredLevel: 1,
      requiredNodes: [],
      skillPointCost: 1,
      row: 1,
      column: 1
    },
    {
      id: 'gamma_res_1',
      name: 'Mystic Ward I',
      description: '+8 RES',
      type: 'stat',
      statBonus: { res: 8 },
      requiredLevel: 3,
      requiredNodes: ['gamma_mag_1'],
      skillPointCost: 1,
      row: 1,
      column: 2
    },
    {
      id: 'gamma_hp_1',
      name: 'Arcane Vitality I',
      description: '+30 Max HP',
      type: 'stat',
      statBonus: { maxHp: 30 },
      requiredLevel: 5,
      requiredNodes: ['gamma_res_1'],
      skillPointCost: 1,
      row: 1,
      column: 3
    },
    
    // Row 2: Early-mid game
    {
      id: 'gamma_mag_2',
      name: 'Arcane Power II',
      description: '+18 MAG',
      type: 'stat',
      statBonus: { mag: 18 },
      requiredLevel: 10,
      requiredNodes: ['gamma_hp_1'],
      skillPointCost: 1,
      row: 2,
      column: 1
    },
    {
      id: 'gamma_acc_1',
      name: 'Spell Focus I',
      description: '+6% ACC',
      type: 'stat',
      statBonus: { acc: 6 },
      requiredLevel: 15,
      requiredNodes: ['gamma_mag_2'],
      skillPointCost: 1,
      row: 2,
      column: 2
    },
    {
      id: 'gamma_res_2',
      name: 'Mystic Ward II',
      description: '+12 RES',
      type: 'stat',
      statBonus: { res: 12 },
      requiredLevel: 20,
      requiredNodes: ['gamma_acc_1'],
      skillPointCost: 2,
      row: 2,
      column: 3
    },
    {
      id: 'gamma_spd_1',
      name: 'Celerity',
      description: '+8 SPD',
      type: 'stat',
      statBonus: { spd: 8 },
      requiredLevel: 25,
      requiredNodes: ['gamma_res_2'],
      skillPointCost: 1,
      row: 2,
      column: 4
    },
    
    // Row 3: Mid game
    {
      id: 'gamma_ability_5',
      name: 'Spellbook Expansion',
      description: 'Unlock 5th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 30,
      requiredNodes: ['gamma_spd_1'],
      skillPointCost: 2,
      row: 3,
      column: 1
    },
    {
      id: 'gamma_mag_3',
      name: 'Arcane Power III',
      description: '+30 MAG',
      type: 'stat',
      statBonus: { mag: 30 },
      requiredLevel: 35,
      requiredNodes: ['gamma_ability_5'],
      skillPointCost: 2,
      row: 3,
      column: 2
    },
    {
      id: 'gamma_hp_2',
      name: 'Arcane Vitality II',
      description: '+60 Max HP',
      type: 'stat',
      statBonus: { maxHp: 60 },
      requiredLevel: 40,
      requiredNodes: ['gamma_mag_3'],
      skillPointCost: 2,
      row: 3,
      column: 3
    },
    {
      id: 'gamma_res_3',
      name: 'Mystic Ward III',
      description: '+20 RES',
      type: 'stat',
      statBonus: { res: 20 },
      requiredLevel: 45,
      requiredNodes: ['gamma_hp_2'],
      skillPointCost: 2,
      row: 3,
      column: 4
    },
    {
      id: 'gamma_def_1',
      name: 'Mage Armor',
      description: '+12 DEF',
      type: 'stat',
      statBonus: { def: 12 },
      requiredLevel: 50,
      requiredNodes: ['gamma_res_3'],
      skillPointCost: 1,
      row: 3,
      column: 5
    },
    
    // Row 4: Late game
    {
      id: 'gamma_acc_2',
      name: 'Spell Focus II',
      description: '+10% ACC',
      type: 'stat',
      statBonus: { acc: 10 },
      requiredLevel: 55,
      requiredNodes: ['gamma_def_1'],
      skillPointCost: 2,
      row: 4,
      column: 1
    },
    {
      id: 'gamma_mag_4',
      name: 'Arcane Power IV',
      description: '+50 MAG',
      type: 'stat',
      statBonus: { mag: 50 },
      requiredLevel: 60,
      requiredNodes: ['gamma_acc_2'],
      skillPointCost: 3,
      row: 4,
      column: 2
    },
    {
      id: 'gamma_ability_6',
      name: 'Archmage Legacy',
      description: 'Unlock 6th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 65,
      requiredNodes: ['gamma_mag_4'],
      skillPointCost: 3,
      row: 4,
      column: 3
    },
    {
      id: 'gamma_res_4',
      name: 'Mystic Ward IV',
      description: '+35 RES',
      type: 'stat',
      statBonus: { res: 35 },
      requiredLevel: 70,
      requiredNodes: ['gamma_ability_6'],
      skillPointCost: 2,
      row: 4,
      column: 4
    },
    {
      id: 'gamma_hp_3',
      name: 'Arcane Vitality III',
      description: '+100 Max HP',
      type: 'stat',
      statBonus: { maxHp: 100 },
      requiredLevel: 75,
      requiredNodes: ['gamma_res_4'],
      skillPointCost: 2,
      row: 4,
      column: 5
    },
    
    // Row 5: End game
    {
      id: 'gamma_spd_2',
      name: 'Temporal Acceleration',
      description: '+15 SPD',
      type: 'stat',
      statBonus: { spd: 15 },
      requiredLevel: 80,
      requiredNodes: ['gamma_hp_3'],
      skillPointCost: 2,
      row: 5,
      column: 1
    },
    {
      id: 'gamma_mag_5',
      name: 'Reality Warping',
      description: '+80 MAG',
      type: 'stat',
      statBonus: { mag: 80 },
      requiredLevel: 90,
      requiredNodes: ['gamma_spd_2'],
      skillPointCost: 3,
      row: 5,
      column: 2
    },
    {
      id: 'gamma_master',
      name: 'Mage Grandmaster',
      description: '+100 MAG, +40 RES, +80 HP, +12% ACC',
      type: 'stat',
      statBonus: { mag: 100, res: 40, maxHp: 80, acc: 12 },
      requiredLevel: 100,
      requiredNodes: ['gamma_mag_5'],
      skillPointCost: 3,
      row: 5,
      column: 3
    }
  ]
};

/**
 * DELTA (WARRIOR) SKILL TREE
 * Focus: Attack, HP, consistent damage
 */
export const DELTA_SKILL_TREE: SkillTree = {
  characterType: 'Delta',
  maxAbilitySlots: 6,
  nodes: [
    // Row 1: Early game
    {
      id: 'delta_atk_1',
      name: 'Battle Prowess I',
      description: '+12 ATK',
      type: 'stat',
      statBonus: { atk: 12 },
      requiredLevel: 1,
      requiredNodes: [],
      skillPointCost: 1,
      row: 1,
      column: 1
    },
    {
      id: 'delta_hp_1',
      name: 'Warrior Endurance I',
      description: '+35 Max HP',
      type: 'stat',
      statBonus: { maxHp: 35 },
      requiredLevel: 3,
      requiredNodes: ['delta_atk_1'],
      skillPointCost: 1,
      row: 1,
      column: 2
    },
    {
      id: 'delta_def_1',
      name: 'Combat Training I',
      description: '+8 DEF',
      type: 'stat',
      statBonus: { def: 8 },
      requiredLevel: 5,
      requiredNodes: ['delta_hp_1'],
      skillPointCost: 1,
      row: 1,
      column: 3
    },
    
    // Row 2: Early-mid game
    {
      id: 'delta_atk_2',
      name: 'Battle Prowess II',
      description: '+18 ATK',
      type: 'stat',
      statBonus: { atk: 18 },
      requiredLevel: 10,
      requiredNodes: ['delta_def_1'],
      skillPointCost: 1,
      row: 2,
      column: 1
    },
    {
      id: 'delta_crt_1',
      name: 'Lethal Strike I',
      description: '+6% CRT',
      type: 'stat',
      statBonus: { crt: 6 },
      requiredLevel: 15,
      requiredNodes: ['delta_atk_2'],
      skillPointCost: 1,
      row: 2,
      column: 2
    },
    {
      id: 'delta_hp_2',
      name: 'Warrior Endurance II',
      description: '+50 Max HP',
      type: 'stat',
      statBonus: { maxHp: 50 },
      requiredLevel: 20,
      requiredNodes: ['delta_crt_1'],
      skillPointCost: 2,
      row: 2,
      column: 3
    },
    {
      id: 'delta_acc_1',
      name: 'Weapon Mastery I',
      description: '+6% ACC',
      type: 'stat',
      statBonus: { acc: 6 },
      requiredLevel: 25,
      requiredNodes: ['delta_hp_2'],
      skillPointCost: 1,
      row: 2,
      column: 4
    },
    
    // Row 3: Mid game
    {
      id: 'delta_ability_5',
      name: 'War Arsenal',
      description: 'Unlock 5th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 30,
      requiredNodes: ['delta_acc_1'],
      skillPointCost: 2,
      row: 3,
      column: 1
    },
    {
      id: 'delta_atk_3',
      name: 'Battle Prowess III',
      description: '+30 ATK',
      type: 'stat',
      statBonus: { atk: 30 },
      requiredLevel: 35,
      requiredNodes: ['delta_ability_5'],
      skillPointCost: 2,
      row: 3,
      column: 2
    },
    {
      id: 'delta_def_2',
      name: 'Combat Training II',
      description: '+15 DEF',
      type: 'stat',
      statBonus: { def: 15 },
      requiredLevel: 40,
      requiredNodes: ['delta_atk_3'],
      skillPointCost: 2,
      row: 3,
      column: 3
    },
    {
      id: 'delta_spd_1',
      name: 'Battle Tempo',
      description: '+10 SPD',
      type: 'stat',
      statBonus: { spd: 10 },
      requiredLevel: 45,
      requiredNodes: ['delta_def_2'],
      skillPointCost: 1,
      row: 3,
      column: 4
    },
    {
      id: 'delta_hp_3',
      name: 'Warrior Endurance III',
      description: '+80 Max HP',
      type: 'stat',
      statBonus: { maxHp: 80 },
      requiredLevel: 50,
      requiredNodes: ['delta_spd_1'],
      skillPointCost: 2,
      row: 3,
      column: 5
    },
    
    // Row 4: Late game
    {
      id: 'delta_crt_2',
      name: 'Lethal Strike II',
      description: '+10% CRT',
      type: 'stat',
      statBonus: { crt: 10 },
      requiredLevel: 55,
      requiredNodes: ['delta_hp_3'],
      skillPointCost: 2,
      row: 4,
      column: 1
    },
    {
      id: 'delta_atk_4',
      name: 'Battle Prowess IV',
      description: '+45 ATK',
      type: 'stat',
      statBonus: { atk: 45 },
      requiredLevel: 60,
      requiredNodes: ['delta_crt_2'],
      skillPointCost: 3,
      row: 4,
      column: 2
    },
    {
      id: 'delta_ability_6',
      name: 'Warlord Supremacy',
      description: 'Unlock 6th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 65,
      requiredNodes: ['delta_atk_4'],
      skillPointCost: 3,
      row: 4,
      column: 3
    },
    {
      id: 'delta_def_3',
      name: 'Combat Training III',
      description: '+25 DEF',
      type: 'stat',
      statBonus: { def: 25 },
      requiredLevel: 70,
      requiredNodes: ['delta_ability_6'],
      skillPointCost: 2,
      row: 4,
      column: 4
    },
    {
      id: 'delta_hp_4',
      name: 'Warrior Endurance IV',
      description: '+120 Max HP',
      type: 'stat',
      statBonus: { maxHp: 120 },
      requiredLevel: 75,
      requiredNodes: ['delta_def_3'],
      skillPointCost: 3,
      row: 4,
      column: 5
    },
    
    // Row 5: End game
    {
      id: 'delta_acc_2',
      name: 'Weapon Mastery II',
      description: '+10% ACC',
      type: 'stat',
      statBonus: { acc: 10 },
      requiredLevel: 80,
      requiredNodes: ['delta_hp_4'],
      skillPointCost: 2,
      row: 5,
      column: 1
    },
    {
      id: 'delta_atk_5',
      name: 'Legendary Might',
      description: '+70 ATK',
      type: 'stat',
      statBonus: { atk: 70 },
      requiredLevel: 90,
      requiredNodes: ['delta_acc_2'],
      skillPointCost: 3,
      row: 5,
      column: 2
    },
    {
      id: 'delta_master',
      name: 'Warrior Grandmaster',
      description: '+80 ATK, +150 HP, +30 DEF, +15% CRT',
      type: 'stat',
      statBonus: { atk: 80, maxHp: 150, def: 30, crt: 15 },
      requiredLevel: 100,
      requiredNodes: ['delta_atk_5'],
      skillPointCost: 3,
      row: 5,
      column: 3
    }
  ]
};

/**
 * EPSILON (CLERIC) SKILL TREE
 * Focus: Magic (healing), HP, Resistance, Support
 */
export const EPSILON_SKILL_TREE: SkillTree = {
  characterType: 'Epsilon',
  maxAbilitySlots: 6,
  nodes: [
    // Row 1: Early game
    {
      id: 'epsilon_mag_1',
      name: 'Divine Power I',
      description: '+10 MAG',
      type: 'stat',
      statBonus: { mag: 10 },
      requiredLevel: 1,
      requiredNodes: [],
      skillPointCost: 1,
      row: 1,
      column: 1
    },
    {
      id: 'epsilon_hp_1',
      name: 'Blessed Health I',
      description: '+35 Max HP',
      type: 'stat',
      statBonus: { maxHp: 35 },
      requiredLevel: 3,
      requiredNodes: ['epsilon_mag_1'],
      skillPointCost: 1,
      row: 1,
      column: 2
    },
    {
      id: 'epsilon_res_1',
      name: 'Sacred Resistance I',
      description: '+8 RES',
      type: 'stat',
      statBonus: { res: 8 },
      requiredLevel: 5,
      requiredNodes: ['epsilon_hp_1'],
      skillPointCost: 1,
      row: 1,
      column: 3
    },
    
    // Row 2: Early-mid game
    {
      id: 'epsilon_mag_2',
      name: 'Divine Power II',
      description: '+16 MAG',
      type: 'stat',
      statBonus: { mag: 16 },
      requiredLevel: 10,
      requiredNodes: ['epsilon_res_1'],
      skillPointCost: 1,
      row: 2,
      column: 1
    },
    {
      id: 'epsilon_def_1',
      name: 'Holy Protection I',
      description: '+8 DEF',
      type: 'stat',
      statBonus: { def: 8 },
      requiredLevel: 15,
      requiredNodes: ['epsilon_mag_2'],
      skillPointCost: 1,
      row: 2,
      column: 2
    },
    {
      id: 'epsilon_hp_2',
      name: 'Blessed Health II',
      description: '+55 Max HP',
      type: 'stat',
      statBonus: { maxHp: 55 },
      requiredLevel: 20,
      requiredNodes: ['epsilon_def_1'],
      skillPointCost: 2,
      row: 2,
      column: 3
    },
    {
      id: 'epsilon_spd_1',
      name: 'Grace',
      description: '+8 SPD',
      type: 'stat',
      statBonus: { spd: 8 },
      requiredLevel: 25,
      requiredNodes: ['epsilon_hp_2'],
      skillPointCost: 1,
      row: 2,
      column: 4
    },
    
    // Row 3: Mid game
    {
      id: 'epsilon_ability_5',
      name: 'Miracle Expansion',
      description: 'Unlock 5th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 30,
      requiredNodes: ['epsilon_spd_1'],
      skillPointCost: 2,
      row: 3,
      column: 1
    },
    {
      id: 'epsilon_mag_3',
      name: 'Divine Power III',
      description: '+28 MAG',
      type: 'stat',
      statBonus: { mag: 28 },
      requiredLevel: 35,
      requiredNodes: ['epsilon_ability_5'],
      skillPointCost: 2,
      row: 3,
      column: 2
    },
    {
      id: 'epsilon_res_2',
      name: 'Sacred Resistance II',
      description: '+15 RES',
      type: 'stat',
      statBonus: { res: 15 },
      requiredLevel: 40,
      requiredNodes: ['epsilon_mag_3'],
      skillPointCost: 2,
      row: 3,
      column: 3
    },
    {
      id: 'epsilon_hp_3',
      name: 'Blessed Health III',
      description: '+85 Max HP',
      type: 'stat',
      statBonus: { maxHp: 85 },
      requiredLevel: 45,
      requiredNodes: ['epsilon_res_2'],
      skillPointCost: 2,
      row: 3,
      column: 4
    },
    {
      id: 'epsilon_def_2',
      name: 'Holy Protection II',
      description: '+15 DEF',
      type: 'stat',
      statBonus: { def: 15 },
      requiredLevel: 50,
      requiredNodes: ['epsilon_hp_3'],
      skillPointCost: 2,
      row: 3,
      column: 5
    },
    
    // Row 4: Late game
    {
      id: 'epsilon_acc_1',
      name: 'Divine Guidance',
      description: '+8% ACC',
      type: 'stat',
      statBonus: { acc: 8 },
      requiredLevel: 55,
      requiredNodes: ['epsilon_def_2'],
      skillPointCost: 1,
      row: 4,
      column: 1
    },
    {
      id: 'epsilon_mag_4',
      name: 'Divine Power IV',
      description: '+45 MAG',
      type: 'stat',
      statBonus: { mag: 45 },
      requiredLevel: 60,
      requiredNodes: ['epsilon_acc_1'],
      skillPointCost: 3,
      row: 4,
      column: 2
    },
    {
      id: 'epsilon_ability_6',
      name: 'Saint\'s Grace',
      description: 'Unlock 6th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 65,
      requiredNodes: ['epsilon_mag_4'],
      skillPointCost: 3,
      row: 4,
      column: 3
    },
    {
      id: 'epsilon_res_3',
      name: 'Sacred Resistance III',
      description: '+28 RES',
      type: 'stat',
      statBonus: { res: 28 },
      requiredLevel: 70,
      requiredNodes: ['epsilon_ability_6'],
      skillPointCost: 2,
      row: 4,
      column: 4
    },
    {
      id: 'epsilon_hp_4',
      name: 'Blessed Health IV',
      description: '+130 Max HP',
      type: 'stat',
      statBonus: { maxHp: 130 },
      requiredLevel: 75,
      requiredNodes: ['epsilon_res_3'],
      skillPointCost: 3,
      row: 4,
      column: 5
    },
    
    // Row 5: End game
    {
      id: 'epsilon_spd_2',
      name: 'Divine Haste',
      description: '+15 SPD',
      type: 'stat',
      statBonus: { spd: 15 },
      requiredLevel: 80,
      requiredNodes: ['epsilon_hp_4'],
      skillPointCost: 2,
      row: 5,
      column: 1
    },
    {
      id: 'epsilon_mag_5',
      name: 'Miracle Worker',
      description: '+70 MAG',
      type: 'stat',
      statBonus: { mag: 70 },
      requiredLevel: 90,
      requiredNodes: ['epsilon_spd_2'],
      skillPointCost: 3,
      row: 5,
      column: 2
    },
    {
      id: 'epsilon_master',
      name: 'Cleric Grandmaster',
      description: '+90 MAG, +180 HP, +35 RES, +20 DEF',
      type: 'stat',
      statBonus: { mag: 90, maxHp: 180, res: 35, def: 20 },
      requiredLevel: 100,
      requiredNodes: ['epsilon_mag_5'],
      skillPointCost: 3,
      row: 5,
      column: 3
    }
  ]
};

/**
 * ZETA (BERSERKER) SKILL TREE
 * Focus: Attack, Critical, High-risk/high-reward
 */
export const ZETA_SKILL_TREE: SkillTree = {
  characterType: 'Zeta',
  maxAbilitySlots: 6,
  nodes: [
    // Row 1: Early game
    {
      id: 'zeta_atk_1',
      name: 'Primal Fury I',
      description: '+14 ATK',
      type: 'stat',
      statBonus: { atk: 14 },
      requiredLevel: 1,
      requiredNodes: [],
      skillPointCost: 1,
      row: 1,
      column: 1
    },
    {
      id: 'zeta_crt_1',
      name: 'Reckless Assault I',
      description: '+7% CRT',
      type: 'stat',
      statBonus: { crt: 7 },
      requiredLevel: 3,
      requiredNodes: ['zeta_atk_1'],
      skillPointCost: 1,
      row: 1,
      column: 2
    },
    {
      id: 'zeta_spd_1',
      name: 'Bloodlust Tempo I',
      description: '+10 SPD',
      type: 'stat',
      statBonus: { spd: 10 },
      requiredLevel: 5,
      requiredNodes: ['zeta_crt_1'],
      skillPointCost: 1,
      row: 1,
      column: 3
    },
    
    // Row 2: Early-mid game
    {
      id: 'zeta_atk_2',
      name: 'Primal Fury II',
      description: '+22 ATK',
      type: 'stat',
      statBonus: { atk: 22 },
      requiredLevel: 10,
      requiredNodes: ['zeta_spd_1'],
      skillPointCost: 1,
      row: 2,
      column: 1
    },
    {
      id: 'zeta_hp_1',
      name: 'Savage Endurance I',
      description: '+40 Max HP',
      type: 'stat',
      statBonus: { maxHp: 40 },
      requiredLevel: 15,
      requiredNodes: ['zeta_atk_2'],
      skillPointCost: 1,
      row: 2,
      column: 2
    },
    {
      id: 'zeta_crt_2',
      name: 'Reckless Assault II',
      description: '+10% CRT',
      type: 'stat',
      statBonus: { crt: 10 },
      requiredLevel: 20,
      requiredNodes: ['zeta_hp_1'],
      skillPointCost: 2,
      row: 2,
      column: 3
    },
    {
      id: 'zeta_acc_1',
      name: 'Brutal Precision',
      description: '+7% ACC',
      type: 'stat',
      statBonus: { acc: 7 },
      requiredLevel: 25,
      requiredNodes: ['zeta_crt_2'],
      skillPointCost: 1,
      row: 2,
      column: 4
    },
    
    // Row 3: Mid game
    {
      id: 'zeta_ability_5',
      name: 'Rage Arsenal',
      description: 'Unlock 5th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 30,
      requiredNodes: ['zeta_acc_1'],
      skillPointCost: 2,
      row: 3,
      column: 1
    },
    {
      id: 'zeta_atk_3',
      name: 'Primal Fury III',
      description: '+38 ATK',
      type: 'stat',
      statBonus: { atk: 38 },
      requiredLevel: 35,
      requiredNodes: ['zeta_ability_5'],
      skillPointCost: 2,
      row: 3,
      column: 2
    },
    {
      id: 'zeta_spd_2',
      name: 'Bloodlust Tempo II',
      description: '+18 SPD',
      type: 'stat',
      statBonus: { spd: 18 },
      requiredLevel: 40,
      requiredNodes: ['zeta_atk_3'],
      skillPointCost: 2,
      row: 3,
      column: 3
    },
    {
      id: 'zeta_crt_3',
      name: 'Reckless Assault III',
      description: '+14% CRT',
      type: 'stat',
      statBonus: { crt: 14 },
      requiredLevel: 45,
      requiredNodes: ['zeta_spd_2'],
      skillPointCost: 2,
      row: 3,
      column: 4
    },
    {
      id: 'zeta_hp_2',
      name: 'Savage Endurance II',
      description: '+70 Max HP',
      type: 'stat',
      statBonus: { maxHp: 70 },
      requiredLevel: 50,
      requiredNodes: ['zeta_crt_3'],
      skillPointCost: 2,
      row: 3,
      column: 5
    },
    
    // Row 4: Late game
    {
      id: 'zeta_def_1',
      name: 'Thick Skinned',
      description: '+15 DEF',
      type: 'stat',
      statBonus: { def: 15 },
      requiredLevel: 55,
      requiredNodes: ['zeta_hp_2'],
      skillPointCost: 1,
      row: 4,
      column: 1
    },
    {
      id: 'zeta_atk_4',
      name: 'Primal Fury IV',
      description: '+60 ATK',
      type: 'stat',
      statBonus: { atk: 60 },
      requiredLevel: 60,
      requiredNodes: ['zeta_def_1'],
      skillPointCost: 3,
      row: 4,
      column: 2
    },
    {
      id: 'zeta_ability_6',
      name: 'Apex Predator',
      description: 'Unlock 6th ability slot',
      type: 'abilitySlot',
      abilitySlotIncrease: 1,
      requiredLevel: 65,
      requiredNodes: ['zeta_atk_4'],
      skillPointCost: 3,
      row: 4,
      column: 3
    },
    {
      id: 'zeta_crt_4',
      name: 'Reckless Assault IV',
      description: '+18% CRT',
      type: 'stat',
      statBonus: { crt: 18 },
      requiredLevel: 70,
      requiredNodes: ['zeta_ability_6'],
      skillPointCost: 3,
      row: 4,
      column: 4
    },
    {
      id: 'zeta_spd_3',
      name: 'Bloodlust Tempo III',
      description: '+28 SPD',
      type: 'stat',
      statBonus: { spd: 28 },
      requiredLevel: 75,
      requiredNodes: ['zeta_crt_4'],
      skillPointCost: 2,
      row: 4,
      column: 5
    },
    
    // Row 5: End game
    {
      id: 'zeta_hp_3',
      name: 'Savage Endurance III',
      description: '+110 Max HP',
      type: 'stat',
      statBonus: { maxHp: 110 },
      requiredLevel: 80,
      requiredNodes: ['zeta_spd_3'],
      skillPointCost: 2,
      row: 5,
      column: 1
    },
    {
      id: 'zeta_atk_5',
      name: 'World Breaker',
      description: '+100 ATK',
      type: 'stat',
      statBonus: { atk: 100 },
      requiredLevel: 90,
      requiredNodes: ['zeta_hp_3'],
      skillPointCost: 3,
      row: 5,
      column: 2
    },
    {
      id: 'zeta_master',
      name: 'Berserker Grandmaster',
      description: '+120 ATK, +120 HP, +25% CRT, +35 SPD',
      type: 'stat',
      statBonus: { atk: 120, maxHp: 120, crt: 25, spd: 35 },
      requiredLevel: 100,
      requiredNodes: ['zeta_atk_5'],
      skillPointCost: 3,
      row: 5,
      column: 3
    }
  ]
};

/**
 * All skill trees indexed by character type
 */
export const SKILL_TREES: Record<string, SkillTree> = {
  'Alpha': ALPHA_SKILL_TREE,
  'Beta': BETA_SKILL_TREE,
  'Gamma': GAMMA_SKILL_TREE,
  'Delta': DELTA_SKILL_TREE,
  'Epsilon': EPSILON_SKILL_TREE,
  'Zeta': ZETA_SKILL_TREE
};

/**
 * Get skill tree for a character type
 */
export function getSkillTree(characterType: string): SkillTree | undefined {
  return SKILL_TREES[characterType];
}

/**
 * Get a specific skill node by ID
 */
export function getSkillNode(characterType: string, nodeId: string) {
  const tree = getSkillTree(characterType);
  return tree?.nodes.find(node => node.id === nodeId);
}
