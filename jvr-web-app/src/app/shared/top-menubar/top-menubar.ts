import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-top-menubar',
  imports: [MenubarModule, ButtonModule, RouterModule],
  templateUrl: './top-menubar.html',
  styleUrl: './top-menubar.css',
})
export class TopMenubar {
  items: MenuItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'Services', routerLink: '/services' },
    { label: 'Why Us', routerLink: '/why-us' },
    { label: 'About', routerLink: '/about' },
    {
      label: 'Resources',
      items: [
        { label: 'Case Studies', routerLink: '/case-studies' },
        { label: 'Blog', routerLink: '/blog' },
        { label: 'Press', routerLink: '/press' },
      ],
    },
    { label: 'Contact', routerLink: '/contact' },
  ];
}
