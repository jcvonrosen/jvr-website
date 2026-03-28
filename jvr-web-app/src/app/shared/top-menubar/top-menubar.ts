import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  readonly items: MenuItem[] = [
    {
      label: 'Why Us',
      url: '#why-us',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('why-us'); },
    },
    {
      label: 'Services',
      url: '#services',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('services'); },
    },
    {
      label: 'Case Studies',
      url: '#case-studies',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('case-studies'); },
    },
    {
      label: 'About',
      url: '#about',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('about'); },
    },
    {
      label: 'Contact',
      url: '#contact',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('contact'); },
    },
    {
      label: 'Get Started',
      url: '#contact',
      styleClass: 'mobile-cta-item',
      command: e => { e.originalEvent?.preventDefault(); this.smoothScroll.scrollTo('contact'); },
    },
  ];

  scrollToContact(): void {
    this.smoothScroll.scrollTo('contact');
  }
}
