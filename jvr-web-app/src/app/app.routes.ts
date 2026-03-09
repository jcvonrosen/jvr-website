import { Routes } from '@angular/router';

import { Homepage } from './pages/homepage/homepage';
import { ServicesPage } from './pages/services-page/services-page';
import { WhyUsPage } from './pages/why-us-page/why-us-page';
import { AboutUs } from './pages/about-us/about-us';
import { ContactPage } from './pages/contact-page/contact-page';
import { GetStartedPage } from './pages/get-started-page/get-started-page';
import { CaseStudy } from './pages/case-study/case-study';
import { BlogPage } from './pages/blog-page/blog-page';
import { PressPage } from './pages/press-page/press-page';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'services', component: ServicesPage },
  { path: 'why-us', component: WhyUsPage },
  { path: 'about', component: AboutUs },
  { path: 'contact', component: ContactPage },
  { path: 'get-started', component: GetStartedPage },
  { path: 'case-studies', component: CaseStudy },
  { path: 'blog', component: BlogPage },
  { path: 'press', component: PressPage },
  { path: '**', redirectTo: '' },
];
