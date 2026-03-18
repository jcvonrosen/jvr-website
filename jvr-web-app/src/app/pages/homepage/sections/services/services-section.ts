import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SectionHeader } from '../../../../shared/section-header/section-header';

@Component({
  selector: 'app-services-section',
  imports: [RouterLink, CardModule, SectionHeader],
  templateUrl: './services-section.html',
  styleUrl: './services-section.css',
})
export class ServicesSection {
  services = [
    {
      icon: '🖥️',
      iconColor: 'blue',
      title: 'Frontend Development',
      description:
        'Enterprise web applications built with Angular, React, or Vue — responsive, dynamic, and designed to handle real complexity at scale.',
    },
    {
      icon: '☁️',
      iconColor: 'purple',
      title: 'Cloud Infrastructure',
      description:
        'Azure and AWS architecture, deployment, and ongoing operations. We bring deep platform expertise to cloud migrations and enterprise integrations.',
    },
    {
      icon: '⚙️',
      iconColor: 'orange',
      title: 'Backend Development',
      description:
        'Solid, maintainable server-side systems built with C#/.NET and Node.js — REST APIs, service layers, and the infrastructure that keeps enterprise applications running.',
    },
    {
      icon: '🔄',
      iconColor: 'blue',
      title: 'ETL & Data Pipelines',
      description:
        'Large-scale data movement built for reliability — whether for internal system functionality, reporting, or enterprise analytics workflows.',
    },
    {
      icon: '✅',
      iconColor: 'purple',
      title: 'Automated Testing & QA',
      description:
        'Playwright-based and custom automated testing integrated directly into your deployment pipeline — so quality is enforced at every release.',
    },
    {
      icon: '🤖',
      iconColor: 'orange',
      title: 'AI Integration',
      description:
        'Practical AI adoption into existing development workflows and business processes — focused on real utility and measurable outcomes, not trends.',
    },
  ];
}
