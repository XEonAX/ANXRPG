/**
 * UI Helper Functions
 * Reusable utility functions for DOM manipulation and formatting
 */

import type { Character } from '../../types/character';
import type { Equipment } from '../../types/equipment';
import type { StatusEffect } from '../../types/status';

/**
 * Create an element with classes and attributes
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attributes?: Record<string, string>
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  if (className) {
    element.className = className;
  }
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  return element;
}

/**
 * Create a button element with click handler
 */
export function createButton(
  text: string,
  onClick: () => void,
  className: string = 'btn'
): HTMLButtonElement {
  const button = createElement('button', className);
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

/**
 * Format a number with commas (e.g., 1234567 -> "1,234,567")
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format percentage (e.g., 0.75 -> "75%")
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format HP display (e.g., "150 / 200")
 */
export function formatHP(current: number, max: number): string {
  return `${current} / ${max}`;
}

/**
 * Get rarity color class name
 */
export function getRarityClass(rarity: string): string {
  return `rarity-${rarity.toLowerCase()}`;
}

/**
 * Get character type color (for UI theming)
 */
export function getCharacterTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Alpha: '#FFD700',    // Gold
    Beta: '#C0C0C0',     // Silver
    Gamma: '#8B00FF',    // Purple
    Delta: '#FF4500',    // Red-Orange
    Epsilon: '#00CED1',  // Cyan
    Zeta: '#DC143C'      // Crimson
  };
  return colors[type] || '#FFFFFF';
}

/**
 * Create a progress bar element
 */
export function createProgressBar(
  current: number,
  max: number,
  className: string = 'progress-bar'
): HTMLElement {
  const container = createElement('div', `${className}-container`);
  const bar = createElement('div', className);
  const percentage = Math.min((current / max) * 100, 100);
  
  bar.style.width = `${percentage}%`;
  bar.setAttribute('data-current', current.toString());
  bar.setAttribute('data-max', max.toString());
  
  const text = createElement('span', `${className}-text`);
  text.textContent = `${formatNumber(current)} / ${formatNumber(max)}`;
  
  container.appendChild(bar);
  container.appendChild(text);
  
  return container;
}

/**
 * Create HP bar with color coding
 */
export function createHPBar(current: number, max: number): HTMLElement {
  const bar = createProgressBar(current, max, 'hp-bar');
  const percentage = (current / max) * 100;
  
  // Color code based on HP percentage
  const barElement = bar.querySelector('.hp-bar') as HTMLElement;
  if (barElement) {
    if (percentage <= 25) {
      barElement.classList.add('hp-critical');
    } else if (percentage <= 50) {
      barElement.classList.add('hp-warning');
    } else {
      barElement.classList.add('hp-healthy');
    }
  }
  
  return bar;
}

/**
 * Create AP (Action Points) indicator
 */
export function createAPIndicator(current: number, max: number): HTMLElement {
  const container = createElement('div', 'ap-indicator');
  
  for (let i = 0; i < max; i++) {
    const dot = createElement('span', 'ap-dot');
    if (i < current) {
      dot.classList.add('ap-filled');
    }
    container.appendChild(dot);
  }
  
  const text = createElement('span', 'ap-text');
  text.textContent = `${current}/${max} AP`;
  container.appendChild(text);
  
  return container;
}

/**
 * Create a stat display element
 */
export function createStatDisplay(
  label: string,
  value: number | string,
  bonusValue?: number
): HTMLElement {
  const container = createElement('div', 'stat-display');
  
  const labelEl = createElement('span', 'stat-label');
  labelEl.textContent = label;
  
  const valueEl = createElement('span', 'stat-value');
  valueEl.textContent = value.toString();
  
  container.appendChild(labelEl);
  container.appendChild(valueEl);
  
  if (bonusValue !== undefined && bonusValue !== 0) {
    const bonusEl = createElement('span', 'stat-bonus');
    bonusEl.textContent = `(+${bonusValue})`;
    container.appendChild(bonusEl);
  }
  
  return container;
}

/**
 * Create a status effect indicator
 */
export function createStatusEffectIcon(effect: StatusEffect): HTMLElement {
  const icon = createElement('div', 'status-effect-icon');
  icon.setAttribute('data-effect-id', effect.id);
  icon.setAttribute('title', `${effect.name} (${effect.duration} turns)`);
  
  // Add emoji/icon based on effect type
  const iconText = getStatusEffectEmoji(effect.type);
  icon.textContent = iconText;
  
  if (effect.currentStacks && effect.currentStacks > 1) {
    const stackCount = createElement('span', 'stack-count');
    stackCount.textContent = effect.currentStacks.toString();
    icon.appendChild(stackCount);
  }
  
  return icon;
}

/**
 * Get emoji for status effect type
 */
