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
  
  // Make grid a drop zone
  setupDropZone(grid, 'active', uiState);
  
  // Render active team characters
  const activeChars = uiState.saveData.roster.filter((c: Character) => uiState.activeTeamIds.includes(c.id));
  // Maintain order from activeTeamIds
  const orderedChars = uiState.activeTeamIds.map(id => activeChars.find(c => c.id === id)).filter(Boolean) as Character[];
  orderedChars.forEach((char: Character) => {
    const card = renderCharacterCard(char, 'active', uiState);
    grid.appendChild(card);
  });
  
  // Add empty slots
  for (let i = uiState.activeTeamIds.length; i < 3; i++) {
    const emptySlot = renderEmptySlot('active', i, uiState);
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
  
  // Make grid a drop zone
  setupDropZone(grid, 'reserve', uiState);
  
  // Render reserve team characters
  const reserveChars = uiState.saveData.roster.filter((c: Character) => uiState.reserveTeamIds.includes(c.id));
  // Maintain order from reserveTeamIds
  const orderedChars = uiState.reserveTeamIds.map(id => reserveChars.find(c => c.id === id)).filter(Boolean) as Character[];
  orderedChars.forEach((char: Character) => {
    const card = renderCharacterCard(char, 'reserve', uiState);
    grid.appendChild(card);
  });
  
  // Add empty slots
  for (let i = uiState.reserveTeamIds.length; i < 3; i++) {
    const emptySlot = renderEmptySlot('reserve', i, uiState);
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
  
  // Make card draggable
  card.setAttribute('draggable', 'true');
  
  // Drag start handler
  card.addEventListener('dragstart', (e: DragEvent) => {
    if (!e.dataTransfer) return;
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', character.id);
    e.dataTransfer.setData('application/character-id', character.id);
    e.dataTransfer.setData('application/source-location', location);
    
    card.classList.add('dragging');
    
    // Create compact custom drag image
    const dragImage = document.createElement('div');
    dragImage.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
      border: 2px solid ${getCharacterTypeColor(character.type)};
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      color: white;
      font-family: inherit;
      min-width: 200px;
      backdrop-filter: blur(10px);
    `;
    dragImage.innerHTML = `
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">${character.name}</div>
      <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">${character.type} • Lv ${character.level}</div>
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 100, 30);
    setTimeout(() => dragImage.remove(), 0);
  });
  
  // Drag end handler
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });
  
  // Make card a drop target (for reordering/swapping)
  if (location === 'active' || location === 'reserve') {
    card.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
      card.classList.add('drop-target');
    });
    
    card.addEventListener('dragleave', () => {
      card.classList.remove('drop-target');
    });
    
    card.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent parent drop handler
      card.classList.remove('drop-target');
      
      if (!e.dataTransfer) return;
      
      const draggedCharId = e.dataTransfer.getData('application/character-id');
      const sourceLocation = e.dataTransfer.getData('application/source-location') as 'active' | 'reserve' | 'roster';
      
      // Don't drop on self
      if (draggedCharId === character.id) return;
      
      handleDrop(draggedCharId, sourceLocation, location, character.id, uiState);
    });
  }
  
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
  
  // Swap/Assign buttons based on location
  if (location === 'active' || location === 'reserve') {
    // Swap button for characters already in teams
    const swapBtn = createButton(
      location === 'active' ? '⬇️ To Reserve' : '⬆️ To Active',
      () => handleSwap(character.id, location, uiState),
      'btn btn--small btn--secondary'
    );
    actions.appendChild(swapBtn);
  } else if (location === 'roster') {
    // Check if character is unassigned
    const isUnassigned = !uiState.activeTeamIds.includes(character.id) && 
                        !uiState.reserveTeamIds.includes(character.id);
    
    if (isUnassigned) {
      // Show assign buttons for unassigned characters
      if (uiState.activeTeamIds.length < 3) {
        const assignActiveBtn = createButton(
          '⬆️ To Active',
          () => handleAssignToTeam(character.id, 'active', uiState),
          'btn btn--small btn--primary'
        );
        actions.appendChild(assignActiveBtn);
      }
      
      if (uiState.reserveTeamIds.length < 3) {
        const assignReserveBtn = createButton(
          '⬇️ To Reserve',
          () => handleAssignToTeam(character.id, 'reserve', uiState),
          'btn btn--small btn--primary'
        );
        actions.appendChild(assignReserveBtn);
      }
    }
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
function renderEmptySlot(location: 'active' | 'reserve', index: number, uiState: UIGameState): HTMLElement {
  const slot = createElement('div', 'character-card character-card--empty');
  slot.setAttribute('data-location', location);
  slot.setAttribute('data-index', index.toString());
  
  // Make empty slot a drop zone
  slot.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    slot.classList.add('drop-target');
  });
  
  slot.addEventListener('dragleave', () => {
    slot.classList.remove('drop-target');
  });
  
  slot.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    slot.classList.remove('drop-target');
    
    if (!e.dataTransfer) return;
    
    const characterId = e.dataTransfer.getData('application/character-id');
    const sourceLocation = e.dataTransfer.getData('application/source-location') as 'active' | 'reserve' | 'roster';
    
    handleDrop(characterId, sourceLocation, location, null, uiState);
  });
  
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
 * Handle assigning an unassigned character to a team
 */
