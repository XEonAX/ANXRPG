/**
 * ANXRPG - Main Entry Point
 * Turn-based Fighting RPG
 * 
 * Phase 8 Complete: Skill Trees & Recruitment System
 */

import './style.css';
import { createCharacter, calculateCurrentStats } from './systems/character';
import { generateEquipment, equipItem, calculateEquipmentBonuses } from './systems/equipment';
import { 
  unlockSkillNode, 
  calculateSkillTreeBonuses,
  getAvailableNodes,
  getMaxAbilitySlots,
  getSkillTreeSummary 
} from './systems/skillTree';
import { 
  getRecruitmentStatus,
  recruitCharacter 
} from './systems/recruitment';
import { CHARACTER_TYPES } from './data/characterTypes';
import { ABILITIES } from './data/abilities';
import { getSkillTree } from './data/skillTrees';

// Import test suites for browser console
import { 
  demoSimpleBattle, 
  demoBossBattle, 
  demoXpRewards, 
  runAllCombatDemos 
} from './tests/combatDemo';
import { phase8Tests } from './tests/phase8Tests';

console.log('╔════════════════════════════════════════╗');
console.log('║      ANXRPG - Development Build       ║');
console.log('║         Phase 8 Complete (57%)        ║');
console.log('╚════════════════════════════════════════╝');
console.log('\n📊 System Status:');
console.log('✅ Phase 1: Project Foundation');
console.log('✅ Phase 2: Character System (6 types)');
console.log('✅ Phase 3: Ability System (24 abilities)');
console.log('✅ Phase 4: Equipment System');
console.log('✅ Phase 5: Status Effects (26 effects)');
console.log('✅ Phase 6: Combat Engine');
console.log('✅ Phase 7: Enemy System (28 templates)');
console.log('✅ Phase 8: Progression System (120 skill nodes)');
console.log('⏳ Phase 9-14: Campaign, Save, UI, Polish\n');

console.log('📚 Available in console:');
console.log('  - combatDemo.all()    // Run combat tests');
console.log('  - phase8Tests.all()   // Run skill tree & recruitment tests');
console.log('  - CHARACTER_TYPES     // View character definitions');
console.log('  - ABILITIES           // View all abilities\n');

// Make test functions available globally
if (typeof window !== 'undefined') {
  (window as any).combatDemo = {
    simple: demoSimpleBattle,
    boss: demoBossBattle,
    xp: demoXpRewards,
    all: runAllCombatDemos
  };
  (window as any).phase8Tests = phase8Tests;
  (window as any).CHARACTER_TYPES = CHARACTER_TYPES;
  (window as any).ABILITIES = ABILITIES;
}

// ═══════════════════════════════════════════════════════════
// DEMO: Create a character and showcase Phase 8 features
// ═══════════════════════════════════════════════════════════

// Create a level 50 character with skill points
const demoCharacter = createCharacter('Alpha', 50, 'Legendary Paladin');
console.log(`\n🎭 Created: ${demoCharacter.name} (${demoCharacter.type}, Level ${demoCharacter.level})`);
console.log(`   Skill Points Available: ${demoCharacter.skillPoints}`);

// Auto-unlock first few skill tree nodes
const alphaSkilltree = getSkillTree('Alpha');
console.log(`\n🌳 Skill Tree: ${alphaSkilltree?.nodes.length} nodes available`);

const nodesToUnlock = [
  'alpha_hp_1',      // +25 HP
  'alpha_def_1',     // +8 DEF
  'alpha_res_1',     // +6 RES
  'alpha_atk_1',     // +10 ATK
  'alpha_hp_2',      // +40 HP (2 points)
  'alpha_def_2',     // +12 DEF
  'alpha_acc_1',     // +5% ACC
  'alpha_ability_5'  // 5th ability slot (2 points)
];

let unlockedCount = 0;
for (const nodeId of nodesToUnlock) {
  if (unlockSkillNode(demoCharacter, nodeId)) {
    unlockedCount++;
  }
}

console.log(`   Unlocked ${unlockedCount} skill nodes`);

// Calculate and display skill tree bonuses
const skillTreeBonuses = calculateSkillTreeBonuses(demoCharacter);
console.log(`\n⚔️  Skill Tree Bonuses:`, skillTreeBonuses.stats);
console.log(`   Additional Ability Slots: ${skillTreeBonuses.additionalAbilitySlots}`);
console.log(`   Max Ability Slots: ${getMaxAbilitySlots(demoCharacter)}`);

// Generate and equip some items
const equipment = [
  generateEquipment(50, 'mainHand'),
  generateEquipment(50, 'chest'),
  generateEquipment(50, 'head'),
  generateEquipment(50, 'legs')
];

