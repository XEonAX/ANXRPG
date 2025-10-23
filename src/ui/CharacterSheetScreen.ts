import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { EventBus, GameEvents } from './core/EventBus';
import { 
  createElement, 
  createButton, 
  createProgressBar,
  showNotification,
  formatNumber 
} from './core/UIHelpers';
import type { UIGameState } from './core/UIState';
import type { Character } from '../types/character';
import type { SkillNode } from '../types/skillTree';
import { getSkillTree } from '../data/skillTrees';
import { 
  canUnlockNode, 
  unlockSkillNode, 
  calculateSkillTreeBonuses,
  getMaxAbilitySlots 
} from '../systems/skillTree';
import { 
  calculateCurrentStats, 
  syncCharacterStats,
  equipAbility,
  unequipAbility,
  swapAbilityPositions 
} from '../systems/character';
import { getAbility } from '../data/abilities';
import { getAbilityFlavorText } from '../data/flavorText';
import { saveGame } from '../systems/game';

/**
 * Render the character sheet screen
 */
export function renderCharacterSheet(context: ScreenContext): HTMLElement {
  const container = createElement('div', 'screen screen--character-sheet');
  
  const uiState = context.uiState as UIGameState | undefined;
  const characterId = context.characterId as string | undefined;
  
  if (!uiState || !characterId) {
    container.innerHTML = '<p>Error: No character selected</p>';
    return container;
  }
  
  // Find the character
  const character = uiState.saveData.roster.find(c => c.id === characterId);
  
  if (!character) {
    container.innerHTML = '<p>Error: Character not found</p>';
    return container;
  }
  
  // Sync character stats with current equipment and skill tree bonuses
  syncCharacterStats(character, uiState.saveData.inventory);
  
  // Header with character info
  const header = createElement('div', 'character-sheet__header');
  const title = createElement('h1', 'character-sheet__title');
  title.textContent = `${character.name} - ${character.type}`;
  
  const levelInfo = createElement('div', 'character-sheet__level-info');
  const levelText = createElement('span', 'character-sheet__level');
  levelText.textContent = `Level ${character.level}`;
  
  const xpText = createElement('span', 'character-sheet__xp');
  xpText.textContent = `${formatNumber(character.currentXp)} / ${formatNumber(character.xpToNextLevel)} XP`;
  
  const xpBar = createProgressBar(character.currentXp, character.xpToNextLevel, 'xp-bar');
  
  const skillPointsText = createElement('span', 'character-sheet__skill-points');
  skillPointsText.textContent = `💎 ${character.skillPoints} Skill Points`;
  if (character.skillPoints > 0) {
    skillPointsText.classList.add('character-sheet__skill-points--available');
  }
  
  levelInfo.appendChild(levelText);
  levelInfo.appendChild(xpText);
  levelInfo.appendChild(xpBar);
  levelInfo.appendChild(skillPointsText);
  
  header.appendChild(title);
  header.appendChild(levelInfo);
  
  // Navigation
  const nav = createElement('nav', 'character-sheet__nav');
  const backBtn = createButton('⬅️ Back to Team', () => {
    ScreenManager.goBack();
  }, 'btn btn--secondary');
  nav.appendChild(backBtn);
  header.appendChild(nav);
  
  container.appendChild(header);
  
  // Main content - 3 column layout
  const content = createElement('div', 'character-sheet__content');
  
  // Left column: Stats
  const statsSection = renderStatsSection(character, uiState);
  
  // Middle column: Equipment
  const equipmentSection = renderEquipmentSection(character, uiState);
  
  // Right column: Abilities
  const abilitiesSection = renderAbilitiesSection(character, uiState);
  
  content.appendChild(statsSection);
  content.appendChild(equipmentSection);
  content.appendChild(abilitiesSection);
  
  container.appendChild(content);
  
  // Full-width: Skill Tree
  const skillTreeSection = renderSkillTreeSection(character, uiState);
  container.appendChild(skillTreeSection);
  
  return container;
}

/**
 * Render stats section
 */
