import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-top-menubar',
  imports: [MenubarModule, ButtonModule, RouterModule],
  templateUrl: './top-menubar.html',
  styleUrl: './top-menubar.css',
})
export class TopMenubar {
  readonly themeService = inject(ThemeService);
  items: MenuItem[] = [
    { label: 'Home', routerLink: '/home' },
    { label: 'Services', routerLink: '/services' },
    { label: 'Why Us', routerLink: '/why-us' },
    { label: 'About', routerLink: '/about' },
    {
      label: 'Resources',
      items: [
        { label: 'Case Studies', routerLink: '/case-studies' },
      ],
    },
    { label: 'Contact', routerLink: '/contact' },
    { label: 'Get Started', routerLink: '/contact', styleClass: 'mobile-cta-item' },
  ];
}
