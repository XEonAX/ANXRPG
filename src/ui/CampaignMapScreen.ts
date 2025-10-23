import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { EventBus, GameEvents } from './core/EventBus';
import { createElement, createButton, showNotification } from './core/UIHelpers';
import type { UIGameState } from './core/UIState';
import type { Stage } from '../types/campaign';
import { STAGES } from '../data/stages';
import { getStageInfo, generateStageEnemies } from '../systems/campaign';
import { initializeCombat } from '../systems/combat';
import { syncCharacterStats } from '../systems/character';

/**
 * Render the campaign map screen showing all 100 stages
 */
export function renderCampaignMap(context: ScreenContext): HTMLElement {
  console.log('[CampaignMap] Rendering campaign map', context);
  const container = createElement('div', 'screen screen--campaign-map');
  
  // Get UI state from context
  const uiState = context.uiState as UIGameState | undefined;
  const autoStartStage = context.autoStartStage as number | undefined;
  
  if (!uiState) {
    console.error('[CampaignMap] No UI state found!');
    container.innerHTML = '<p>Error: No game state found. Please start a new game.</p>';
    return container;
  }
  
  console.log('[CampaignMap] UI State:', uiState);
  console.log('[CampaignMap] Campaign progress:', uiState.saveData.campaign);
  
  // Auto-start next stage if requested
  if (autoStartStage !== undefined) {
    const stage = STAGES.find(s => s.stageNumber === autoStartStage);
    if (stage) {
      setTimeout(() => {
        handleStageSelect(stage, uiState);
      }, 100);
    }
  }
  
  // Header
  const header = createElement('div', 'campaign-header');
  const title = createElement('h1', 'campaign-header__title');
  title.textContent = '🗺️ Campaign Map';
  
  const subtitle = createElement('p', 'campaign-header__subtitle');
  const currentStage = uiState.saveData.campaign.currentStage;
  const completedCount = uiState.saveData.campaign.completedStages.size;
  subtitle.textContent = `Stage ${currentStage} | ${completedCount} / 100 Completed`;
  
  const nav = createElement('nav', 'campaign-header__nav');
  const teamBtn = createButton('👥 Team', () => {
    ScreenManager.navigateTo('teamManagement', { uiState });
  }, 'btn btn--secondary');
  const inventoryBtn = createButton('🎒 Inventory', () => {
    ScreenManager.navigateTo('inventory', { uiState });
  }, 'btn btn--secondary');
  const menuBtn = createButton('📋 Menu', () => {
    ScreenManager.navigateTo('mainMenu');
  }, 'btn btn--secondary');
  
  nav.appendChild(teamBtn);
  nav.appendChild(inventoryBtn);
  nav.appendChild(menuBtn);
  
  header.appendChild(title);
  header.appendChild(subtitle);
  header.appendChild(nav);
  container.appendChild(header);
  
  // Main content - stage list grouped by tiers
  const content = createElement('div', 'campaign-content');
  
  const tierGroups = groupStagesByTier(STAGES);
  
  tierGroups.forEach((group) => {
    const tierSection = renderTierSection(group, uiState);
    content.appendChild(tierSection);
  });
  
  container.appendChild(content);
  
  return container;
}

/**
 * Group stages by enemy tier for organized display
 */
interface TierGroup {
  tierName: string;
  tierRange: string;
  stages: Stage[];
}

function groupStagesByTier(stages: Stage[]): TierGroup[] {
  const groups: TierGroup[] = [
    { tierName: 'Slimes & Rats', tierRange: '1-10', stages: [] },
    { tierName: 'Goblins & Wolves', tierRange: '11-20', stages: [] },
    { tierName: 'Orcs & Trolls', tierRange: '21-30', stages: [] },
    { tierName: 'Demons & Dragons', tierRange: '31-50', stages: [] },
    { tierName: 'Behemoths & Titans', tierRange: '51-70', stages: [] },
    { tierName: 'Fallen Angels', tierRange: '71-90', stages: [] },
    { tierName: 'Gods', tierRange: '91-100', stages: [] },
  ];
  
  stages.forEach((stage) => {
    if (stage.stageNumber <= 10) groups[0].stages.push(stage);
    else if (stage.stageNumber <= 20) groups[1].stages.push(stage);
    else if (stage.stageNumber <= 30) groups[2].stages.push(stage);
    else if (stage.stageNumber <= 50) groups[3].stages.push(stage);
    else if (stage.stageNumber <= 70) groups[4].stages.push(stage);
    else if (stage.stageNumber <= 90) groups[5].stages.push(stage);
    else groups[6].stages.push(stage);
  });
  
  return groups;
}

/**
 * Render a tier section with all stages in that tier
 */
function renderTierSection(group: TierGroup, uiState: UIGameState): HTMLElement {
  const section = createElement('section', 'tier-section');
  
  const header = createElement('div', 'tier-section__header');
  const title = createElement('h2', 'tier-section__title');
  title.textContent = `${group.tierName} (Stages ${group.tierRange})`;
  
  const progress = createElement('p', 'tier-section__progress');
  const completed = group.stages.filter((s) => 
    uiState.saveData.campaign.completedStages.has(s.stageNumber)
  ).length;
  progress.textContent = `${completed} / ${group.stages.length} Completed`;
  
  header.appendChild(title);
  header.appendChild(progress);
  section.appendChild(header);
  
  // Stage grid
  const grid = createElement('div', 'stage-grid');
  
  group.stages.forEach((stage) => {
    const stageCard = renderStageCard(stage, uiState);
    grid.appendChild(stageCard);
  });
  
  section.appendChild(grid);
  
  return section;
}

