import { ScreenManager, type ScreenContext } from './core/ScreenManager';
import { 
  createElement, 
  createButton, 
  showNotification,
  showConfirm,
  formatNumber 
} from './core/UIHelpers';
import type { UIGameState } from './core/UIState';
import type { Character } from '../types/character';
import type { Equipment, EquipmentSlot, EquipmentRarity } from '../types/equipment';
import { equipItem, unequipItem, canEquipItem } from '../systems/equipment';
import { saveGame } from '../utils/storage';

/**
 * Filter and sort options
 */
interface InventoryFilters {
  slot: EquipmentSlot | 'all';
  rarity: EquipmentRarity | 'all';
  minLevel: number;
  maxLevel: number;
  showEquippedOnly: boolean;
  hideUnequipped: boolean;
}

interface InventorySorting {
  sortBy: 'rarity' | 'level' | 'name' | 'slot';
  direction: 'asc' | 'desc';
}

/**
 * Inventory screen state
 */
let currentFilters: InventoryFilters = {
  slot: 'all',
  rarity: 'all',
  minLevel: 1,
  maxLevel: 100,
  showEquippedOnly: false,
  hideUnequipped: false,
};

let currentSorting: InventorySorting = {
  sortBy: 'rarity',
  direction: 'desc',
};

let selectedCharacterId: string | null = null;

/**
 * Render the inventory screen
 */
export function renderInventory(context: ScreenContext): HTMLElement {
  const container = createElement('div', 'screen screen--inventory');
  
  const uiState = context.uiState as UIGameState | undefined;
  
  if (!uiState) {
    container.innerHTML = '<p>Error: No game state available</p>';
    return container;
  }
  
  // Initialize selected character if not set
  if (!selectedCharacterId && uiState.saveData.roster.length > 0) {
    selectedCharacterId = uiState.saveData.roster[0].id;
  }
  
  // Header
  const header = renderHeader();
  container.appendChild(header);
  
  // Character selector
  const characterSelector = renderCharacterSelector(uiState);
  container.appendChild(characterSelector);
  
  // Filters and sorting
  const controls = renderControls(uiState);
  container.appendChild(controls);
  
  // Main content area
  const content = createElement('div', 'inventory__content');
  
  // Equipped items section (left)
  if (selectedCharacterId) {
    const character = uiState.saveData.roster.find(c => c.id === selectedCharacterId);
    if (character) {
      const equippedSection = renderEquippedSection(character, uiState);
      content.appendChild(equippedSection);
    }
  }
  
  // Inventory grid (right)
  const inventorySection = renderInventorySection(uiState);
  content.appendChild(inventorySection);
  
  container.appendChild(content);
  
  return container;
}

/**
 * Render header with title and navigation
 */
function renderHeader(): HTMLElement {
  const header = createElement('div', 'inventory__header');
  
  const title = createElement('h1', 'inventory__title');
  title.textContent = '🎒 Equipment Inventory';
  
  const nav = createElement('nav', 'inventory__nav');
  const backBtn = createButton('⬅️ Back', () => {
    ScreenManager.goBack();
  }, 'btn btn--secondary');
  nav.appendChild(backBtn);
  
  header.appendChild(title);
  header.appendChild(nav);
  
  return header;
}

/**
 * Render character selector dropdown
 */
