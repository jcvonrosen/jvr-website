import { Injectable, signal } from '@angular/core';

/** Lightweight shared state for scroll-driven UI — hero visibility and active section. */
@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  /** True while the hero section is at least partially in the viewport. */
  readonly heroVisible = signal(true);

  /** ID of the major section currently most prominent in the viewport. */
  readonly activeSection = signal('hero');
}
