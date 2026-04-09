import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  NgZone,
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
export class TopMenubar {
  readonly themeService = inject(ThemeService);
  readonly scrollState = inject(ScrollStateService);
  readonly smoothScroll = inject(SmoothScrollService);
  private readonly ngZone = inject(NgZone);

  private carouselContainer = viewChild<ElementRef<HTMLDivElement>>('carouselContainer');
  private carouselButtons = viewChildren<ElementRef<HTMLButtonElement>>('carouselBtn');

  // Base menu items configuration — section IDs match the scrollState tracking
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
    {
      label: 'Message Us',
      url: '#contact',
      section: 'contact',
      styleClass: 'mobile-cta-item',
      command: (e) => {
        e.originalEvent?.preventDefault();
        this.smoothScroll.scrollTo('contact');
      },
    },
  ];

  // Reactive menu items — recompute whenever activeSection changes
  readonly items = computed<MenuItem[]>(() => {
    const active = this.scrollState.activeSection();
    return this.baseItems.map((item) => ({
      ...item,
      styleClass: this.getItemStyleClass(item.section, item.styleClass, active),
    }));
  });

  // Carousel items — excludes the mobile CTA "Message Us" button
  readonly carouselItems = this.baseItems.filter(
    (item) => !item.styleClass?.includes('mobile-cta-item'),
  );

  private getItemStyleClass(
    section: string | undefined,
    baseClass: string | undefined,
    activeSection: string,
  ): string {
    const classes = [baseClass || ''].filter(Boolean);
    // Only apply active class if this item's section matches the current active section
    // and it's not the 'hero' section (hero doesn't highlight any nav item)
    if (section && section === activeSection && activeSection !== 'hero') {
      classes.push('nav-item-active');
    }
    return classes.join(' ').trim();
  }

  scrollToContact(): void {
    this.smoothScroll.scrollTo('contact');
  }

  onCarouselButtonClick(item: MenuItem & { section?: string }, event: Event): void {
    item.command?.({ originalEvent: event });
  }

  constructor() {
    // No initialization needed for carousel - browser handles scroll position
  }
}