/**
 * Render a single stage card
 */
function renderStageCard(stage: Stage, uiState: UIGameState): HTMLElement {
  const card = createElement('div', 'stage-card');
  
  const stageInfo = getStageInfo(stage.stageNumber, uiState.saveData.campaign, uiState.saveData.roster);
  if (!stageInfo) {
    // Fallback for missing stage info
    card.innerHTML = '<p>Error loading stage</p>';
    return card;
  }
  
  const isCompleted = stageInfo.isCompleted;
  const isUnlocked = stageInfo.canAccess;
  const isBoss = stage.isBossStage;
  
  // Determine if this is the next stage to play (unlocked but not completed)
  const isNextStage = isUnlocked && !isCompleted;
  
  // Add modifiers
  if (isCompleted) card.classList.add('stage-card--completed');
  if (!isUnlocked) card.classList.add('stage-card--locked');
  if (isBoss) card.classList.add('stage-card--boss');
  // Mark as current if it's the next stage to play (unlocked and not completed)
  if (isNextStage) card.classList.add('stage-card--current');
  
  // Stage number
  const number = createElement('div', 'stage-card__number');
  number.textContent = `${stage.stageNumber}`;
  if (isBoss) {
    const bossIcon = createElement('span', 'stage-card__boss-icon');
    bossIcon.textContent = '👑';
    number.appendChild(bossIcon);
  }
  
  // Stage name
  const name = createElement('div', 'stage-card__name');
  name.textContent = stage.name;
  
  // Enemy info
  const enemyInfo = createElement('div', 'stage-card__enemies');
  const enemyCount = stage.enemyTeamSize;
  const levelRange = stage.enemyLevelRange;
  const levelText = levelRange.min === levelRange.max 
    ? `Lv.${levelRange.min}` 
    : `Lv.${levelRange.min}-${levelRange.max}`;
  enemyInfo.textContent = `${enemyCount}× ${levelText}`;
  
  // Rewards (calculated approximately based on level)
  const avgLevel = (levelRange.min + levelRange.max) / 2;
  const baseXP = 50 + (avgLevel * 10);
  const baseGold = 10 + (avgLevel * 5);
  const rewards = createElement('div', 'stage-card__rewards');
  rewards.innerHTML = `
    <span>💰 ${Math.round(baseGold * stage.rewardModifiers.xpMultiplier)} Gold</span>
    <span>⭐ ${Math.round(baseXP * stage.rewardModifiers.xpMultiplier)} XP</span>
  `;
  
  // Status indicator
  const status = createElement('div', 'stage-card__status');
  if (isCompleted) {
    status.textContent = '✓ Completed (Replay)';
  } else if (isUnlocked) {
    status.textContent = '🔓 Ready';
  } else {
    status.textContent = '🔒 Locked';
  }
  
  // Click handler - allow both unlocked incomplete stages AND completed stages (for grinding)
  if (isUnlocked) {
    card.classList.add('stage-card--clickable');
    card.addEventListener('click', () => handleStageSelect(stage, uiState));
  }
  
  card.appendChild(number);
  card.appendChild(name);
  card.appendChild(enemyInfo);
  card.appendChild(rewards);
  card.appendChild(status);
  
  return card;
}

/**
 * Handle stage selection - initiate combat
 */
function handleStageSelect(stage: Stage, uiState: UIGameState): void {
  // Validate active team
  if (uiState.activeTeamIds.length === 0) {
    showNotification('You must have at least one character in your active team!', 'error');
    return;
  }
  
  // Get active and reserve team characters
  const activeTeam = uiState.saveData.roster.filter(c => 
    uiState.activeTeamIds.includes(c.id)
  );
  const reserveTeam = uiState.saveData.roster.filter(c => 
    uiState.reserveTeamIds.includes(c.id)
  );
  
  // Validate team health
  const allDead = activeTeam.every(c => c.stats.hp <= 0);
  if (allDead) {
    showNotification('Your active team has no HP! Heal them or swap in reserve members.', 'warning');
    return;
  }
  
  // Generate enemies for this stage
  const enemies = generateStageEnemies(stage);
  
  // Sync character stats with equipment bonuses before combat
  [...activeTeam, ...reserveTeam].forEach(character => {
    syncCharacterStats(character, uiState.saveData.inventory);
  });
  
  // Initialize combat
  try {
    const combat = initializeCombat(activeTeam, reserveTeam, enemies);
    
    // Emit combat start event
    EventBus.emit(GameEvents.COMBAT_START, combat);
    
    // Navigate to combat screen
    ScreenManager.navigateTo('combat', { 
      uiState, 
      combat,
      stage 
    });
    
    showNotification(`Battle Started: ${stage.name}`, 'success');
  } catch (error) {
    console.error('Failed to initialize combat:', error);
    showNotification('Failed to start combat. Please try again.', 'error');
  }
}