function renderStatsSection(character: Character, uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'character-sheet__section');
  
  const title = createElement('h2', 'character-sheet__section-title');
  title.textContent = '📊 Stats';
  section.appendChild(title);
  
  // Calculate total stats including equipment and skill tree bonuses
  const totalStats = calculateCurrentStats(character, uiState.saveData.inventory);
  const baseStats = character.stats;
  
  const statsTable = createElement('table', 'stats-table');
  
  // Helper function to format stat display
  const formatStat = (base: number, total: number, suffix: string = ''): string => {
    if (total === base) {
      return `${base}${suffix}`;
    } else {
      const bonus = total - base;
      const sign = bonus > 0 ? '+' : '';
      return `${total}${suffix} (${base}${suffix} ${sign}${bonus}${suffix})`;
    }
  };
  
  const stats = [
    { name: 'HP', value: `${totalStats.hp} / ${totalStats.maxHp}`, desc: 'Current / Maximum Hit Points' },
    { name: 'Max HP', value: formatStat(baseStats.maxHp, totalStats.maxHp), desc: 'Maximum health' },
    { name: 'ATK', value: formatStat(baseStats.atk, totalStats.atk), desc: 'Physical damage' },
    { name: 'DEF', value: formatStat(baseStats.def, totalStats.def), desc: 'Physical defense' },
    { name: 'MAG', value: formatStat(baseStats.mag, totalStats.mag), desc: 'Magical damage' },
    { name: 'RES', value: formatStat(baseStats.res, totalStats.res), desc: 'Magical defense' },
    { name: 'SPD', value: formatStat(baseStats.spd, totalStats.spd), desc: 'Turn order' },
    { name: 'CRT', value: formatStat(baseStats.crt, totalStats.crt, '%'), desc: 'Critical hit chance' },
    { name: 'EVA', value: formatStat(baseStats.eva, totalStats.eva, '%'), desc: 'Evasion chance' },
    { name: 'ACC', value: formatStat(baseStats.acc, totalStats.acc, '%'), desc: 'Accuracy' },
  ];
  
  stats.forEach(stat => {
    const row = createElement('tr', 'stats-table__row');
    
    const nameCell = createElement('td', 'stats-table__name');
    nameCell.textContent = stat.name;
    if (stat.desc) {
      nameCell.title = stat.desc;
    }
    
    const valueCell = createElement('td', 'stats-table__value');
    valueCell.textContent = String(stat.value);
    
    row.appendChild(nameCell);
    row.appendChild(valueCell);
    statsTable.appendChild(row);
  });
  
  section.appendChild(statsTable);
  
  // AP info
  const apInfo = createElement('div', 'character-sheet__ap-info');
  apInfo.innerHTML = `
    <p><strong>AP System:</strong></p>
    <p>Current: ${character.currentAp} / 10 AP</p>
    <p>Regen: +3 AP/turn (base)</p>
  `;
  section.appendChild(apInfo);
  
  return section;
}

/**
 * Render equipment section
 */
