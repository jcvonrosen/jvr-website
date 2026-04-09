import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
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
export class TopMenubar implements AfterViewInit {
  readonly themeService = inject(ThemeService);
  readonly scrollState = inject(ScrollStateService);
  readonly smoothScroll = inject(SmoothScrollService);

  @ViewChild('carouselContainer') carouselContainer?: ElementRef<HTMLDivElement>;
  @ViewChildren('carouselBtn') carouselButtons?: QueryList<ElementRef<HTMLButtonElement>>;

  // Base menu items configuration — section IDs match the scrollState tracking
  private readonly baseItems: Array<MenuItem & { section?: string }> = [
    {
      label: 'Why Us',
      url: '#why-us',
      section: 'why-us',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('why-us'); },
    },
    {
      label: 'Services',
      url: '#services',
      section: 'services',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('services'); },
    },
    {
      label: 'Case Studies',
      url: '#case-studies',
      section: 'case-studies',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('case-studies'); },
    },
    {
      label: 'About',
      url: '#about',
      section: 'about',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('about'); },
    },
    {
      label: 'Contact',
      url: '#contact',
      section: 'contact',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('contact'); },
    },
    {
      label: 'Message Us',
      url: '#contact',
      section: 'contact',
      styleClass: 'mobile-cta-item',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('contact'); },
    },
  ];

  // Reactive menu items — recompute whenever activeSection changes
  readonly items = computed<MenuItem[]>(() => {
    const active = this.scrollState.activeSection();
    return this.baseItems.map(item => ({
      ...item,
      styleClass: this.getItemStyleClass(item.section, item.styleClass, active),
    }));
  });

  // Carousel items — excludes the mobile CTA "Message Us" button
  readonly carouselItems = this.baseItems.filter(item => !item.styleClass?.includes('mobile-cta-item'));

  private getItemStyleClass(section: string | undefined, baseClass: string | undefined, activeSection: string): string {
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

  constructor() {
    // Watch for active section changes and center the corresponding carousel button
    effect(() => {
      const activeSection = this.scrollState.activeSection();
      if (activeSection && activeSection !== 'hero') {
        this.centerActiveCarouselButton(activeSection);
      }
    });
  }

  ngAfterViewInit(): void {
    // Center the initial active button after view initialization
    const activeSection = this.scrollState.activeSection();
    if (activeSection && activeSection !== 'hero') {
      this.centerActiveCarouselButton(activeSection);
    }
  }

  private centerActiveCarouselButton(section: string): void {
    if (!this.carouselContainer || !this.carouselButtons) return;

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      const buttonArray = this.carouselButtons?.toArray() || [];
      const activeButton = buttonArray.find(
        btn => btn.nativeElement.getAttribute('data-section') === section
      );

      if (!activeButton) return;

      const container = this.carouselContainer!.nativeElement;
      const button = activeButton.nativeElement;

      // Calculate scroll position to center the button
      const containerWidth = container.offsetWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    });
  }
}
