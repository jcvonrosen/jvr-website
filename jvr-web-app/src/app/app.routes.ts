import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',           loadComponent: () => import('./pages/landing-page/landing-page').then(m => m.LandingPage),    title: 'JvR Enterprises — Enterprise Software Consulting' },
  { path: 'home',       loadComponent: () => import('./pages/homepage/homepage').then(m => m.Homepage),              title: 'Home — JvR Enterprises' },
  { path: 'services',   loadComponent: () => import('./pages/services-page/services-page').then(m => m.ServicesPage), title: 'Services — JvR Enterprises' },
  { path: 'why-us',     loadComponent: () => import('./pages/why-us-page/why-us-page').then(m => m.WhyUsPage),        title: 'Why Us — JvR Enterprises' },
  { path: 'about',      loadComponent: () => import('./pages/about-us/about-us').then(m => m.AboutUs),                title: 'About Us — JvR Enterprises' },
  { path: 'contact',    loadComponent: () => import('./pages/contact-page/contact-page').then(m => m.ContactPage),    title: 'Contact — JvR Enterprises' },
  { path: 'case-studies', loadComponent: () => import('./pages/case-study/case-study').then(m => m.CaseStudy),        title: 'Case Studies — JvR Enterprises' },
  { path: '**', redirectTo: '' },
];