equipment.forEach(item => {
  equipItem(demoCharacter.equipment, item, demoCharacter.level);
});

console.log(`\n🛡️  Equipped ${equipment.length} items (Level 50 gear)`);

// Calculate final stats
const finalStats = calculateCurrentStats(demoCharacter, equipment);
const equipBonuses = calculateEquipmentBonuses(demoCharacter.equipment, equipment);

console.log(`\n📊 Final Stats (Base + Skill Tree + Equipment):`);
console.log(`   HP: ${finalStats.maxHp} (${demoCharacter.stats.maxHp} base)`);
console.log(`   ATK: ${finalStats.atk} (${demoCharacter.stats.atk} base + ${skillTreeBonuses.stats.atk || 0} skill + ${equipBonuses.atk || 0} equip)`);
console.log(`   DEF: ${finalStats.def} (${demoCharacter.stats.def} base + ${skillTreeBonuses.stats.def || 0} skill + ${equipBonuses.def || 0} equip)`);

// Demonstrate recruitment system
const recruitmentStatus = getRecruitmentStatus(45, 2); // 45 victories, 2 characters
console.log(`\n🎖️  Recruitment Status (45 victories, 2 chars):`);
console.log(`   Milestones Reached: ${recruitmentStatus.milestonesReached}/5`);
console.log(`   Can Recruit: ${recruitmentStatus.canRecruit ? '✅ Yes' : '❌ No'}`);
console.log(`   Next Milestone: ${recruitmentStatus.nextMilestone} victories`);
console.log(`   Battles Remaining: ${recruitmentStatus.battlesRemaining}`);

if (recruitmentStatus.canRecruit) {
  const newRecruit = recruitCharacter('Beta', 'Speedy Rogue');
  console.log(`   Recruited: ${newRecruit.name} (Level ${newRecruit.level})`);
}

// ═══════════════════════════════════════════════════════════
// RENDER UI
// ═══════════════════════════════════════════════════════════

