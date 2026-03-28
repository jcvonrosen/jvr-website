import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/mega-page/mega-page').then(m => m.MegaPage),
    title: 'JvR Enterprises — Enterprise Software Consulting',
  },
  { path: '**', redirectTo: '' },
];
