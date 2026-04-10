import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  viewChild,
  viewChildren,
} from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../services/theme.service';
import { SmoothScrollService } from '../../services/smooth-scroll.service';
import { ScrollStateService } from '../../services/scroll-state.service';

@Component({
  selector: 'app-top-menubar',
  imports: [MenubarModule, ButtonModule],
  templateUrl: './top-menubar.html',
  styleUrl: './top-menubar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nav-visible]': '!scrollState.heroVisible()',
  },
})
export class TopMenubar implements AfterViewInit, OnDestroy {
  readonly themeService = inject(ThemeService);
  readonly scrollState = inject(ScrollStateService);
  readonly smoothScroll = inject(SmoothScrollService);
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  // ── Existing carousel refs ─────────────────────────────────────────────────
  private carouselContainer = viewChild<ElementRef<HTMLDivElement>>('carouselContainer');
  private carouselButtons = viewChildren<ElementRef<HTMLButtonElement>>('carouselBtn');

  // ── Centered carousel refs ─────────────────────────────────────────────────
  private centeredCarouselContainer = viewChild<ElementRef<HTMLDivElement>>(
    'centeredCarouselContainer',
  );
  private centeredTrackRef = viewChild<ElementRef<HTMLDivElement>>('centeredTrack');
  private centeredBtns = viewChildren<ElementRef<HTMLButtonElement>>('centeredBtn');

  /** Index of the button currently snapped to centre */
  centeredActiveIndex = 0;

  private resizeObserver: ResizeObserver | null = null;

  // ── Menu items ─────────────────────────────────────────────────────────────

  private readonly baseItems: Array<MenuItem & { section?: string }> = [
    {
      label: 'Why Us',
      url: '#why-us',
      section: 'why-us',
      command: (e) => {
        e.originalEvent?.preventDefault();
        this.smoothScroll.scrollTo('why-us');
      },
    },
    {
      label: 'Services',
      url: '#services',
      section: 'services',
      command: (e) => {
        e.originalEvent?.preventDefault();
        this.smoothScroll.scrollTo('services');
      },
    },
    {
      label: 'Case Studies',
      url: '#case-studies',
      section: 'case-studies',
      command: (e) => {
        e.originalEvent?.preventDefault();
        this.smoothScroll.scrollTo('case-studies');
      },
    },
    {
      label: 'About',
      url: '#about',
      section: 'about',
      command: (e) => {
        e.originalEvent?.preventDefault();
        this.smoothScroll.scrollTo('about');
      },
    },
    {
      label: 'Contact',
      url: '#contact',
      section: 'contact',
      command: (e) => {
        e.originalEvent?.preventDefault();
        this.smoothScroll.scrollTo('contact');
      },
    },
  ];

  readonly items = computed<MenuItem[]>(() => {
    const active = this.scrollState.activeSection();
    return this.baseItems.map((item) => ({
      ...item,
      styleClass: this.getItemStyleClass(item.section, item.styleClass, active),
    }));
  });

  readonly carouselItems = this.baseItems.filter(
    (item) => !item.styleClass?.includes('mobile-cta-item'),
  );

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  constructor() {
    // Bug fix #2 — scroll-driven sync:
    // effect() re-runs whenever activeSection signal changes (triggered by
    // IntersectionObserver in ScrollStateService as the user scrolls).
    // We map the new section string → carousel index and re-centre the track.
    effect(() => {
      const activeSection = this.scrollState.activeSection();
      const idx = this.carouselItems.findIndex((item) => item.section === activeSection);
      if (idx !== -1 && idx !== this.centeredActiveIndex) {
        this.centeredActiveIndex = idx;
        // rAF ensures the DOM has applied any pending class changes before we measure
        requestAnimationFrame(() => this.updateCenteredCarousel());
        this.cdr.markForCheck();
      }
    });
  }