function handleAssignToTeam(characterId: string, targetTeam: 'active' | 'reserve', uiState: UIGameState): void {
  const character = uiState.saveData.roster.find((c: Character) => c.id === characterId);
  
  if (!character) {
    showNotification('Character not found!', 'error');
    return;
  }
  
  // Check if character is already assigned
  if (uiState.activeTeamIds.includes(characterId) || uiState.reserveTeamIds.includes(characterId)) {
    showNotification('Character is already assigned to a team!', 'warning');
    return;
  }
  
  // Check if target team is full
  const targetTeamIds = targetTeam === 'active' ? uiState.activeTeamIds : uiState.reserveTeamIds;
  if (targetTeamIds.length >= 3) {
    showNotification(`${targetTeam === 'active' ? 'Active' : 'Reserve'} team is full!`, 'warning');
    return;
  }
  
  // Add to team
  targetTeamIds.push(characterId);
  
  // Sync to save data
  uiState.saveData.activeTeamIds = [...uiState.activeTeamIds];
  uiState.saveData.reserveTeamIds = [...uiState.reserveTeamIds];
  
  showNotification(
    `${character.name} assigned to ${targetTeam === 'active' ? 'active' : 'reserve'} team!`,
    'success'
  );
  
  // Refresh screen
  ScreenManager.updateContext({ uiState });
}

/**
 * Setup drop zone for a team grid
 */
function setupDropZone(grid: HTMLElement, targetLocation: 'active' | 'reserve', uiState: UIGameState): void {
  grid.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  });
  
  grid.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    
    if (!e.dataTransfer) return;
    
    // Check if dropped on a character card
    const target = e.target as HTMLElement;
    const targetCard = target.closest('.character-card:not(.character-card--empty)') as HTMLElement;
    
    const characterId = e.dataTransfer.getData('application/character-id');
    const sourceLocation = e.dataTransfer.getData('application/source-location') as 'active' | 'reserve' | 'roster';
    
    if (targetCard) {
      // Dropped on another character - swap or reorder
      const targetCharacterId = targetCard.getAttribute('data-character-id');
      handleDrop(characterId, sourceLocation, targetLocation, targetCharacterId, uiState);
    } else {
      // Dropped on empty area - add to end of team
      handleDrop(characterId, sourceLocation, targetLocation, null, uiState);
    }
  });
}

/**
 * Handle drop operation
 */
