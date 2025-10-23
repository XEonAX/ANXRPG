/**
 * Recruitment Screen
 * 
 * Allows player to recruit new characters at milestone victories (20, 40, 60, 80, 100)
 */

import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { EventBus, GameEvents } from './core/EventBus';
import { createElement, createButton, showNotification } from './core/UIHelpers';
import type { UIGameState } from './core/UIState';
import { recruitCharacter, getRecruitmentStatus } from '../systems/recruitment';
import { getCharacterType } from '../data/characterTypes';
import type { CharacterTypeName, CharacterType } from '../types/character';
import { saveGame } from '../utils/storage';

/**
 * Render the recruitment screen
 */
export function renderRecruitment(context: ScreenContext): HTMLElement {
  const container = createElement('div', 'screen screen--recruitment');
  
  const uiState = context.uiState as UIGameState | undefined;
  const milestone = context.milestone as number | undefined;
  const returnToStage = context.returnToStage as number | undefined;
  
  if (!uiState) {
    container.innerHTML = '<p>Error: No game state found.</p>';
    return container;
  }
  
  // Get recruitment status
  const status = getRecruitmentStatus(
    uiState.saveData.statistics.totalVictories,
    uiState.saveData.roster.length
  );
  
  // Header
  const header = createElement('div', 'recruitment__header');
  const title = createElement('h1', 'recruitment__title');
  title.textContent = '🎉 New Recruit Available!';
  
  const subtitle = createElement('p', 'recruitment__subtitle');
  if (milestone) {
    subtitle.textContent = `Congratulations on ${milestone} victories! Choose a new character to join your team.`;
  } else {
    subtitle.textContent = `Choose a new character to join your team.`;
  }
  
  header.appendChild(title);
  header.appendChild(subtitle);
  
  // Recruitment info
  const info = createElement('div', 'recruitment__info');
  const infoText = createElement('p', 'recruitment__info-text');
  infoText.textContent = `Roster: ${uiState.saveData.roster.length} / 6 characters`;
  info.appendChild(infoText);
  
  if (status.nextMilestone) {
    const nextMilestone = createElement('p', 'recruitment__next-milestone');
    nextMilestone.textContent = `Next recruitment at ${status.nextMilestone} victories (${status.battlesRemaining} battles remaining)`;
    info.appendChild(nextMilestone);
  }
  
  container.appendChild(header);
  container.appendChild(info);
  
  // Character selection grid
  const grid = createElement('div', 'recruitment__grid');
  
  // Render all 6 character types
  const characterTypes: CharacterTypeName[] = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
  
  characterTypes.forEach(typeName => {
    const typeData = getCharacterType(typeName);
    if (!typeData) return;
    
    const card = renderCharacterTypeCard(typeName, typeData, uiState, returnToStage);
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  
  return container;
}

/**
 * Render a character type selection card
 */
function renderCharacterTypeCard(
  typeName: CharacterTypeName,
  typeData: CharacterType,
  uiState: UIGameState,
  returnToStage?: number
): HTMLElement {
  const card = createElement('div', 'recruitment-card');
  
  // Header
  const header = createElement('div', 'recruitment-card__header');
  const name = createElement('h3', 'recruitment-card__name');
  name.textContent = typeName;
  name.style.color = getCharacterTypeColor(typeName);
  
  const role = createElement('p', 'recruitment-card__role');
  role.textContent = typeData.role;
  
  header.appendChild(name);
  header.appendChild(role);
  
  // Description
  const description = createElement('p', 'recruitment-card__description');
  description.textContent = typeData.description;
  
  // Base stats
  const statsSection = createElement('div', 'recruitment-card__stats');
  const statsTitle = createElement('h4', 'recruitment-card__stats-title');
  statsTitle.textContent = 'Base Stats (Level 1)';
  
  const statsList = createElement('ul', 'recruitment-card__stats-list');
  
  const statsToShow = [
    { label: 'HP', value: typeData.baseStats.maxHp },
    { label: 'ATK', value: typeData.baseStats.atk },
    { label: 'DEF', value: typeData.baseStats.def },
    { label: 'MAG', value: typeData.baseStats.mag },
    { label: 'RES', value: typeData.baseStats.res },
    { label: 'SPD', value: typeData.baseStats.spd },
    { label: 'CRT', value: `${typeData.baseStats.crt}%` },
    { label: 'EVA', value: `${typeData.baseStats.eva}%` },
    { label: 'ACC', value: `${typeData.baseStats.acc}%` },
  ];
  
  statsToShow.forEach(stat => {
    const statItem = createElement('li', 'stat-item');
    statItem.innerHTML = `<span class="stat-label">${stat.label}:</span> <span class="stat-value">${stat.value}</span>`;
    statsList.appendChild(statItem);
  });
  
  statsSection.appendChild(statsTitle);
  statsSection.appendChild(statsList);
  
  // Special traits
  const traitsSection = createElement('div', 'recruitment-card__traits');
  const traitsTitle = createElement('h4', 'recruitment-card__traits-title');
  traitsTitle.textContent = 'Traits';
  
  const traitsList = createElement('ul', 'recruitment-card__traits-list');
  
  // AP Regen
  const apTrait = createElement('li', 'trait-item');
  apTrait.textContent = `+${typeData.baseApRegen} AP per turn`;
  traitsList.appendChild(apTrait);
  
  // Starting abilities (first 4 from their ability list)
  const abilitiesTrait = createElement('li', 'trait-item');
  abilitiesTrait.textContent = `4 unique abilities unlocked through leveling`;
  traitsList.appendChild(abilitiesTrait);
  
  traitsSection.appendChild(traitsTitle);
  traitsSection.appendChild(traitsList);
  
  // Select button
  const selectBtn = createButton(
    '✅ Recruit This Character',
    () => handleRecruitment(typeName, uiState, returnToStage),
    'btn btn--primary btn--large'
  );
  
  // Assemble card
  card.appendChild(header);
  card.appendChild(description);
  card.appendChild(statsSection);
  card.appendChild(traitsSection);
  card.appendChild(selectBtn);
  
  return card;
}

/**
 * Handle character recruitment
 */
function handleRecruitment(
  characterType: CharacterTypeName,
  uiState: UIGameState,
  returnToStage?: number
): void {
  // Check if roster is full
  if (uiState.saveData.roster.length >= 6) {
    showNotification('⚠️ Roster is full! You must retire a character first.', 'warning');
    // TODO: Implement retirement UI
    return;
  }
  
  // Recruit the character
  const newCharacter = recruitCharacter(characterType);
  
  // Add to roster
  uiState.saveData.roster.push(newCharacter);
  
  // Add to reserve team if there's space
  if (uiState.reserveTeamIds.length < 3) {
    uiState.reserveTeamIds.push(newCharacter.id);
  }
  
  // Save game
  saveGame(uiState.saveData, false);
  saveGame(uiState.saveData, true);
  EventBus.emit(GameEvents.GAME_SAVED);
  
  // Show success message
  showNotification(`✅ ${newCharacter.name} (${characterType}) has joined your team!`, 'success');
  
  // Return to campaign map
  setTimeout(() => {
    if (returnToStage) {
      ScreenManager.navigateTo('campaignMap', { uiState, autoStartStage: returnToStage });
    } else {
      ScreenManager.navigateTo('campaignMap', { uiState });
    }
  }, 1000);
}

/**
 * Get character type color
 */
function getCharacterTypeColor(type: CharacterTypeName): string {
  const colors: Record<CharacterTypeName, string> = {
    Alpha: '#ffd700',
    Beta: '#c0c0c0',
    Gamma: '#9333ea',
    Delta: '#dc2626',
    Epsilon: '#06b6d4',
    Zeta: '#dc143c'
  };
  return colors[type] || '#ffffff';
}
