/**
 * ANXRPG - Main Entry Point
 * Turn-based Fighting RPG
 */

import './style.css';
import { createCharacter, calculateCurrentStats } from './systems/character';
import { generateEquipment, equipItem, calculateEquipmentBonuses } from './systems/equipment';
import { CHARACTER_TYPES } from './data/characterTypes';
import { ABILITIES } from './data/abilities';

console.log('=== ANXRPG Initialization ===');
console.log('Character Types:', Object.keys(CHARACTER_TYPES));
console.log('Total Abilities:', Object.keys(ABILITIES).length);

// Create a test character to verify system works
const testCharacter = createCharacter('Alpha', 10, 'Test Paladin');

// Generate some test equipment
const testWeapon = generateEquipment(10, 'mainHand');
const testArmor = generateEquipment(10, 'chest');
const testHelmet = generateEquipment(10, 'head');

console.log('Test Equipment Generated:');
console.log('- Weapon:', testWeapon.name, testWeapon.statBonuses);
console.log('- Armor:', testArmor.name, testArmor.statBonuses);
console.log('- Helmet:', testHelmet.name, testHelmet.statBonuses);

// Equip items
const inventory = [testWeapon, testArmor, testHelmet];
equipItem(testCharacter.equipment, testWeapon, testCharacter.level);
equipItem(testCharacter.equipment, testArmor, testCharacter.level);
equipItem(testCharacter.equipment, testHelmet, testCharacter.level);

// Calculate stats with equipment
const statsWithEquipment = calculateCurrentStats(testCharacter, inventory);
const equipBonuses = calculateEquipmentBonuses(testCharacter.equipment, inventory);

console.log('Equipment Bonuses:', equipBonuses);
console.log('Base Stats:', testCharacter.stats);
console.log('Stats with Equipment:', statsWithEquipment);

// Render basic UI
const gameScreen = document.querySelector<HTMLElement>('#game-screen');
if (gameScreen) {
  const renderStatBonus = (_stat: string, bonus: number) => 
    bonus > 0 ? `<span class="stat-bonus">+${bonus}</span>` : '';
  
  gameScreen.innerHTML = `
    <section class="game-info">
      <h2>ANXRPG - Development Build</h2>
      <p><strong>Status:</strong> Phase 4 Complete - Equipment System Implemented</p>
      <p><strong>Character Types:</strong> ${Object.keys(CHARACTER_TYPES).length}</p>
      <p><strong>Total Abilities:</strong> ${Object.keys(ABILITIES).length}</p>
    </section>
    
    <section class="character-preview">
      <h3>Test Character: ${testCharacter.name}</h3>
      <dl>
        <dt>Type:</dt><dd>${testCharacter.type}</dd>
        <dt>Level:</dt><dd>${testCharacter.level}</dd>
        <dt>HP:</dt><dd>${statsWithEquipment.hp} / ${statsWithEquipment.maxHp} ${renderStatBonus('hp', equipBonuses.hp || 0)}</dd>
        <dt>AP:</dt><dd>${testCharacter.currentAp} / 10</dd>
        <dt>ATK:</dt><dd>${statsWithEquipment.atk} ${renderStatBonus('atk', equipBonuses.atk || 0)}</dd>
        <dt>DEF:</dt><dd>${statsWithEquipment.def} ${renderStatBonus('def', equipBonuses.def || 0)}</dd>
        <dt>MAG:</dt><dd>${statsWithEquipment.mag} ${renderStatBonus('mag', equipBonuses.mag || 0)}</dd>
        <dt>RES:</dt><dd>${statsWithEquipment.res} ${renderStatBonus('res', equipBonuses.res || 0)}</dd>
        <dt>SPD:</dt><dd>${statsWithEquipment.spd} ${renderStatBonus('spd', equipBonuses.spd || 0)}</dd>
      </dl>
    </section>
    
    <section class="equipment-display">
      <h3>Equipped Items</h3>
      <ul>
        <li><strong>Weapon:</strong> ${testWeapon.name} (${testWeapon.rarity}, Lv ${testWeapon.level})</li>
        <li><strong>Chest:</strong> ${testArmor.name} (${testArmor.rarity}, Lv ${testArmor.level})</li>
        <li><strong>Head:</strong> ${testHelmet.name} (${testHelmet.rarity}, Lv ${testHelmet.level})</li>
      </ul>
      <p><em>${testWeapon.flavorText}</em></p>
    </section>
    
    <section class="next-steps">
      <h3>Implementation Progress</h3>
      <ul>
        <li>✅ Phase 1: Project Foundation</li>
        <li>✅ Phase 2: Character System (6 types)</li>
        <li>✅ Phase 3: Ability System (24 abilities)</li>
        <li>✅ Phase 4: Equipment System (8 slots, rarity tiers)</li>
        <li>⏳ Phase 5: Status Effects Engine</li>
        <li>⏳ Phase 6: Combat Engine</li>
        <li>⏳ Phases 7-14: Remaining systems</li>
      </ul>
    </section>
  `;
}

console.log('=== Ready for Phase 5 ===');