function handleDrop(
  draggedCharId: string,
  sourceLocation: 'active' | 'reserve' | 'roster',
  targetLocation: 'active' | 'reserve',
  targetCharId: string | null,
  uiState: UIGameState
): void {
  const sourceTeamIds = sourceLocation === 'active' ? uiState.activeTeamIds : 
                        sourceLocation === 'reserve' ? uiState.reserveTeamIds : null;
  const targetTeamIds = targetLocation === 'active' ? uiState.activeTeamIds : uiState.reserveTeamIds;
  
  const draggedChar = uiState.saveData.roster.find(c => c.id === draggedCharId);
  if (!draggedChar) return;
  
  // Case 1: Reordering within the same team
  if (sourceLocation === targetLocation && sourceTeamIds) {
    const draggedIndex = sourceTeamIds.indexOf(draggedCharId);
    if (draggedIndex === -1) return;
    
    if (targetCharId) {
      const targetIndex = sourceTeamIds.indexOf(targetCharId);
      if (targetIndex === -1) return;
      
      // Reorder: remove from old position and insert at new position
      sourceTeamIds.splice(draggedIndex, 1);
      const newTargetIndex = sourceTeamIds.indexOf(targetCharId);
      sourceTeamIds.splice(newTargetIndex + (draggedIndex < targetIndex ? 1 : 0), 0, draggedCharId);
      
      showNotification(`Reordered ${draggedChar.name} in ${targetLocation} team`, 'success');
    }
    
    syncTeamIdsToSaveData(uiState);
    ScreenManager.updateContext({ uiState });
    return;
  }
  
  // Case 2: Moving from roster (unassigned) to a team
  if (sourceLocation === 'roster') {
    // Check if character is already assigned to a team
    const isInActive = uiState.activeTeamIds.includes(draggedCharId);
    const isInReserve = uiState.reserveTeamIds.includes(draggedCharId);
    
    if (isInActive || isInReserve) {
      // Character is already assigned - treat as move between teams
      const actualSourceTeamIds = isInActive ? uiState.activeTeamIds : uiState.reserveTeamIds;
      const actualSourceLocation = isInActive ? 'active' : 'reserve';
      
      // Check if trying to move to same team
      if (actualSourceLocation === targetLocation) {
        showNotification(`${draggedChar.name} is already in ${targetLocation} team`, 'warning');
        return;
      }
      
      // Handle as team-to-team move
      if (targetCharId) {
        // Swap positions
        const sourceIndex = actualSourceTeamIds.indexOf(draggedCharId);
        const targetIndex = targetTeamIds.indexOf(targetCharId);
        
        if (sourceIndex !== -1 && targetIndex !== -1) {
          actualSourceTeamIds[sourceIndex] = targetCharId;
          targetTeamIds[targetIndex] = draggedCharId;
          
          const targetChar = uiState.saveData.roster.find(c => c.id === targetCharId);
          showNotification(`Swapped ${draggedChar.name} and ${targetChar?.name || 'character'}`, 'success');
        }
      } else {
        // Check if target has space
        if (targetTeamIds.length >= 3) {
          showNotification(`${targetLocation === 'active' ? 'Active' : 'Reserve'} team is full!`, 'warning');
          return;
        }
        
        // Move from source to target
        const sourceIndex = actualSourceTeamIds.indexOf(draggedCharId);
        if (sourceIndex !== -1) {
          actualSourceTeamIds.splice(sourceIndex, 1);
          targetTeamIds.push(draggedCharId);
          showNotification(`${draggedChar.name} moved to ${targetLocation} team`, 'success');
        }
      }
      
      syncTeamIdsToSaveData(uiState);
      ScreenManager.updateContext({ uiState });
      return;
    }
    
    // Character is truly unassigned - add to team
    if (targetTeamIds.length >= 3) {
      showNotification(`${targetLocation === 'active' ? 'Active' : 'Reserve'} team is full!`, 'warning');
      return;
    }
    
    if (targetCharId) {
      // Insert before target
      const targetIndex = targetTeamIds.indexOf(targetCharId);
      targetTeamIds.splice(targetIndex, 0, draggedCharId);
    } else {
      // Add to end
      targetTeamIds.push(draggedCharId);
    }
    
    showNotification(`${draggedChar.name} assigned to ${targetLocation} team`, 'success');
    syncTeamIdsToSaveData(uiState);
    ScreenManager.updateContext({ uiState });
    return;
  }
  
  // Case 3: Moving between active and reserve
  if (sourceTeamIds && sourceLocation !== targetLocation) {
    // Check if target team is full
    if (targetCharId) {
      // Swap positions
      const sourceIndex = sourceTeamIds.indexOf(draggedCharId);
      const targetIndex = targetTeamIds.indexOf(targetCharId);
      
      if (sourceIndex === -1 || targetIndex === -1) return;
      
      // Swap the two characters
      sourceTeamIds[sourceIndex] = targetCharId;
      targetTeamIds[targetIndex] = draggedCharId;
      
      const targetChar = uiState.saveData.roster.find(c => c.id === targetCharId);
      showNotification(
        `Swapped ${draggedChar.name} and ${targetChar?.name || 'character'}`,
        'success'
      );
    } else {
      // Check if target has space
      if (targetTeamIds.length >= 3) {
        showNotification(`${targetLocation === 'active' ? 'Active' : 'Reserve'} team is full!`, 'warning');
        return;
      }
      
      // Move from source to target
      const sourceIndex = sourceTeamIds.indexOf(draggedCharId);
      if (sourceIndex === -1) return;
      
      sourceTeamIds.splice(sourceIndex, 1);
      targetTeamIds.push(draggedCharId);
      
      showNotification(
        `${draggedChar.name} moved to ${targetLocation} team`,
        'success'
      );
    }
    
    syncTeamIdsToSaveData(uiState);
    ScreenManager.updateContext({ uiState });
  }
}

/**
 * Sync team IDs to save data
 */
function syncTeamIdsToSaveData(uiState: UIGameState): void {
  uiState.saveData.activeTeamIds = [...uiState.activeTeamIds];
  uiState.saveData.reserveTeamIds = [...uiState.reserveTeamIds];
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