function renderEquipmentSection(character: Character, uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'character-sheet__section');
  
  const title = createElement('h2', 'character-sheet__section-title');
  title.textContent = '⚔️ Equipment';
  section.appendChild(title);
  
  const equipmentGrid = createElement('div', 'equipment-grid');
  
  const slots = [
    { key: 'mainHand', name: 'Main Hand', icon: '🗡️' },
    { key: 'offHand', name: 'Off Hand', icon: '🛡️' },
    { key: 'head', name: 'Head', icon: '🪖' },
    { key: 'chest', name: 'Chest', icon: '🦺' },
    { key: 'legs', name: 'Legs', icon: '👖' },
    { key: 'neck', name: 'Neck', icon: '📿' },
    { key: 'wrist1', name: 'Wrist 1', icon: '⌚' },
    { key: 'wrist2', name: 'Wrist 2', icon: '⌚' },
  ] as const;
  
  slots.forEach(slot => {
    const slotDiv = createElement('div', 'equipment-slot');
    
    const slotHeader = createElement('div', 'equipment-slot__header');
    slotHeader.textContent = `${slot.icon} ${slot.name}`;
    slotDiv.appendChild(slotHeader);
    
    const equipmentId = character.equipment[slot.key];
    
    if (equipmentId) {
      // Find equipment in inventory
      const equipment = uiState.saveData.inventory.find(e => e.id === equipmentId);
      
      if (equipment) {
        const itemDiv = createElement('div', `equipment-slot__item rarity-${equipment.rarity.toLowerCase()}`);
        itemDiv.textContent = equipment.name;
        itemDiv.title = `${equipment.rarity} | Lv ${equipment.level}`;
        
        const unequipBtn = createButton('Unequip', () => {
          character.equipment[slot.key] = null;
          saveGame();
          showNotification('Equipment unequipped', 'success');
          ScreenManager.updateContext({ uiState, characterId: character.id });
        }, 'btn btn--small');
        
        slotDiv.appendChild(itemDiv);
        slotDiv.appendChild(unequipBtn);
      } else {
        const emptyDiv = createElement('div', 'equipment-slot__empty');
        emptyDiv.textContent = 'Empty';
        slotDiv.appendChild(emptyDiv);
      }
    } else {
      const emptyDiv = createElement('div', 'equipment-slot__empty');
      emptyDiv.textContent = 'Empty';
      
      const equipBtn = createButton('Equip', () => {
        showNotification('Open Inventory to equip items', 'info');
        ScreenManager.navigateTo('inventory', { uiState, characterId: character.id });
      }, 'btn btn--small btn--secondary');
      
      slotDiv.appendChild(emptyDiv);
      slotDiv.appendChild(equipBtn);
    }
    
    equipmentGrid.appendChild(slotDiv);
  });
  
  section.appendChild(equipmentGrid);
  
  const inventoryBtn = createButton('📦 Open Inventory', () => {
    ScreenManager.navigateTo('inventory', { uiState, characterId: character.id });
  }, 'btn btn--primary');
  section.appendChild(inventoryBtn);
  
  return section;
}

/**
 * Render abilities section
 */
/**
 * Render abilities section
 */
