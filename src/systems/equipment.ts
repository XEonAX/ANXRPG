/**
 * Equipment System
 * Equipment generation, stat calculation, and management
 */

import type { Equipment, EquipmentSlot, EquipmentStatBonus, EquipmentRarity } from '../types';
import { 
  ALL_EQUIPMENT_TEMPLATES, 
  RARITY_MULTIPLIERS, 
  RARITY_PREFIXES,
  getRarityForLevel,
  getTemplatesForSlot
} from '../data/equipmentTemplates';
import { generateId, randomElement } from '../utils/random';

/**
 * Generate equipment at a specific level
 */
export function generateEquipment(level: number, slot?: EquipmentSlot): Equipment {
  // Select template
  const templates = slot 
    ? getTemplatesForSlot(slot)
    : ALL_EQUIPMENT_TEMPLATES;
  
  const template = randomElement(templates);
  const rarity = getRarityForLevel(level);
  const rarityMultiplier = RARITY_MULTIPLIERS[rarity];
  
  // Calculate stat bonuses based on level and rarity
  const statBonuses: EquipmentStatBonus[] = template.statScaling.map(scaling => {
    const baseValue = scaling.baseValue * rarityMultiplier;
    const levelBonus = scaling.growthRate * (level - 1) * rarityMultiplier;
    const totalValue = Math.floor(baseValue + levelBonus);
    
    return {
      stat: scaling.stat,
      value: totalValue,
      isPercentage: false,
    };
  });
  
  // Generate name
  const prefix = randomElement(RARITY_PREFIXES[rarity]);
  const suffix = randomElement(template.nameSuffixes);
  const name = `${prefix} ${suffix}`;
  
  // Use provided slot or template slot
  // This allows wrist1 template to generate wrist2 items
  const finalSlot = slot || template.slot;
  
  // Create equipment
  return {
    id: generateId(),
    name,
    description: `A ${rarity} quality ${template.baseType}.`,
    type: template.baseType,
    slot: finalSlot,
    rarity,
    level,
    statBonuses,
    flavorText: generateFlavorText(rarity, template.baseType),
  };
}

/**
 * Generate flavor text based on rarity
 */
function generateFlavorText(rarity: EquipmentRarity, _baseType: string): string {
  const flavorTexts: Record<EquipmentRarity, string[]> = {
    basic: [
      'Seen better days.',
      'It\'ll do in a pinch.',
      'Basic but functional.',
    ],
    common: [
      'Standard issue equipment.',
      'Reliable and sturdy.',
      'Nothing fancy, but it works.',
    ],
    uncommon: [
      'Well-crafted by skilled hands.',
      'Above average quality.',
      'You can feel the quality.',
    ],
    rare: [
      'Imbued with magical energy.',
      'Forged by master craftsmen.',
      'A treasure worth keeping.',
    ],
    epic: [
      'Legendary craftsmanship!',
      'Power radiates from it.',
      'Heroes have wielded such items.',
    ],
    legendary: [
      'Forged by the gods themselves!',
      'Its power is undeniable.',
      'Few have seen such magnificence.',
    ],
    mythic: [
      'Reality bends around it.',
      'This should not exist.',
      'The stuff of legends made real.',
    ],
  };
  
  return randomElement(flavorTexts[rarity]);
}

/**
 * Calculate total stat bonuses from equipment
 */
export function calculateEquipmentBonuses(
  equipment: Record<EquipmentSlot, string | null>,
  equipmentInventory: Equipment[]
): Record<string, number> {
  const bonuses: Record<string, number> = {};
  
  // Iterate through all equipment slots
  Object.entries(equipment).forEach(([_slot, equipmentId]) => {
    if (!equipmentId) return;
    
    // Find equipment in inventory
    const equippedItem = equipmentInventory.find(item => item.id === equipmentId);
    if (!equippedItem) return;
    
    // Add stat bonuses
    equippedItem.statBonuses.forEach(bonus => {
      const statKey = bonus.stat;
      bonuses[statKey] = (bonuses[statKey] || 0) + bonus.value;
    });
  });
  
  return bonuses;
}

/**
 * Check if character can equip an item
 */
export function canEquipItem(characterLevel: number, item: Equipment): boolean {
  return characterLevel >= item.level;
}

/**
 * Equip an item to a character
 * Returns true if successful
 */
export function equipItem(
  characterEquipment: Record<EquipmentSlot, string | null>,
  item: Equipment,
  characterLevel: number
): { success: boolean; error?: string; unequippedItems?: string[] } {
  // Check level requirement
  if (!canEquipItem(characterLevel, item)) {
    return {
      success: false,
      error: `Level ${item.level} required to equip this item.`,
    };
  }
  
  const unequippedItems: string[] = [];
  
  // Handle dual-handed weapons
  if (item.type === 'weapon-dual') {
    // Unequip both main hand and off hand
    if (characterEquipment.mainHand) unequippedItems.push(characterEquipment.mainHand);
    if (characterEquipment.offHand) unequippedItems.push(characterEquipment.offHand);
    
    characterEquipment.mainHand = item.id;
    characterEquipment.offHand = null;
  } else {
    // Regular equipment
    const slot = item.slot;
    
    // Unequip current item in slot
    if (characterEquipment[slot]) {
      unequippedItems.push(characterEquipment[slot]!);
    }
    
    characterEquipment[slot] = item.id;
  }
  
  return {
    success: true,
    unequippedItems: unequippedItems.length > 0 ? unequippedItems : undefined,
  };
}

/**
 * Unequip an item from a character
 */
export function unequipItem(
  characterEquipment: Record<EquipmentSlot, string | null>,
  slot: EquipmentSlot
): string | null {
  const itemId = characterEquipment[slot];
  characterEquipment[slot] = null;
  
  // If unequipping main hand with dual weapon, also clear off hand
  if (slot === 'mainHand' && !characterEquipment.offHand) {
    // Main hand might be a dual weapon, check doesn't matter as offHand is already null
  }
  
  return itemId;
}

/**
 * Generate starting equipment for a character
 */
export function generateStartingEquipment(_characterType: string): Equipment[] {
  const equipment: Equipment[] = [];
  
  // Basic weapon (level 1)
  equipment.push(generateEquipment(1, 'mainHand'));
  
  // Basic armor pieces (level 1)
  equipment.push(generateEquipment(1, 'head'));
  equipment.push(generateEquipment(1, 'chest'));
  equipment.push(generateEquipment(1, 'legs'));
  
  return equipment;
}

/**
 * Get equipment by ID from inventory
 */
export function getEquipmentById(inventory: Equipment[], id: string): Equipment | undefined {
  return inventory.find(item => item.id === id);
}

/**
 * Sort equipment by level and rarity
 */
export function sortEquipment(equipment: Equipment[]): Equipment[] {
  const rarityOrder: Record<EquipmentRarity, number> = {
    basic: 0,
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mythic: 6,
  };
  
  return [...equipment].sort((a, b) => {
    // First sort by level (descending)
    if (b.level !== a.level) return b.level - a.level;
    
    // Then by rarity (descending)
    return rarityOrder[b.rarity] - rarityOrder[a.rarity];
  });
}
