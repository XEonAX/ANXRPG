/**
 * Screen Manager - Handles screen transitions and rendering
 * Pure vanilla TypeScript with no frameworks
 */

export type Screen = 
  | 'mainMenu'
  | 'teamManagement'
  | 'characterSheet'
  | 'campaignMap'
  | 'combat'
  | 'inventory'
  | 'battleResults'
  | 'settings';

export interface ScreenContext {
  [key: string]: any;
}

type ScreenRenderer = (context: ScreenContext) => HTMLElement;

/**
 * Central screen management system
 * Handles navigation, history, and screen rendering
 */
class ScreenManagerClass {
  private currentScreen: Screen = 'mainMenu';
  private screenHistory: Screen[] = [];
  private screenRenderers = new Map<Screen, ScreenRenderer>();
  private rootElement: HTMLElement | null = null;
  private context: ScreenContext = {};

  /**
   * Initialize the screen manager with the root DOM element
   */
  initialize(rootElement: HTMLElement): void {
    this.rootElement = rootElement;
  }

  /**
   * Register a screen renderer function
   */
  registerScreen(screen: Screen, renderer: ScreenRenderer): void {
    this.screenRenderers.set(screen, renderer);
  }

  /**
   * Navigate to a new screen
   * @param screen - Screen to navigate to
   * @param context - Optional context data for the screen
   * @param addToHistory - Whether to add current screen to history (for back navigation)
   */
  navigateTo(screen: Screen, context: ScreenContext = {}, addToHistory: boolean = true): void {
    if (!this.rootElement) {
      console.error('ScreenManager not initialized! Call initialize() first.');
      return;
    }

    const renderer = this.screenRenderers.get(screen);
    if (!renderer) {
      console.error(`No renderer registered for screen: ${screen}`);
      return;
    }

    // Add current screen to history
    if (addToHistory && this.currentScreen !== screen) {
      this.screenHistory.push(this.currentScreen);
    }

    // Update current screen
    this.currentScreen = screen;
    this.context = context;

    // Render the screen
    this.render();
  }

  /**
   * Go back to the previous screen in history
   */
  goBack(): void {
    if (this.screenHistory.length === 0) {
      console.warn('No screen history to go back to');
      return;
    }

    const previousScreen = this.screenHistory.pop()!;
    // Preserve the current context when going back (keeps uiState, etc.)
    this.navigateTo(previousScreen, this.context, false);
  }

  /**
   * Get the current screen
   */
  getCurrentScreen(): Screen {
    return this.currentScreen;
  }

  /**
   * Get the current screen context
   */
  getContext(): ScreenContext {
    return this.context;
  }

  /**
   * Update the current screen context and re-render
   */
  updateContext(newContext: ScreenContext): void {
    this.context = { ...this.context, ...newContext };
    this.render();
  }

  /**
   * Re-render the current screen
   */
  refresh(): void {
    this.render();
  }

  /**
   * Clear screen history
   */
  clearHistory(): void {
    this.screenHistory = [];
  }

  /**
   * Internal render method
   */
  private render(): void {
    if (!this.rootElement) return;

    const renderer = this.screenRenderers.get(this.currentScreen);
    if (!renderer) return;

    // Clear existing content
    this.rootElement.innerHTML = '';

    // Render new screen
    const screenElement = renderer(this.context);
    this.rootElement.appendChild(screenElement);

    // Scroll to top
    window.scrollTo(0, 0);

    // Emit screen change event
    this.emitScreenChange();
  }

  /**
   * Emit a custom event when screen changes
   */
  private emitScreenChange(): void {
    const event = new CustomEvent('screenChange', {
      detail: {
        screen: this.currentScreen,
        context: this.context
      }
    });
    document.dispatchEvent(event);
  }
}

// Singleton instance
export const ScreenManager = new ScreenManagerClass();
