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
      icon: 'pi-building',
      colorClass: 'blue',
      title: 'Large Initiative, Limited Staff',
      description:
        'Your organization has a significant project on the roadmap but does not have the internal capacity to deliver it alone. We integrate with your existing team and deliver as one unified group — no silos, no handoff gaps.',
    },
    {
      icon: 'pi-cog',
      colorClass: 'purple',
      title: 'New Technology, Short Timeline',
      description:
        'Your team is strong, but the project calls for expertise you have not yet built internally — whether that is cloud infrastructure, large-scale ETL, automated testing, or AI integration. We bring the depth; your team provides the context.',
    },
    {
      icon: 'pi-link',
      colorClass: 'orange',
      title: 'Reliability and Quality at Scale',
      description:
        'Enterprise systems need to connect reliably and behave predictably under load. We build and integrate automated testing, establish deployment processes, and help teams maintain quality as their systems grow.',
    },
  ];

  doList = [
    {
      icon: 'pi-building',
      color: 'blue',
      title: 'Enterprise Applications',
      desc: 'Internal business systems built to support complex organizational workflows and scale with your operations.',
    },
    {
      icon: 'pi-server',
      color: 'purple',
      title: 'Backend Services & APIs',
      desc: 'Server-side systems and REST APIs that power customer-facing platforms and internal integrations.',
    },
    {
      icon: 'pi-cloud',
      color: 'orange',
      title: 'Cloud Infrastructure',
      desc: 'Azure and AWS architecture, migrations, and ongoing operations for enterprise workloads.',
    },
    {
      icon: 'pi-code',
      color: 'blue',
      title: 'Full-Stack Development',
      desc: 'Angular, React, Vue, .NET, and Node.js — built across the entire development stack.',
    },
    {
      icon: 'pi-database',
      color: 'purple',
      title: 'ETL & Data Pipelines',
      desc: 'Large-scale, reliable data movement for internal systems, reporting, and analytics workflows.',
    },
    {
      icon: 'pi-check-circle',
      color: 'orange',
      title: 'Automated Testing & QA',
      desc: 'Playwright-based testing integrated directly into your deployment pipeline at every release.',
    },
    {
      icon: 'pi-microchip',
      color: 'blue',
      title: 'AI Workflow Integration',
      desc: 'Practical AI adoption into your existing development and business processes — focused on real outcomes.',
    },
    {
      icon: 'pi-users',
      color: 'purple',
      title: 'Team Augmentation',
      desc: 'Embedded consulting that integrates with your team rather than operating alongside it as a separate vendor.',
    },
  ];
}