function renderCharacterSelector(uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'inventory__character-selector');
  
  const label = createElement('label', 'inventory__selector-label');
  label.textContent = 'Equip to Character:';
  
  const select = createElement('select', 'inventory__selector-dropdown') as HTMLSelectElement;
  
  // Add all roster characters
  uiState.saveData.roster.forEach(character => {
    const option = createElement('option') as HTMLOptionElement;
    option.value = character.id;
    option.textContent = `${character.name} (${character.type}) - Level ${character.level}`;
    if (character.id === selectedCharacterId) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  select.addEventListener('change', () => {
    selectedCharacterId = select.value;
    ScreenManager.updateContext({ uiState });
  });
  
  section.appendChild(label);
  section.appendChild(select);
  
  return section;
}

/**
 * Render filter and sorting controls
 */
function renderControls(uiState: UIGameState): HTMLElement {
  const controls = createElement('div', 'inventory__controls');
  
  // Filters section
  const filtersDiv = createElement('div', 'inventory__filters');
  
  // Slot filter
  const slotFilter = renderSlotFilter();
  filtersDiv.appendChild(slotFilter);
  
  // Rarity filter
  const rarityFilter = renderRarityFilter();
  filtersDiv.appendChild(rarityFilter);
  
  // Level filter
  const levelFilter = renderLevelFilter();
  filtersDiv.appendChild(levelFilter);
  
  // Toggles
  const toggles = renderFilterToggles(uiState);
  filtersDiv.appendChild(toggles);
  
  controls.appendChild(filtersDiv);
  
  // Sorting section
  const sortingDiv = createElement('div', 'inventory__sorting');
  
  const sortLabel = createElement('span', 'inventory__sort-label');
  sortLabel.textContent = 'Sort by:';
  
  const sortSelect = createElement('select', 'inventory__sort-select') as HTMLSelectElement;
  const sortOptions: Array<{ value: InventorySorting['sortBy'], label: string }> = [
    { value: 'rarity', label: 'Rarity' },
    { value: 'level', label: 'Level' },
    { value: 'name', label: 'Name' },
    { value: 'slot', label: 'Slot' },
  ];
  
  sortOptions.forEach(({ value, label }) => {
    const option = createElement('option') as HTMLOptionElement;
    option.value = value;
    option.textContent = label;
    if (value === currentSorting.sortBy) {
      option.selected = true;
    }
    sortSelect.appendChild(option);
  });
  
  sortSelect.addEventListener('change', () => {
    currentSorting.sortBy = sortSelect.value as InventorySorting['sortBy'];
    ScreenManager.updateContext({ uiState });
  });
  
  const directionBtn = createButton(
    currentSorting.direction === 'asc' ? '⬆️ Ascending' : '⬇️ Descending',
    () => {
      currentSorting.direction = currentSorting.direction === 'asc' ? 'desc' : 'asc';
      ScreenManager.updateContext({ uiState });
    },
    'btn btn--small'
  );
  
  sortingDiv.appendChild(sortLabel);
  sortingDiv.appendChild(sortSelect);
  sortingDiv.appendChild(directionBtn);
  
  controls.appendChild(sortingDiv);
  
  return controls;
}

/**
 * Render slot filter dropdown
 */
function renderSlotFilter(): HTMLElement {
  const container = createElement('div', 'inventory__filter-group');
  
  const label = createElement('label', 'inventory__filter-label');
  label.textContent = 'Slot:';
  
  const select = createElement('select', 'inventory__filter-select') as HTMLSelectElement;
  
  const slots: Array<EquipmentSlot | 'all'> = [
    'all', 'mainHand', 'offHand', 'head', 'chest', 'legs', 'neck', 'wrist1', 'wrist2'
  ];
  
  const slotLabels: Record<EquipmentSlot | 'all', string> = {
    'all': 'All Slots',
    'mainHand': '🗡️ Main Hand',
    'offHand': '🛡️ Off Hand',
    'head': '⛑️ Head',
    'chest': '🦺 Chest',
    'legs': '👖 Legs',
    'neck': '📿 Neck',
    'wrist1': '⌚ Wrist 1',
    'wrist2': '⌚ Wrist 2',
  };
  
  slots.forEach(slot => {
    const option = createElement('option') as HTMLOptionElement;
    option.value = slot;
    option.textContent = slotLabels[slot];
    if (slot === currentFilters.slot) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  select.addEventListener('change', () => {
    currentFilters.slot = select.value as EquipmentSlot | 'all';
    ScreenManager.updateContext({});
  });
  
  container.appendChild(label);
  container.appendChild(select);
  
  return container;
}

/**
 * Render rarity filter dropdown
 */
function renderRarityFilter(): HTMLElement {
  const container = createElement('div', 'inventory__filter-group');
  
  const label = createElement('label', 'inventory__filter-label');
  label.textContent = 'Rarity:';
  
  const select = createElement('select', 'inventory__filter-select') as HTMLSelectElement;
  
  const rarities: Array<EquipmentRarity | 'all'> = [
    'all', 'basic', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'
  ];
  
  const rarityLabels: Record<EquipmentRarity | 'all', string> = {
    'all': 'All Rarities',
    'basic': 'Basic',
    'common': 'Common',
    'uncommon': 'Uncommon',
    'rare': 'Rare',
    'epic': 'Epic',
    'legendary': 'Legendary',
    'mythic': 'Mythic',
  };
  
  rarities.forEach(rarity => {
    const option = createElement('option') as HTMLOptionElement;
    option.value = rarity;
    option.textContent = rarityLabels[rarity];
    if (rarity === currentFilters.rarity) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  select.addEventListener('change', () => {
    currentFilters.rarity = select.value as EquipmentRarity | 'all';
    ScreenManager.updateContext({});
  });
  
  container.appendChild(label);
  container.appendChild(select);
  
  return container;
}

/**
 * Render level filter
 */
function renderLevelFilter(): HTMLElement {
  const container = createElement('div', 'inventory__filter-group');
  
  const label = createElement('label', 'inventory__filter-label');
  label.textContent = 'Level Range:';
  
  const rangeText = createElement('span', 'inventory__level-range');
  rangeText.textContent = `${currentFilters.minLevel} - ${currentFilters.maxLevel}`;
  
  const minInput = createElement('input', 'inventory__level-input') as HTMLInputElement;
  minInput.type = 'number';
  minInput.min = '1';
  minInput.max = '100';
  minInput.value = currentFilters.minLevel.toString();
  minInput.placeholder = 'Min';
  
  const maxInput = createElement('input', 'inventory__level-input') as HTMLInputElement;
  maxInput.type = 'number';
  maxInput.min = '1';
  maxInput.max = '100';
  maxInput.value = currentFilters.maxLevel.toString();
  maxInput.placeholder = 'Max';
  
  const updateRange = () => {
    currentFilters.minLevel = Math.max(1, Math.min(100, parseInt(minInput.value) || 1));
    currentFilters.maxLevel = Math.max(1, Math.min(100, parseInt(maxInput.value) || 100));
    rangeText.textContent = `${currentFilters.minLevel} - ${currentFilters.maxLevel}`;
    ScreenManager.updateContext({});
  };
  
  minInput.addEventListener('change', updateRange);
  maxInput.addEventListener('change', updateRange);
  
  container.appendChild(label);
  container.appendChild(minInput);
  container.appendChild(createElement('span', 'inventory__level-separator')).textContent = '-';
  container.appendChild(maxInput);
  
  return container;
}

/**
 * Render filter toggles
 */
function renderFilterToggles(uiState: UIGameState): HTMLElement {
  const container = createElement('div', 'inventory__filter-toggles');
  
  // Show equipped only toggle
  const equippedToggle = createToggle(
    'Show Equipped Only',
    currentFilters.showEquippedOnly,
    (value) => {
      currentFilters.showEquippedOnly = value;
      if (value) {
        currentFilters.hideUnequipped = false; // Can't have both
      }
      ScreenManager.updateContext({ uiState });
    }
  );
  container.appendChild(equippedToggle);
  
  // Hide low rarity toggle (respects settings)
  const hideToggle = createToggle(
    'Hide Low Rarity (Basic/Common)',
    uiState.saveData.settings.autoHideLowRarityEquipment,
    (value) => {
      uiState.saveData.settings.autoHideLowRarityEquipment = value;
      saveGame(uiState.saveData, true); // Auto-save setting change
      ScreenManager.updateContext({ uiState });
    }
  );
  container.appendChild(hideToggle);
  
  return container;
}

/**
 * Create a toggle checkbox
 */
function createToggle(label: string, checked: boolean, onChange: (value: boolean) => void): HTMLElement {
  const container = createElement('label', 'inventory__toggle');
  
  const checkbox = createElement('input', 'inventory__toggle-checkbox') as HTMLInputElement;
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.addEventListener('change', () => {
    onChange(checkbox.checked);
  });
  
  const labelText = createElement('span', 'inventory__toggle-label');
  labelText.textContent = label;
  
  container.appendChild(checkbox);
  container.appendChild(labelText);
  
  return container;
}

/**
 * Render equipped items section
 */
function renderEquippedSection(character: Character, uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'inventory__equipped-section');
  
  const title = createElement('h2', 'inventory__section-title');
  title.textContent = `${character.name}'s Equipment`;
  section.appendChild(title);
  
  const statsDiv = createElement('div', 'inventory__character-stats');
  statsDiv.innerHTML = `
    <div class="stat-row"><span>Level:</span> <span>${character.level}</span></div>
    <div class="stat-row"><span>HP:</span> <span>${formatNumber(character.stats.maxHp)}</span></div>
    <div class="stat-row"><span>ATK:</span> <span>${formatNumber(character.stats.atk)}</span></div>
    <div class="stat-row"><span>DEF:</span> <span>${formatNumber(character.stats.def)}</span></div>
  `;
  section.appendChild(statsDiv);
  
  const equippedGrid = createElement('div', 'inventory__equipped-grid');
  
  const slots: EquipmentSlot[] = ['mainHand', 'offHand', 'head', 'chest', 'legs', 'neck', 'wrist1', 'wrist2'];
  const slotIcons: Record<EquipmentSlot, string> = {
    'mainHand': '🗡️',
    'offHand': '🛡️',
    'head': '⛑️',
    'chest': '🦺',
    'legs': '👖',
    'neck': '📿',
    'wrist1': '⌚',
    'wrist2': '⌚',
  };
  
  const slotNames: Record<EquipmentSlot, string> = {
    'mainHand': 'Main Hand',
    'offHand': 'Off Hand',
    'head': 'Head',
    'chest': 'Chest',
    'legs': 'Legs',
    'neck': 'Neck',
    'wrist1': 'Wrist 1',
    'wrist2': 'Wrist 2',
  };
  
  slots.forEach(slot => {
    const equippedItemId = character.equipment[slot];
    const slotCard = createElement('div', 'inventory__equipped-slot');
    
    const slotLabel = createElement('div', 'inventory__slot-label');
    slotLabel.textContent = `${slotIcons[slot]} ${slotNames[slot]}`;
    slotCard.appendChild(slotLabel);
    
    if (equippedItemId) {
      // Find equipment in inventory
      const equipment = uiState.saveData.inventory.find(e => e.id === equippedItemId);
      if (equipment) {
        const itemCard = renderEquipmentCard(equipment, character, uiState, true);
        slotCard.appendChild(itemCard);
      } else {
        const empty = createElement('div', 'inventory__slot-empty');
        empty.textContent = 'Not Found';
        slotCard.appendChild(empty);
      }
    } else {
      const empty = createElement('div', 'inventory__slot-empty');
      empty.textContent = 'Empty';
      slotCard.appendChild(empty);
    }
    
    equippedGrid.appendChild(slotCard);
  });
  
  section.appendChild(equippedGrid);
  
  return section;
}

/**
 * Render inventory grid
 */
function renderInventorySection(uiState: UIGameState): HTMLElement {
  const section = createElement('div', 'inventory__inventory-section');
  
  const header = createElement('div', 'inventory__inventory-header');
  const title = createElement('h2', 'inventory__section-title');
  title.textContent = 'Inventory';
  
  const count = createElement('span', 'inventory__item-count');
  
  header.appendChild(title);
  header.appendChild(count);
  section.appendChild(header);
  
  // Filter and sort equipment
  const filteredEquipment = filterAndSortEquipment(uiState);
  
  count.textContent = `(${filteredEquipment.length} items)`;
  
  const grid = createElement('div', 'inventory__grid');
  
  if (filteredEquipment.length === 0) {
    const empty = createElement('div', 'inventory__empty');
    empty.textContent = 'No equipment matches the current filters.';
    grid.appendChild(empty);
  } else {
    const selectedChar = selectedCharacterId 
      ? uiState.saveData.roster.find(c => c.id === selectedCharacterId)
      : null;
    
    filteredEquipment.forEach(equipment => {
      const card = renderEquipmentCard(equipment, selectedChar || null, uiState, false);
      grid.appendChild(card);
    });
  }
  
  section.appendChild(grid);
  
  return section;
}

/**
 * Filter and sort equipment based on current filters/sorting
 */
function filterAndSortEquipment(uiState: UIGameState): Equipment[] {
  let equipment = [...uiState.saveData.inventory];
  
  // Find equipped items
  const equippedIds = new Set<string>();
  uiState.saveData.roster.forEach(char => {
    Object.values(char.equipment).forEach(itemId => {
      if (itemId) equippedIds.add(itemId);
    });
  });
  
  // Apply filters
  equipment = equipment.filter(item => {
    // Slot filter
    if (currentFilters.slot !== 'all' && item.slot !== currentFilters.slot) {
      return false;
    }
    
    // Rarity filter
    if (currentFilters.rarity !== 'all' && item.rarity !== currentFilters.rarity) {
      return false;
    }
    
    // Level range filter
    if (item.level < currentFilters.minLevel || item.level > currentFilters.maxLevel) {
      return false;
    }
    
    // Equipped only filter
    if (currentFilters.showEquippedOnly && !equippedIds.has(item.id)) {
      return false;
    }
    
    // Hide low rarity filter
    if (uiState.saveData.settings.autoHideLowRarityEquipment) {
      if (item.rarity === 'basic' || item.rarity === 'common') {
        return false;
      }
    }
    
    return true;
  });
  
  // Apply sorting
  equipment.sort((a, b) => {
    let comparison = 0;
    
    switch (currentSorting.sortBy) {
      case 'rarity': {
        const rarityOrder: EquipmentRarity[] = ['basic', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
        comparison = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        break;
      }
      case 'level':
        comparison = a.level - b.level;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'slot':
        comparison = a.slot.localeCompare(b.slot);
        break;
    }
    
    return currentSorting.direction === 'asc' ? comparison : -comparison;
  });
  
  return equipment;
}

/**
 * Render equipment card
 */
function renderEquipmentCard(
  equipment: Equipment, 
  character: Character | null, 
  uiState: UIGameState,
  isEquipped: boolean
): HTMLElement {
  const card = createElement('div', `inventory__equipment-card inventory__equipment-card--${equipment.rarity}`);
  
  // Name
  const name = createElement('div', 'inventory__equipment-name');
  name.textContent = equipment.name;
  card.appendChild(name);
  
  // Info row
  const info = createElement('div', 'inventory__equipment-info');
  info.innerHTML = `
    <span class="inventory__equipment-slot">${equipment.slot}</span>
    <span class="inventory__equipment-level">Lv ${equipment.level}</span>
    <span class="inventory__equipment-rarity inventory__equipment-rarity--${equipment.rarity}">${equipment.rarity}</span>
  `;
  card.appendChild(info);
  
  // Stats
  const stats = createElement('div', 'inventory__equipment-stats');
  equipment.statBonuses.forEach(bonus => {
    const statDiv = createElement('div', 'inventory__equipment-stat');
    statDiv.textContent = `+${bonus.value} ${bonus.stat.toUpperCase()}`;
    stats.appendChild(statDiv);
  });
  card.appendChild(stats);
  
  // Equipped indicator
  if (isEquipped) {
    const equippedBadge = createElement('div', 'inventory__equipped-badge');
    equippedBadge.textContent = '✓ EQUIPPED';
    card.appendChild(equippedBadge);
  }
  
  // Actions
  const actions = createElement('div', 'inventory__equipment-actions');
  
  if (isEquipped && character) {
    // Unequip button
    const unequipBtn = createButton('Unequip', () => {
      unequipItem(character.equipment, equipment.slot);
      saveGame(uiState.saveData, true);
      showNotification(`Unequipped ${equipment.name}`, 'success');
      ScreenManager.updateContext({ uiState });
    }, 'btn btn--small btn--secondary');
    actions.appendChild(unequipBtn);
  } else if (!isEquipped && character) {
    // Equip button
    const canEquip = canEquipItem(character.level, equipment);
    const equipBtn = createButton('Equip', async () => {
      // Check if slot is occupied
      const currentlyEquippedId = character.equipment[equipment.slot];
      
      if (currentlyEquippedId) {
        const currentlyEquipped = uiState.saveData.inventory.find(e => e.id === currentlyEquippedId);
        const itemName = currentlyEquipped ? currentlyEquipped.name : 'current item';
        
        const confirmed = await showConfirm(
          `Replace ${itemName} with ${equipment.name}?`,
          'Equip Item'
        );
        
        if (!confirmed) {
          return;
        }
      }
      
      // Equip the item
      const result = equipItem(character.equipment, equipment, character.level);
      
      if (result.success) {
        saveGame(uiState.saveData, true);
        showNotification(`Equipped ${equipment.name} on ${character.name}`, 'success');
        ScreenManager.updateContext({ uiState });
      } else {
        showNotification(result.error || 'Failed to equip item', 'error');
      }
    }, 'btn btn--small btn--primary');
    
    if (!canEquip) {
      equipBtn.disabled = true;
      equipBtn.title = `Requires level ${equipment.level}`;
    }
    
    actions.appendChild(equipBtn);
  }
  
  card.appendChild(actions);
  
  return card;
}