const gameScreen = document.querySelector<HTMLElement>('#game-screen');
if (gameScreen) {
  const availableNodes = getAvailableNodes(demoCharacter);
  const skillSummary = getSkillTreeSummary(demoCharacter);
  
  gameScreen.innerHTML = `
    <section class="game-info">
      <h2>🎮 ANXRPG - Development Build v0.8.0</h2>
      <p><strong>Status:</strong> Phase 8 Complete - Skill Trees & Recruitment System</p>
      <div class="stats-grid">
        <div><strong>Character Types:</strong> ${Object.keys(CHARACTER_TYPES).length}</div>
        <div><strong>Abilities:</strong> ${Object.keys(ABILITIES).length}</div>
        <div><strong>Skill Tree Nodes:</strong> 120 (20 per type)</div>
        <div><strong>Recruitment Milestones:</strong> 5</div>
      </div>
    </section>
    
    <section class="character-preview">
      <h3>🎭 Demo Character: ${demoCharacter.name}</h3>
      <div class="char-header">
        <span class="char-type">${demoCharacter.type} (Paladin)</span>
        <span class="char-level">Level ${demoCharacter.level}</span>
        <span class="skill-points">${demoCharacter.skillPoints} Skill Points</span>
      </div>
      
      <div class="stats-display">
        <div class="stat-group">
          <h4>Combat Stats</h4>
          <dl>
            <dt>HP:</dt><dd>${finalStats.hp} / ${finalStats.maxHp}</dd>
            <dt>AP:</dt><dd>${demoCharacter.currentAp} / 10</dd>
            <dt>ATK:</dt><dd>${finalStats.atk} <small>(+${(skillTreeBonuses.stats.atk || 0) + (equipBonuses.atk || 0)} bonus)</small></dd>
            <dt>DEF:</dt><dd>${finalStats.def} <small>(+${(skillTreeBonuses.stats.def || 0) + (equipBonuses.def || 0)} bonus)</small></dd>
            <dt>MAG:</dt><dd>${finalStats.mag}</dd>
            <dt>RES:</dt><dd>${finalStats.res} <small>(+${(skillTreeBonuses.stats.res || 0) + (equipBonuses.res || 0)} bonus)</small></dd>
            <dt>SPD:</dt><dd>${finalStats.spd}</dd>
          </dl>
        </div>
        
        <div class="stat-group">
          <h4>Advanced Stats</h4>
          <dl>
            <dt>CRT:</dt><dd>${finalStats.crt}%</dd>
            <dt>EVA:</dt><dd>${finalStats.eva}%</dd>
            <dt>ACC:</dt><dd>${finalStats.acc}% <small>(+${skillTreeBonuses.stats.acc || 0}% skill)</small></dd>
          </dl>
        </div>
      </div>
    </section>
    
    <section class="skill-tree-preview">
      <h3>🌳 Skill Tree Progress</h3>
      <div class="skill-stats">
        <div>
          <strong>Nodes Unlocked:</strong> ${skillSummary.unlockedNodes} / ${skillSummary.totalNodes}
        </div>
        <div>
          <strong>Points Invested:</strong> ${skillSummary.skillPointsInvested}
        </div>
        <div>
          <strong>Ability Slots:</strong> ${skillSummary.maxAbilitySlots} (4 base + ${skillTreeBonuses.additionalAbilitySlots} skill tree)
        </div>
      </div>
      
      <div class="unlocked-nodes">
        <h4>Recently Unlocked Nodes:</h4>
        <ul>
          <li>✅ Fortified Health I (+25 HP)</li>
          <li>✅ Shield Mastery I (+8 DEF)</li>
          <li>✅ Holy Resistance I (+6 RES)</li>
          <li>✅ Righteous Might I (+10 ATK)</li>
          <li>✅ Divine Arsenal (5th ability slot)</li>
        </ul>
      </div>
      
      <div class="available-nodes">
        <h4>Available to Unlock (${availableNodes.length} nodes):</h4>
        <ul>
          ${availableNodes.slice(0, 5).map(node => `
            <li>⭐ ${node.name} - ${node.description} (${node.skillPointCost} point${node.skillPointCost > 1 ? 's' : ''})</li>
          `).join('')}
          ${availableNodes.length > 5 ? `<li><em>... and ${availableNodes.length - 5} more</em></li>` : ''}
        </ul>
      </div>
    </section>
    
    <section class="equipment-display">
      <h3>🛡️ Equipped Items</h3>
      <ul class="equipment-list">
        ${equipment.map(item => `
          <li>
            <strong>${item.slot}:</strong> 
            <span class="item-name rarity-${item.rarity.toLowerCase()}">${item.name}</span>
            <span class="item-details">(${item.rarity}, Lv ${item.level})</span>
            <div class="item-stats">${Object.entries(item.statBonuses).map(([stat, val]) => `+${val} ${stat.toUpperCase()}`).join(', ')}</div>
          </li>
        `).join('')}
      </ul>
    </section>
    
    <section class="recruitment-display">
      <h3>🎖️ Recruitment System</h3>
      <div class="recruitment-progress">
        <p><strong>Current:</strong> 45 victories (2 characters in roster)</p>
        <p><strong>Milestones:</strong> 20 ✅ | 40 ✅ | 60 (${recruitmentStatus.battlesRemaining} battles away) | 80 | 100</p>
        <p><strong>Status:</strong> ${recruitmentStatus.canRecruit ? '✅ Can recruit new character!' : `❌ Next recruitment at ${recruitmentStatus.nextMilestone} victories`}</p>
      </div>
    </section>
    
    <section class="next-steps">
      <h3>📋 Implementation Progress</h3>
      <div class="progress-grid">
        <div class="phase-complete">✅ Phase 1: Project Foundation</div>
        <div class="phase-complete">✅ Phase 2: Character System (6 types)</div>
        <div class="phase-complete">✅ Phase 3: Ability System (24 abilities)</div>
        <div class="phase-complete">✅ Phase 4: Equipment System</div>
        <div class="phase-complete">✅ Phase 5: Status Effects (26 effects)</div>
        <div class="phase-complete">✅ Phase 6: Combat Engine</div>
        <div class="phase-complete">✅ Phase 7: Enemy System (28 templates, 40+ abilities)</div>
        <div class="phase-complete">✅ Phase 8: Progression System (120 skill nodes, recruitment)</div>
        <div class="phase-pending">⏳ Phase 9: Campaign System (100 stages)</div>
        <div class="phase-pending">⏳ Phase 10: Save/Load System</div>
        <div class="phase-pending">⏳ Phase 11: UI Implementation</div>
        <div class="phase-pending">⏳ Phase 12-14: Polish & Balance</div>
      </div>
      
      <div class="test-commands">
        <h4>🧪 Test in Browser Console:</h4>
        <code>combatDemo.all()</code> - Run combat test scenarios<br>
        <code>phase8Tests.all()</code> - Test skill trees & recruitment<br>
        <code>phase8Tests.skillTreeStats()</code> - Test stat bonuses<br>
        <code>phase8Tests.recruitment()</code> - Test recruitment system
      </div>
    </section>
  `;
}

console.log('\n✅ ANXRPG initialized successfully!');
console.log('💡 Run tests in console: combatDemo.all() or phase8Tests.all()');
console.log('═══════════════════════════════════════════════════════════\n');