  ngAfterViewInit(): void {
    // Initial render once Angular has laid out the DOM
    requestAnimationFrame(() => this.updateCenteredCarousel());

    // Re-calculate offset if the container is resized (orientation change, etc.)
    const container = this.centeredCarouselContainer()?.nativeElement;
    if (container && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => this.updateCenteredCarousel());
      });
      this.resizeObserver.observe(container);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  // ── Centered carousel — public handlers ───────────────────────────────────

  onCarouselButtonClick(item: MenuItem & { section?: string }, event: Event): void {
    item.command?.({ originalEvent: event });
  }

  onCenteredCarouselClick(item: MenuItem & { section?: string }, event: Event): void {
    // Find which carousel index was clicked
    const idx = this.carouselItems.findIndex((ci) => ci.section === item.section);
    if (idx !== -1) {
      this.centeredActiveIndex = idx;
      this.updateCenteredCarousel();
      this.cdr.markForCheck();
    }
    item.command?.({ originalEvent: event });
  }

  /** Called by the dot indicators */
  setCenteredActive(index: number, event: Event): void {
    this.centeredActiveIndex = index;
    this.updateCenteredCarousel();
    this.cdr.markForCheck();
    // Also trigger the scroll for that section
    const item = this.carouselItems[index];
    item?.command?.({ originalEvent: event });
  }

  // ── Centered carousel — core update logic ─────────────────────────────────
  //
  // Bug fix #1 — pixel-perfect centering:
  // Instead of computing offset from hardcoded constants (which drifts due to
  // gap accumulation, sub-pixel rounding, and scale transforms), we:
  //   1. Temporarily reset the transform so getBoundingClientRect() reports
  //      the button's natural (untranslated) position in the document.
  //   2. Read the container's centre in viewport coords.
  //   3. Read the active button's centre in viewport coords.
  //   4. The required offset is exactly the difference between them.
  //
  // Visual state rules:
  //   dist === 0  → active  : scale(1.05), full opacity
  //   dist === 1  → adjacent: scale(1),    full opacity
  //   dist  >  1  → far     : scale(1),    opacity 0.3, pointer-events: none
  //
  private updateCenteredCarousel(): void {
    const trackEl = this.centeredTrackRef()?.nativeElement;
    const container = this.centeredCarouselContainer()?.nativeElement;
    const btnEls = this.centeredBtns().map((r) => r.nativeElement);

    if (!trackEl || !container || !btnEls.length) return;

    // How this works — no reset, no reflow, no jank:
    //
    // We never touch the transition or snap the track back to zero.
    // Instead we work entirely in terms of a delta on top of whatever
    // translateX the track is already at:
    //
    //   currentOffset  = the translateX value already applied to the track
    //                    (parsed from the computed matrix, or 0 on first run)
    //
    //   At this moment the track IS at currentOffset, so getBoundingClientRect()
    //   on the active button already reflects that translated position.
    //
    //   containerCentreX = fixed viewport coordinate (never changes)
    //   activeBtnCentreX = viewport coordinate of the active button RIGHT NOW
    //                      (i.e. already includes currentOffset)
    //
    //   delta  = containerCentreX − activeBtnCentreX
    //            → how much further we still need to move
    //
    //   targetOffset = currentOffset + delta
    //                = the single translateX value that perfectly centres the button
    //
    // Because we never set transition:none or jump to translateX(0), the browser
    // animates smoothly from wherever the track currently sits to targetOffset.

    // 1. Read the track's current translateX from its computed matrix
    const matrix = new DOMMatrix(getComputedStyle(trackEl).transform);
    const currentOffset = matrix.m41; // m41 is the X translation component

    // 2. Measure live positions (track is already at currentOffset)
    const containerRect = container.getBoundingClientRect();
    const activeBtn = btnEls[this.centeredActiveIndex];
    const activeBtnRect = activeBtn.getBoundingClientRect();

    const containerCentreX = containerRect.left + containerRect.width / 2;
    const activeBtnCentreX = activeBtnRect.left + activeBtnRect.width / 2;

    // 3. Compute target — no reflow needed
    const delta = containerCentreX - activeBtnCentreX;
    const targetOffset = currentOffset + delta;

    // 4. Apply — transition is always-on in CSS, so this animates smoothly
    trackEl.style.transform = `translateX(${targetOffset}px)`;

    // 5. Per-button visual states
    btnEls.forEach((btn, i) => {
      const dist = Math.abs(i - this.centeredActiveIndex);
      btn.style.opacity = dist > 1 ? '0.3' : '1';
      btn.style.pointerEvents = dist > 1 ? 'none' : 'auto';
      btn.style.transform = dist === 0 ? 'scale(1.05)' : 'scale(1)';
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  scrollToContact(): void {
    this.smoothScroll.scrollTo('contact');
  }

  private getItemStyleClass(
    section: string | undefined,
    baseClass: string | undefined,
    activeSection: string,
  ): string {
    const classes = [baseClass || ''].filter(Boolean);
    if (section && section === activeSection && activeSection !== 'hero') {
      classes.push('nav-item-active');
    }
    return classes.join(' ').trim();
  }
}
