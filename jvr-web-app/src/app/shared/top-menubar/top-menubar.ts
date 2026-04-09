import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
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

// ── Centered carousel constants ──────────────────────────────────────────────
// These mirror the CSS values in .centered-nav-btn so the JS offset maths
// stays in sync with the layout. Update both places if you change sizing.
const CENTERED_BTN_W = 110;  // px  — flex: 0 0 110px in CSS
const CENTERED_GAP   = 12;   // px  — gap: 12px on .centered-carousel-track
const CENTERED_STEP  = CENTERED_BTN_W + CENTERED_GAP;

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
  readonly themeService  = inject(ThemeService);
  readonly scrollState   = inject(ScrollStateService);
  readonly smoothScroll  = inject(SmoothScrollService);
  private readonly ngZone = inject(NgZone);
  private readonly cdr    = inject(ChangeDetectorRef);

  // ── Existing carousel refs ─────────────────────────────────────────────────
  private carouselContainer = viewChild<ElementRef<HTMLDivElement>>('carouselContainer');
  private carouselButtons   = viewChildren<ElementRef<HTMLButtonElement>>('carouselBtn');

  // ── Centered carousel refs ─────────────────────────────────────────────────
  private centeredCarouselContainer = viewChild<ElementRef<HTMLDivElement>>('centeredCarouselContainer');
  private centeredTrackRef           = viewChild<ElementRef<HTMLDivElement>>('centeredTrack');
  private centeredBtns               = viewChildren<ElementRef<HTMLButtonElement>>('centeredBtn');

  /** Index of the button currently snapped to centre */
  centeredActiveIndex = 0;

  private resizeObserver: ResizeObserver | null = null;

  // ── Menu items ─────────────────────────────────────────────────────────────

  private readonly baseItems: Array<MenuItem & { section?: string }> = [
    {
      label: 'Why Us',
      url: '#why-us',
      section: 'why-us',
      command: (e) => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('why-us'); },
    },
    {
      label: 'Services',
      url: '#services',
      section: 'services',
      command: (e) => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('services'); },
    },
    {
      label: 'Case Studies',
      url: '#case-studies',
      section: 'case-studies',
      command: (e) => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('case-studies'); },
    },
    {
      label: 'About',
      url: '#about',
      section: 'about',
      command: (e) => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('about'); },
    },
    {
      label: 'Contact',
      url: '#contact',
      section: 'contact',
      command: (e) => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('contact'); },
    },
    {
      label: 'Message Us',
      url: '#contact',
      section: 'contact',
      styleClass: 'mobile-cta-item',
      command: (e) => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('contact'); },
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
  // Offset formula (same maths as the standalone widget):
  //
  //   containerWidth = visible width of .mobile-nav-carousel-centered
  //   centerX        = containerWidth / 2
  //   activeLeft     = centeredActiveIndex × CENTERED_STEP
  //
  //   offset = centerX − activeLeft − (CENTERED_BTN_W / 2)
  //
  // Setting transform: translateX(offset) on the track slides the entire
  // row so the active button's mid-point aligns with the container's mid-point.
  //
  // Visual state rules:
  //   dist === 0  → active  : scale(1.05), full opacity, purple tint bg
  //   dist === 1  → adjacent: full opacity, neutral bg
  //   dist  >  1  → far     : opacity 0.3, pointer-events: none
  //
  private updateCenteredCarousel(): void {
    const trackEl   = this.centeredTrackRef()?.nativeElement;
    const container = this.centeredCarouselContainer()?.nativeElement;
    const btnEls    = this.centeredBtns().map((r) => r.nativeElement);

    if (!trackEl || !container || !btnEls.length) return;

    const containerW = container.offsetWidth;
    const centerX    = containerW / 2;
    const offset     = centerX - (this.centeredActiveIndex * CENTERED_STEP) - (CENTERED_BTN_W / 2);

    trackEl.style.transform = `translateX(${offset}px)`;

    btnEls.forEach((btn, i) => {
      const dist     = Math.abs(i - this.centeredActiveIndex);
      const isActive = dist === 0;
      const isFar    = dist > 1;

      btn.style.opacity       = isFar ? '0.3' : '1';
      btn.style.pointerEvents = isFar ? 'none' : 'auto';
      btn.style.transform     = isActive ? 'scale(1.05)' : 'scale(1)';
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