function renderAbilitiesSection(character: Character, uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'character-sheet__section');
  
  const title = createElement('h2', 'character-sheet__section-title');
  title.textContent = '✨ Abilities';
  section.appendChild(title);
  
  const maxSlots = getMaxAbilitySlots(character);
  
  // Equipped abilities
  const equippedDiv = createElement('div', 'abilities-list');
  const equippedTitle = createElement('h3', 'abilities-list__title');
  equippedTitle.textContent = `Equipped (${character.equippedAbilities.length}/${maxSlots})`;
  equippedDiv.appendChild(equippedTitle);
  
  character.equippedAbilities.forEach((abilityId: string, index: number) => {
    const ability = getAbility(abilityId);
    if (!ability) return;
    
    const abilityCard = createElement('div', 'ability-card ability-card--equipped');
    
    const abilityName = createElement('div', 'ability-card__name');
    abilityName.textContent = ability.name;
    
    const abilityInfo = createElement('div', 'ability-card__info');
    abilityInfo.textContent = `${ability.apCost} AP | ${ability.targetType}`;
    
    const abilityDesc = createElement('div', 'ability-card__desc');
    const flavorText = getAbilityFlavorText(ability.id);
    abilityDesc.textContent = flavorText ? flavorText.description : ability.description;
    
    abilityCard.appendChild(abilityName);
    abilityCard.appendChild(abilityInfo);
    abilityCard.appendChild(abilityDesc);
    
    // Add effect description on second line
    if (flavorText) {
      const effectDesc = createElement('div', 'ability-card__effect');
      effectDesc.textContent = flavorText.effectDescription;
      abilityCard.appendChild(effectDesc);
    }
    
    // Unequip button
    const unequipBtn = createButton('Unequip', () => {
      if (unequipAbility(character, abilityId)) {
        saveGame();
        showNotification('Ability unequipped');
        // Update context without navigation to preserve scroll position
        ScreenManager.updateContext({ uiState, characterId: character.id });
      }
    }, 'btn btn--small btn--danger');
    
    const buttonContainer = createElement('div', 'ability-card__actions');
    buttonContainer.appendChild(unequipBtn);
    
    // Add position swap buttons if multiple abilities
    if (character.equippedAbilities.length > 1) {
      if (index > 0) {
        const upBtn = createButton('↑', () => {
          if (swapAbilityPositions(character, index, index - 1)) {
            saveGame();
            // Update context without navigation to preserve scroll position
            ScreenManager.updateContext({ uiState, characterId: character.id });
          }
        }, 'btn btn--small');
        buttonContainer.appendChild(upBtn);
      }
      if (index < character.equippedAbilities.length - 1) {
        const downBtn = createButton('↓', () => {
          if (swapAbilityPositions(character, index, index + 1)) {
            saveGame();
            // Update context without navigation to preserve scroll position
            ScreenManager.updateContext({ uiState, characterId: character.id });
          }
        }, 'btn btn--small');
        buttonContainer.appendChild(downBtn);
      }
    }
    
    abilityCard.appendChild(buttonContainer);
    equippedDiv.appendChild(abilityCard);
  });
  
  section.appendChild(equippedDiv);
  
  // Unlocked but not equipped
  const unlockedNotEquipped = character.unlockedAbilities.filter(
    (id: string) => !character.equippedAbilities.includes(id)
  );
  
  if (unlockedNotEquipped.length > 0) {
    const unlockedDiv = createElement('div', 'abilities-list');
    const unlockedTitle = createElement('h3', 'abilities-list__title');
    unlockedTitle.textContent = `Available to Equip (${unlockedNotEquipped.length})`;
    unlockedDiv.appendChild(unlockedTitle);
    
    unlockedNotEquipped.forEach((abilityId: string) => {
      const ability = getAbility(abilityId);
      if (!ability) return;
      
      const abilityCard = createElement('div', 'ability-card');
      
      const abilityName = createElement('div', 'ability-card__name');
      abilityName.textContent = ability.name;
      
      const abilityInfo = createElement('div', 'ability-card__info');
      abilityInfo.textContent = `${ability.apCost} AP | ${ability.targetType}`;
      
      const abilityDesc = createElement('div', 'ability-card__desc');
      const flavorText = getAbilityFlavorText(ability.id);
      abilityDesc.textContent = flavorText ? flavorText.description : ability.description;
      
      abilityCard.appendChild(abilityName);
      abilityCard.appendChild(abilityInfo);
      abilityCard.appendChild(abilityDesc);
      
      // Add effect description
      if (flavorText) {
        const effectDesc = createElement('div', 'ability-card__effect');
        effectDesc.textContent = flavorText.effectDescription;
        abilityCard.appendChild(effectDesc);
      }
      
      // Equip button
      const canEquip = character.equippedAbilities.length < maxSlots;
      const equipBtn = createButton(
        canEquip ? 'Equip' : `Full (${maxSlots}/${maxSlots})`,
        () => {
          if (equipAbility(character, abilityId)) {
            saveGame();
            showNotification('Ability equipped');
            // Update context without navigation to preserve scroll position
            ScreenManager.updateContext({ uiState, characterId: character.id });
          }
        },
        canEquip ? 'btn btn--small btn--primary' : 'btn btn--small btn--disabled'
      );
      
      if (!canEquip) {
        equipBtn.disabled = true;
      }
      
      const buttonContainer = createElement('div', 'ability-card__actions');
      buttonContainer.appendChild(equipBtn);
      abilityCard.appendChild(buttonContainer);
      
      unlockedDiv.appendChild(abilityCard);
    });
    
    section.appendChild(unlockedDiv);
  }
  
  return section;
}

/**
 * Render skill tree section
 */
