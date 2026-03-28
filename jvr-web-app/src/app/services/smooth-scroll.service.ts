import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import Lenis from 'lenis';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;
  private ngZone = inject(NgZone);

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

      this.lenis?.scrollTo(target as HTMLElement | string, {
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: -57, // nav height — divider top sits flush with nav bottom
      });
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
    this.lenis = null;
  }
}
