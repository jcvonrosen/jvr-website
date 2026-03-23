import { Routes } from '@angular/router';

import { LandingPage } from './pages/landing-page/landing-page';
import { Homepage } from './pages/homepage/homepage';
import { ServicesPage } from './pages/services-page/services-page';
import { WhyUsPage } from './pages/why-us-page/why-us-page';
import { AboutUs } from './pages/about-us/about-us';
import { ContactPage } from './pages/contact-page/contact-page';
import { CaseStudy } from './pages/case-study/case-study';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'home', component: Homepage },
  { path: 'services', component: ServicesPage },
  { path: 'why-us', component: WhyUsPage },
  { path: 'about', component: AboutUs },
  { path: 'contact', component: ContactPage },
  { path: 'case-studies', component: CaseStudy },
  { path: '**', redirectTo: '' },
];