function renderSkillTreeSection(character: Character, uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'character-sheet__section character-sheet__section--full');
  
  const title = createElement('h2', 'character-sheet__section-title');
  title.textContent = '🌳 Skill Tree';
  section.appendChild(title);
  
  const skillTree = getSkillTree(character.type);
  if (!skillTree) {
    section.innerHTML += '<p>Skill tree not found</p>';
    return section;
  }
  
  // Group nodes by row
  const nodesByRow: Map<number, SkillNode[]> = new Map();
  skillTree.nodes.forEach(node => {
    if (!nodesByRow.has(node.row)) {
      nodesByRow.set(node.row, []);
    }
    nodesByRow.get(node.row)!.push(node);
  });
  
  // Render rows
  const treeContainer = createElement('div', 'skill-tree');
  
  Array.from(nodesByRow.keys()).sort((a, b) => a - b).forEach(rowNum => {
    const rowDiv = createElement('div', 'skill-tree__row');
    
    const nodes = nodesByRow.get(rowNum)!;
    nodes.sort((a, b) => a.column - b.column);
    
    nodes.forEach(node => {
      const nodeDiv = renderSkillNode(node, character, uiState);
      rowDiv.appendChild(nodeDiv);
    });
    
    treeContainer.appendChild(rowDiv);
  });
  
  section.appendChild(treeContainer);
  
  return section;
}

/**
 * Render a single skill node
 */
function renderSkillNode(node: SkillNode, character: Character, uiState: UIGameState): HTMLElement {
  const progress = character.skillTreeNodes.find(p => p.nodeId === node.id);
  const pointsInvested = progress?.pointsInvested || 0;
  const isFullyUnlocked = pointsInvested >= node.skillPointCost;
  const canUnlock = canUnlockNode(character, node.id);
  
  const nodeDiv = createElement('div', 'skill-node');
  
  if (isFullyUnlocked) {
    nodeDiv.classList.add('skill-node--unlocked');
  } else if (canUnlock.canUnlock) {
    nodeDiv.classList.add('skill-node--available');
  } else {
    nodeDiv.classList.add('skill-node--locked');
  }
  
  // Node type indicator
  const typeIcon = createElement('div', 'skill-node__type');
  typeIcon.textContent = node.type === 'stat' ? '📈' : '✨';
  nodeDiv.appendChild(typeIcon);
  
  // Node name
  const name = createElement('div', 'skill-node__name');
  name.textContent = node.name;
  nodeDiv.appendChild(name);
  
  // Description
  const desc = createElement('div', 'skill-node__desc');
  desc.textContent = node.description;
  nodeDiv.appendChild(desc);
  
  // Cost and progress
  const cost = createElement('div', 'skill-node__cost');
  if (node.skillPointCost > 1) {
    cost.textContent = `${pointsInvested}/${node.skillPointCost} points`;
  } else {
    cost.textContent = `${node.skillPointCost} point`;
  }
  nodeDiv.appendChild(cost);
  
  // Level requirement
  if (character.level < node.requiredLevel) {
    const reqDiv = createElement('div', 'skill-node__requirement');
    reqDiv.textContent = `Requires Lv ${node.requiredLevel}`;
    nodeDiv.appendChild(reqDiv);
  }
  
  // Unlock button
  if (!isFullyUnlocked && canUnlock.canUnlock) {
    const unlockBtn = createButton('Unlock', () => {
      if (unlockSkillNode(character, node.id)) {
        // Recalculate bonuses
        calculateSkillTreeBonuses(character);
        
        saveGame();
        EventBus.emit(GameEvents.CHARACTER_LEVEL_UP, character);
        showNotification(`Unlocked: ${node.name}`, 'success');
        
        // Re-render
        ScreenManager.updateContext({ uiState, characterId: character.id });
      } else {
        showNotification('Failed to unlock node', 'error');
      }
    }, 'btn btn--small btn--primary');
    nodeDiv.appendChild(unlockBtn);
  } else if (!isFullyUnlocked && !canUnlock.canUnlock) {
    const reasonDiv = createElement('div', 'skill-node__locked-reason');
    reasonDiv.textContent = canUnlock.reason || 'Locked';
    nodeDiv.appendChild(reasonDiv);
  }
  
  // Tooltip for stat bonuses
  if (node.statBonus) {
    const bonuses = Object.entries(node.statBonus)
      .map(([stat, value]) => `${stat}: +${value}`)
      .join(', ');
    nodeDiv.title = `${node.description}\n${bonuses}`;
  } else if (node.abilityId) {
    const ability = getAbility(node.abilityId);
    nodeDiv.title = `${node.description}\nUnlocks: ${ability?.name || node.abilityId}`;
  }
  
  return nodeDiv;
}
