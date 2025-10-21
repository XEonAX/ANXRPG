/**
 * Equipment Templates and Data
 * Defines equipment templates for procedural generation
 */

import type { EquipmentTemplate, EquipmentSlot, EquipmentRarity } from '../types';

/**
 * Equipment rarity multipliers for stat scaling
 */
export const RARITY_MULTIPLIERS: Record<EquipmentRarity, number> = {
  basic: 0.6,
  common: 1.0,
  uncommon: 1.4,
  rare: 2.0,
  epic: 2.8,
  legendary: 4.0,
  mythic: 6.0,
};

/**
 * Equipment name prefixes by rarity tier
 */
export const RARITY_PREFIXES: Record<EquipmentRarity, string[]> = {
  basic: ['Worn', 'Rusty', 'Tattered', 'Crude', 'Simple'],
  common: ['Iron', 'Leather', 'Bronze', 'Basic', 'Standard'],
  uncommon: ['Steel', 'Reinforced', 'Silver', 'Quality', 'Sturdy'],
  rare: ['Mithril', 'Enchanted', 'Blessed', 'Master', 'Superior'],
  epic: ['Dragonbone', 'Celestial', 'Infernal', 'Ancient', 'Legendary'],
  legendary: ['Godforged', 'Eternal', 'Primordial', 'Divine', 'Supreme'],
  mythic: ['Worldbreaker', 'Starborn', 'Void-touched', 'Reality-warping', 'Cosmic'],
};

/**
 * Weapon templates
 */
export const WEAPON_TEMPLATES: EquipmentTemplate[] = [
  {
    baseType: 'weapon-single',
    slot: 'mainHand',
    namePrefixes: [],
    nameSuffixes: ['Sword', 'Axe', 'Mace', 'Dagger', 'Spear'],
    statScaling: [
      { stat: 'atk', baseValue: 5, growthRate: 2.0 },
      { stat: 'acc', baseValue: 2, growthRate: 0.3 },
    ],
  },
  {
    baseType: 'weapon-dual',
    slot: 'mainHand',
    namePrefixes: [],
    nameSuffixes: ['Greatsword', 'Greataxe', 'Halberd', 'Warhammer', 'Staff'],
    statScaling: [
      { stat: 'atk', baseValue: 8, growthRate: 3.0 },
      { stat: 'mag', baseValue: 8, growthRate: 3.0 },
      { stat: 'acc', baseValue: 1, growthRate: 0.2 },
    ],
  },
];

/**
 * Shield/Off-hand templates
 */
export const OFFHAND_TEMPLATES: EquipmentTemplate[] = [
  {
    baseType: 'shield',
    slot: 'offHand',
    namePrefixes: [],
    nameSuffixes: ['Shield', 'Buckler', 'Tower Shield', 'Kite Shield'],
    statScaling: [
      { stat: 'def', baseValue: 8, growthRate: 2.5 },
      { stat: 'res', baseValue: 5, growthRate: 1.5 },
      { stat: 'eva', baseValue: 1, growthRate: 0.2 },
    ],
  },
  {
    baseType: 'weapon-single',
    slot: 'offHand',
    namePrefixes: [],
    nameSuffixes: ['Blade', 'Knife', 'Dirk', 'Short Sword'],
    statScaling: [
      { stat: 'atk', baseValue: 3, growthRate: 1.0 },
      { stat: 'spd', baseValue: 3, growthRate: 0.5 },
    ],
  },
];

/**
 * Armor templates
 */
export const ARMOR_TEMPLATES: EquipmentTemplate[] = [
  {
    baseType: 'helmet',
    slot: 'head',
    namePrefixes: [],
    nameSuffixes: ['Helmet', 'Helm', 'Crown', 'Cap', 'Hood'],
    statScaling: [
      { stat: 'def', baseValue: 4, growthRate: 1.5 },
      { stat: 'res', baseValue: 4, growthRate: 1.5 },
    ],
  },
  {
    baseType: 'armor',
    slot: 'chest',
    namePrefixes: [],
    nameSuffixes: ['Armor', 'Chestplate', 'Breastplate', 'Tunic', 'Robe'],
    statScaling: [
      { stat: 'def', baseValue: 10, growthRate: 3.0 },
      { stat: 'res', baseValue: 8, growthRate: 2.5 },
      { stat: 'hp', baseValue: 15, growthRate: 5.0 },
    ],
  },
  {
    baseType: 'pants',
    slot: 'legs',
    namePrefixes: [],
    nameSuffixes: ['Leggings', 'Greaves', 'Pants', 'Trousers', 'Legplates'],
    statScaling: [
      { stat: 'def', baseValue: 6, growthRate: 2.0 },
      { stat: 'res', baseValue: 5, growthRate: 1.8 },
      { stat: 'spd', baseValue: 2, growthRate: 0.4 },
    ],
  },
];

/**
 * Accessory templates
 */
export const ACCESSORY_TEMPLATES: EquipmentTemplate[] = [
  {
    baseType: 'amulet',
    slot: 'neck',
    namePrefixes: [],
    nameSuffixes: ['Amulet', 'Necklace', 'Pendant', 'Medallion', 'Talisman'],
    statScaling: [
      { stat: 'mag', baseValue: 5, growthRate: 1.8 },
      { stat: 'res', baseValue: 4, growthRate: 1.5 },
      { stat: 'hp', baseValue: 10, growthRate: 3.0 },
    ],
  },
  {
    baseType: 'bracer',
    slot: 'wrist1',
    namePrefixes: [],
    nameSuffixes: ['Bracer', 'Bracelet', 'Wristguard', 'Band', 'Cuff'],
    statScaling: [
      { stat: 'atk', baseValue: 3, growthRate: 1.2 },
      { stat: 'def', baseValue: 3, growthRate: 1.2 },
      { stat: 'spd', baseValue: 2, growthRate: 0.5 },
    ],
  },
];

/**
 * All equipment templates combined
 */
export const ALL_EQUIPMENT_TEMPLATES: EquipmentTemplate[] = [
  ...WEAPON_TEMPLATES,
  ...OFFHAND_TEMPLATES,
  ...ARMOR_TEMPLATES,
  ...ACCESSORY_TEMPLATES,
];

/**
 * Get rarity based on level (higher levels = higher rarity chance)
 */
export function getRarityForLevel(level: number): EquipmentRarity {
  // Base rarity distribution
  const roll = Math.random() * 100;
  
  // Level affects rarity chances
  const rarityBonus = Math.min(level / 5, 20); // Max +20% at level 100
  
  if (roll < 30 - rarityBonus) return 'basic';
  if (roll < 60 - rarityBonus) return 'common';
  if (roll < 80) return 'uncommon';
  if (roll < 92 + rarityBonus / 2) return 'rare';
  if (roll < 98 + rarityBonus / 2) return 'epic';
  if (roll < 99.5 + rarityBonus / 2) return 'legendary';
  return 'mythic';
}

/**
 * Get equipment templates by slot
 */
export function getTemplatesForSlot(slot: EquipmentSlot): EquipmentTemplate[] {
  // Wrist slots can use the same template
  const searchSlot = slot === 'wrist2' ? 'wrist1' : slot;
  return ALL_EQUIPMENT_TEMPLATES.filter(template => template.slot === searchSlot);
}
