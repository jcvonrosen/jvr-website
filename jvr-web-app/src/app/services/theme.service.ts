import { Injectable, signal, effect } from '@angular/core';

const STORAGE_KEY = 'jvr-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** True = dark mode. Defaults to true (dark) for first-time visitors. */
  readonly isDark = signal<boolean>(
    localStorage.getItem(STORAGE_KEY) !== 'light'
  );

  constructor() {
    // Apply on init so the correct class is set before first paint
    this.applyTheme(this.isDark());

    // Persist and re-apply every time the signal changes
    effect(() => {
      const dark = this.isDark();
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
      this.applyTheme(dark);
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }

  private applyTheme(dark: boolean): void {
    document.body.classList.toggle('dark-mode', dark);
  }
}
