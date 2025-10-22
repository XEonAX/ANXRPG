/**
 * Team Management Screen
 * Manage active te  // Main content area
  const content = createElement('div', 'team-content');
  
  // Active Team Section
  const activeSection = renderActiveTeamSection(uiState);
  content.appendChild(a  // Action buttons
  const actions = createElement('div', 'character-card__actions');
  
  const viewBtn = createButton('👁️ View', () => {
    ScreenManager.navigateTo('characterSheet', { uiState, characterId: character.id });
  }, 'btn btn--small btn--secondary');
  
  // Swap button (only show for active/reserve)
  if (location === 'active' || location === 'reserve') {
    const swapBtn = createButton(
      location === 'active' ? '⬇️ To Reserve' : '⬆️ To Active',
      () => handleSwap(character.id, location, uiState),
      'btn btn--small btn--secondary'
    );
    actions.appendChild(swapBtn);
  } 
  // Reserve Team Section
  const reserveSection = renderReserveTeamSection(uiState);
  content.appendChild(reserveSection);
  
  // Roster Section
  const rosterSection = renderRosterSection(uiState);
  content.appendChild(rosterSection);, reserve (up to 3 chars), and character selection
 */

import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { createElement, createButton, showNotification, formatNumber } from './core/UIHelpers';
import { swapCharacter, type UIGameState } from './core/UIState';
import type { Character } from '../types/character';

/**
 * Render the team management screen
 */
export function renderTeamManagement(context: ScreenContext): HTMLElement {
  const container = createElement('div', 'screen screen--team-management');
  
  // Get UI state from context
  const uiState = context.uiState as UIGameState | undefined;
  
  if (!uiState) {
    container.innerHTML = '<p>Error: No game state found. Please start a new game.</p>';
    return container;
  }
  
  // Header with navigation
  const header = createElement('header', 'team-header');
  const title = createElement('h1', 'team-header__title');
  title.textContent = '⚔️ Team Management';
  
  const nav = createElement('nav', 'team-header__nav');
  const campaignBtn = createButton('🗺️ Campaign', () => {
    ScreenManager.navigateTo('campaignMap', { uiState });
  }, 'btn btn--primary');
  const inventoryBtn = createButton('🎒 Inventory', () => {
    ScreenManager.navigateTo('inventory', { uiState });
  }, 'btn btn--secondary');
  const menuBtn = createButton('📋 Menu', () => {
    ScreenManager.navigateTo('mainMenu');
  }, 'btn btn--secondary');
  
  nav.appendChild(campaignBtn);
  nav.appendChild(inventoryBtn);
  nav.appendChild(menuBtn);
  
  header.appendChild(title);
  header.appendChild(nav);
  container.appendChild(header);
  
  // Main content area
  const content = createElement('div', 'team-content');
  
  // Active Team Section
  const activeSection = renderActiveTeamSection(uiState);
  content.appendChild(activeSection);
  
  // Reserve Team Section
  const reserveSection = renderReserveTeamSection(uiState);
  content.appendChild(reserveSection);
  
  // Roster Section
  const rosterSection = renderRosterSection(uiState);
  content.appendChild(rosterSection);
  
  container.appendChild(content);
  
  return container;
}

/**
 * Render the active team section (1-3 characters)
 */
function renderActiveTeamSection(uiState: UIGameState): HTMLElement {
  const section = createElement('section', 'team-section team-section--active');
  
  const header = createElement('div', 'team-section__header');
  const title = createElement('h2', 'team-section__title');
  title.textContent = '⚔️ Active Team';
  const subtitle = createElement('p', 'team-section__subtitle');
  subtitle.textContent = `${uiState.activeTeamIds.length} / 3 characters`;
  header.appendChild(title);
  header.appendChild(subtitle);
  
  const grid = createElement('div', 'character-grid');
  
  // Render active team characters
  const activeChars = uiState.saveData.roster.filter((c: Character) => uiState.activeTeamIds.includes(c.id));
  activeChars.forEach((char: Character) => {
    const card = renderCharacterCard(char, 'active', uiState);
    grid.appendChild(card);
  });
  
  // Add empty slots
  for (let i = uiState.activeTeamIds.length; i < 3; i++) {
    const emptySlot = renderEmptySlot('active', i);
    grid.appendChild(emptySlot);
  }
  
  section.appendChild(header);
  section.appendChild(grid);
  
  return section;
}

/**
 * Render the reserve team section (up to 3 characters)
 */
function renderReserveTeamSection(uiState: UIGameState): HTMLElement {
  const section = createElement('section', 'team-section team-section--reserve');
  
  const header = createElement('div', 'team-section__header');
  const title = createElement('h2', 'team-section__title');
  title.textContent = '🛡️ Reserve Team';
  const subtitle = createElement('p', 'team-section__subtitle');
  subtitle.textContent = `${uiState.reserveTeamIds.length} / 3 characters`;
  header.appendChild(title);
  header.appendChild(subtitle);
  
  const grid = createElement('div', 'character-grid');
  
  // Render reserve team characters
  const reserveChars = uiState.saveData.roster.filter((c: Character) => uiState.reserveTeamIds.includes(c.id));
  reserveChars.forEach((char: Character) => {
    const card = renderCharacterCard(char, 'reserve', uiState);
    grid.appendChild(card);
  });
  
  // Add empty slots
  for (let i = uiState.reserveTeamIds.length; i < 3; i++) {
    const emptySlot = renderEmptySlot('reserve', i);
    grid.appendChild(emptySlot);
  }
  
  section.appendChild(header);
  section.appendChild(grid);
  
  return section;
}

