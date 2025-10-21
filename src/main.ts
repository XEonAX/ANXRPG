/**
 * ANXRPG - Main Entry Point
 * Turn-based Fighting RPG
 */

import './style.css';
import { createCharacter } from './systems/character';
import { CHARACTER_TYPES } from './data/characterTypes';
import { ABILITIES } from './data/abilities';

console.log('=== ANXRPG Initialization ===');
console.log('Character Types:', Object.keys(CHARACTER_TYPES));
console.log('Total Abilities:', Object.keys(ABILITIES).length);

// Create a test character to verify system works
const testCharacter = createCharacter('Alpha', 1, 'Test Paladin');
console.log('Test Character Created:', testCharacter);

// Render basic UI
const gameScreen = document.querySelector<HTMLElement>('#game-screen');
if (gameScreen) {
  gameScreen.innerHTML = `
    <section class="game-info">
      <h2>ANXRPG - Development Build</h2>
      <p><strong>Status:</strong> Phase 3 Complete - Ability System Implemented</p>
      <p><strong>Character Types:</strong> ${Object.keys(CHARACTER_TYPES).length}</p>
      <p><strong>Total Abilities:</strong> ${Object.keys(ABILITIES).length}</p>
    </section>
    
    <section class="character-preview">
      <h3>Test Character: ${testCharacter.name}</h3>
      <dl>
        <dt>Type:</dt><dd>${testCharacter.type}</dd>
        <dt>Level:</dt><dd>${testCharacter.level}</dd>
        <dt>HP:</dt><dd>${testCharacter.stats.hp} / ${testCharacter.stats.maxHp}</dd>
        <dt>AP:</dt><dd>${testCharacter.currentAp} / 10</dd>
        <dt>ATK:</dt><dd>${testCharacter.stats.atk}</dd>
        <dt>DEF:</dt><dd>${testCharacter.stats.def}</dd>
        <dt>MAG:</dt><dd>${testCharacter.stats.mag}</dd>
        <dt>SPD:</dt><dd>${testCharacter.stats.spd}</dd>
      </dl>
    </section>
    
    <section class="next-steps">
      <h3>Implementation Progress</h3>
      <ul>
        <li>✅ Phase 1: Project Foundation</li>
        <li>✅ Phase 2: Character System (6 types)</li>
        <li>✅ Phase 3: Ability System (24 abilities)</li>
        <li>⏳ Phase 4: Equipment System</li>
        <li>⏳ Phase 5: Status Effects Engine</li>
        <li>⏳ Phase 6: Combat Engine</li>
        <li>⏳ Phases 7-14: Remaining systems</li>
      </ul>
    </section>
  `;
}

console.log('=== Ready for Phase 4 ===');
