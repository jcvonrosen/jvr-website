import { Component } from '@angular/core';
import { SectionHeader } from '../../../../shared/section-header/section-header';

@Component({
  selector: 'app-process-section',
  imports: [SectionHeader],
  templateUrl: './process-section.html',
  styleUrl: './process-section.css',
})
export class ProcessSection {
  steps = [
    {
      num: '01',
      colorClass: 's1',
      title: 'Discovery',
      description:
        'We meet with your stakeholders to understand your goals, constraints, and critical success factors — before any planning begins.',
    },
    {
      num: '02',
      colorClass: 's2',
      title: 'Planning',
      description:
        'We document requirements, review them with your team, and produce proof-of-concept code or mockups to validate the approach before production work begins.',
    },
    {
      num: '03',
      colorClass: 's3',
      title: 'Implementation',
      description:
        'Development is iterative and MVP-first. Working software is delivered early and often, with regular stakeholder reviews built into every cycle.',
    },
    {
      num: '04',
      colorClass: 's4',
      title: 'Delivery & QA',
      description:
        'We define a quality assurance process centered on customer acceptance, finalize the delivery, and include post-launch support to ensure a stable transition.',
    },
  ];
}