/**
 * Render the full roster section (all characters)
 */
function renderRosterSection(uiState: UIGameState): HTMLElement {
  const section = createElement('section', 'team-section team-section--roster');
  
  const header = createElement('div', 'team-section__header');
  const title = createElement('h2', 'team-section__title');
  title.textContent = '👥 Full Roster';
  const subtitle = createElement('p', 'team-section__subtitle');
  subtitle.textContent = `${uiState.saveData.roster.length} / 6 characters`;
  header.appendChild(title);
  header.appendChild(subtitle);
  
  const grid = createElement('div', 'character-grid character-grid--roster');
  
  // Render all roster characters
  uiState.saveData.roster.forEach((char: Character) => {
    const card = renderCharacterCard(char, 'roster', uiState);
    grid.appendChild(card);
  });
  
  section.appendChild(header);
  section.appendChild(grid);
  
  return section;
}

/**
 * Render a character card
 */
function renderCharacterCard(
  character: Character,
  location: 'active' | 'reserve' | 'roster',
  uiState: UIGameState
): HTMLElement {
  const card = createElement('div', 'character-card');
  card.setAttribute('data-character-id', character.id);
  card.setAttribute('data-location', location);
  
  // Character header
  const cardHeader = createElement('div', 'character-card__header');
  const name = createElement('h3', 'character-card__name');
  name.textContent = character.name;
  const level = createElement('span', 'character-card__level');
  level.textContent = `Lv ${character.level}`;
  cardHeader.appendChild(name);
  cardHeader.appendChild(level);
  
  // Character type badge
  const type = createElement('div', 'character-card__type');
  type.textContent = character.type;
  type.style.borderColor = getCharacterTypeColor(character.type);
  
  // HP Bar
  const hpBar = createElement('div', 'character-card__stat');
  const hpLabel = createElement('span', 'stat-label');
  hpLabel.textContent = 'HP:';
  const hpValue = createElement('span', 'stat-value');
  const hpPercent = (character.stats.hp / character.stats.maxHp) * 100;
  hpValue.innerHTML = `
    <div class="stat-bar">
      <div class="stat-bar__fill stat-bar__fill--hp" style="width: ${hpPercent}%"></div>
    </div>
    <span class="stat-text">${formatNumber(character.stats.hp)} / ${formatNumber(character.stats.maxHp)}</span>
  `;
  hpBar.appendChild(hpLabel);
  hpBar.appendChild(hpValue);
  
  // AP Indicator
  const apBar = createElement('div', 'character-card__stat');
  const apLabel = createElement('span', 'stat-label');
  apLabel.textContent = 'AP:';
  const apValue = createElement('span', 'stat-value');
  apValue.innerHTML = `
    <div class="ap-dots">
      ${Array.from({ length: 10 }, (_, i) => 
        `<span class="ap-dot ${i < character.currentAp ? 'ap-dot--filled' : ''}"></span>`
      ).join('')}
    </div>
    <span class="stat-text">${character.currentAp} / 10</span>
  `;
  apBar.appendChild(apLabel);
  apBar.appendChild(apValue);
  
  // Action buttons
  const actions = createElement('div', 'character-card__actions');
  
  const viewBtn = createButton('👁️ View', () => {
    ScreenManager.navigateTo('characterSheet', { uiState, characterId: character.id });
  }, 'btn btn--small btn--secondary');
  
  // Swap button (only show for active/reserve)
  if (location === 'active' || location === 'reserve') {
    const swapBtn = createButton(
      location === 'active' ? '⬇️ To Reserve' : '⬆️ To Active',
      () => handleSwap(character.id, location, uiState),
      'btn btn--small btn--secondary'
    );
    actions.appendChild(swapBtn);
  }
  
  actions.appendChild(viewBtn);
  
  // Assemble card
  card.appendChild(cardHeader);
  card.appendChild(type);
  card.appendChild(hpBar);
  card.appendChild(apBar);
  card.appendChild(actions);
  
  return card;
}

/**
 * Render an empty team slot
 */
function renderEmptySlot(location: 'active' | 'reserve', index: number): HTMLElement {
  const slot = createElement('div', 'character-card character-card--empty');
  slot.setAttribute('data-location', location);
  slot.setAttribute('data-index', index.toString());
  
  const icon = createElement('div', 'empty-slot__icon');
  icon.textContent = '➕';
  
  const text = createElement('div', 'empty-slot__text');
  text.textContent = 'Empty Slot';
  
  slot.appendChild(icon);
  slot.appendChild(text);
  
  return slot;
}

/**
 * Handle character swap between active and reserve
 */
function handleSwap(characterId: string, currentLocation: 'active' | 'reserve', uiState: UIGameState): void {
  const success = swapCharacter(characterId, currentLocation);
  
  if (!success) {
    const targetTeam = currentLocation === 'active' ? 'Reserve' : 'Active';
    showNotification(`${targetTeam} team is full!`, 'warning');
    return;
  }
  
  const character = uiState.saveData.roster.find((c: Character) => c.id === characterId);
  if (character) {
    showNotification(
      `${character.name} moved to ${currentLocation === 'active' ? 'reserve' : 'active'} team`,
      'success'
    );
  }
  
  // Refresh screen
  ScreenManager.updateContext({ uiState });
}

/**
 * Get character type color
 */
function getCharacterTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Alpha: '#ffd700',
    Beta: '#c0c0c0',
    Gamma: '#9333ea',
    Delta: '#dc2626',
    Epsilon: '#06b6d4',
    Zeta: '#dc143c'
  };
  return colors[type] || '#ffffff';
}
