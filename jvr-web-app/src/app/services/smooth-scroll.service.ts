import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import Lenis from 'lenis';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;
  private ngZone = inject(NgZone);
  private popStateListener: (() => void) | null = null;

  init(): void {
    this.ngZone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      const raf = (time: number) => {
        this.lenis!.raf(time);
        this.rafId = requestAnimationFrame(raf);
      };
      this.rafId = requestAnimationFrame(raf);

      // Handle browser back/forward buttons
      this.popStateListener = () => {
        const hash = window.location.hash.slice(1); // Remove '#' prefix
        if (hash) {
          this.scrollToInstant(hash);
        }
      };
      window.addEventListener('popstate', this.popStateListener);
    });
  }

  scrollToTop(): void {
    this.lenis?.scrollTo(0, { immediate: true });
  }

  scrollTo(id: string): void {
    this.ngZone.runOutsideAngular(() => {
      // If a divider-full <hr> immediately precedes the section, scroll to
      // that element so the viewport lands with the divider right below the nav.
      const section = document.getElementById(id);
      const prev = section?.previousElementSibling;
      const target =
        prev instanceof HTMLHRElement && prev.classList.contains('divider-full')
          ? prev
          : `#${id}`;

      // Update URL hash to enable browser back button navigation
      // Use replaceState for smooth scroll to avoid creating duplicate history entries
      if (window.location.hash !== `#${id}`) {
        window.history.pushState(null, '', `#${id}`);
      }

      this.lenis?.scrollTo(target as HTMLElement | string, {
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: this.getNavOffset(), // Dynamic nav height based on viewport
      });
    });
  }

  scrollToInstant(id: string): void {
    this.ngZone.runOutsideAngular(() => {
      const section = document.getElementById(id);
      const prev = section?.previousElementSibling;
      const target =
        prev instanceof HTMLHRElement && prev.classList.contains('divider-full')
          ? prev
          : `#${id}`;

      this.lenis?.scrollTo(target as HTMLElement | string, {
        immediate: true,
        offset: this.getNavOffset(),
      });
    });
  }

  /**
   * Calculate nav offset based on viewport width
   * Desktop (>960px): ~57px (main menubar only)
   * Mobile (≤960px): ~125px (main menubar + carousel row)
   */
  private getNavOffset(): number {
    const isMobile = window.innerWidth <= 960;
    return isMobile ? -125 : -57;
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.popStateListener) {
      window.removeEventListener('popstate', this.popStateListener);
    }
    this.lenis?.destroy();
    this.lenis = null;
  }
}