function getStatusEffectEmoji(type: string): string {
  const emojis: Record<string, string> = {
    buff: '⬆️',
    debuff: '⬇️',
    dot: '🔥',
    hot: '💚',
    control: '❄️',
    special: '✨'
  };
  return emojis[type] || '•';
}

/**
 * Create a character card (mini version for lists)
 */
export function createCharacterCard(
  character: Character,
  onClick?: () => void
): HTMLElement {
  const card = createElement('div', 'character-card');
  card.setAttribute('data-character-id', character.id);
  
  // Header with name and level
  const header = createElement('div', 'character-card__header');
  const name = createElement('h3', 'character-card__name');
  name.textContent = character.name;
  const level = createElement('span', 'character-card__level');
  level.textContent = `Lv ${character.level}`;
  header.appendChild(name);
  header.appendChild(level);
  
  // Type/class
  const type = createElement('div', 'character-card__type');
  type.textContent = character.type;
  type.style.borderColor = getCharacterTypeColor(character.type);
  
  // HP bar
  const hpBar = createHPBar(character.stats.hp, character.stats.maxHp);
  
  // AP indicator
  const apIndicator = createAPIndicator(character.currentAp, 10);
  
  // Assemble card
  card.appendChild(header);
  card.appendChild(type);
  card.appendChild(hpBar);
  card.appendChild(apIndicator);
  
  // Add click handler
  if (onClick) {
    card.classList.add('clickable');
    card.addEventListener('click', onClick);
  }
  
  return card;
}

/**
 * Create equipment display item
 */
export function createEquipmentItem(
  equipment: Equipment,
  onClick?: () => void
): HTMLElement {
  const item = createElement('div', 'equipment-item');
  item.setAttribute('data-equipment-id', equipment.id);
  item.classList.add(getRarityClass(equipment.rarity));
  
  const name = createElement('div', 'equipment-item__name');
  name.textContent = equipment.name;
  
  const details = createElement('div', 'equipment-item__details');
  details.textContent = `${equipment.slot} • ${equipment.rarity} • Lv ${equipment.level}`;
  
  const stats = createElement('div', 'equipment-item__stats');
  const statsText = Object.entries(equipment.statBonuses)
    .map(([stat, value]) => `+${value} ${stat.toUpperCase()}`)
    .join(', ');
  stats.textContent = statsText;
  
  item.appendChild(name);
  item.appendChild(details);
  item.appendChild(stats);
  
  if (onClick) {
    item.classList.add('clickable');
    item.addEventListener('click', onClick);
  }
  
  return item;
}

/**
 * Show a toast notification
 */
export function showNotification(
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  duration: number = 3000
): void {
  // Create toast container if it doesn't exist
  let container = document.querySelector('.toast-container') as HTMLElement;
  if (!container) {
    container = createElement('div', 'toast-container');
    document.body.appendChild(container);
  }
  
  const toast = createElement('div', `toast toast--${type}`);
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('toast--show'), 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Create a modal dialog
 */
export function createModal(
  title: string,
  content: HTMLElement | string,
  buttons: Array<{ text: string; onClick: () => void; variant?: string }>
): HTMLElement {
  const overlay = createElement('div', 'modal-overlay');
  const modal = createElement('div', 'modal');
  
  const header = createElement('div', 'modal__header');
  const titleEl = createElement('h2', 'modal__title');
  titleEl.textContent = title;
  header.appendChild(titleEl);
  
  const body = createElement('div', 'modal__body');
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else {
    body.appendChild(content);
  }
  
  const footer = createElement('div', 'modal__footer');
  buttons.forEach(({ text, onClick, variant = 'primary' }) => {
    const button = createButton(text, () => {
      onClick();
      overlay.remove();
    }, `btn btn--${variant}`);
    footer.appendChild(button);
  });
  
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  document.body.appendChild(overlay);
  
  return overlay;
}

/**
 * Show a confirmation dialog
 * Returns a Promise that resolves to true if confirmed, false if cancelled
 */
export function showConfirm(
  message: string,
  title: string = 'Confirm'
): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = createElement('div', 'modal-overlay');
    const modal = createElement('div', 'modal');
    
    const header = createElement('div', 'modal__header');
    const titleEl = createElement('h2', 'modal__title');
    titleEl.textContent = title;
    header.appendChild(titleEl);
    
    const body = createElement('div', 'modal__body');
    const messageEl = createElement('p');
    messageEl.textContent = message;
    body.appendChild(messageEl);
    
    const footer = createElement('div', 'modal__footer');
    
    const cancelBtn = createButton('Cancel', () => {
      overlay.remove();
      resolve(false);
    }, 'btn btn--secondary');
    
    const confirmBtn = createButton('Confirm', () => {
      overlay.remove();
      resolve(true);
    }, 'btn btn--primary');
    
    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    
    // Close on overlay click (counts as cancel)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });
    
    document.body.appendChild(overlay);
  });
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
