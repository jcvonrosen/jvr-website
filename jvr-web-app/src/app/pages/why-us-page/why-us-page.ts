import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeader } from '../../shared/section-header/section-header';

@Component({
  selector: 'app-why-us-page',
  imports: [RouterLink, SectionHeader],
  templateUrl: './why-us-page.html',
  styleUrl: './why-us-page.css',
})
export class WhyUsPage {
  processSteps = [
    {
      num: '01',
      colorClass: 'blue',
      title: 'Discovery',
      description:
        'We meet with your stakeholders to understand your goals, constraints, and critical success factors. We listen before we plan.',
    },
    {
      num: '02',
      colorClass: 'purple',
      title: 'Planning',
      description:
        'We document requirements, review them with your team, and produce proof-of-concept code or mockups to validate the approach before any production work begins.',
    },
    {
      num: '03',
      colorClass: 'orange',
      title: 'Implementation',
      description:
        'Development is iterative and MVP-first. We deliver working software early and often, with regular stakeholder reviews built into every cycle.',
    },
    {
      num: '04',
      colorClass: 'blue',
      title: 'Delivery & QA',
      description:
        'We define a quality assurance process centered on customer acceptance, finalize the delivery, and include post-launch support to ensure a stable, successful transition.',
    },
  ];

  scenarios = [
    {
      icon: '🏗️',
      colorClass: 'blue',
      title: 'Large Initiative, Limited Staff',
      description:
        'Your organization has a significant project on the roadmap but does not have the internal capacity to deliver it alone. We integrate with your existing team and deliver as one unified group — no silos, no handoff gaps.',
    },
    {
      icon: '⚙️',
      colorClass: 'purple',
      title: 'New Technology, Short Timeline',
      description:
        'Your team is strong, but the project calls for expertise you have not yet built internally — whether that is cloud infrastructure, large-scale ETL, automated testing, or AI integration. We bring the depth; your team provides the context.',
    },
    {
      icon: '🔗',
      colorClass: 'orange',
      title: 'Reliability and Quality at Scale',
      description:
        'Enterprise systems need to connect reliably and behave predictably under load. We build and integrate automated testing, establish deployment processes, and help teams maintain quality as their systems grow.',
    },
  ];

  doList = [
    'Internal enterprise applications and business systems',
    'Backend services and APIs for customer-facing platforms',
    'Cloud infrastructure on Azure and AWS',
    'Full-stack development: Angular, React, Vue, .NET, and Node.js',
    'Large-scale ETL and data movement pipelines',
    'Automated testing and QA process integration',
    'AI workflow adoption and implementation',
    'Team augmentation and embedded consulting',
  ];
}
