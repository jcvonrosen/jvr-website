import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeader } from '../../shared/section-header/section-header';

@Component({
  selector: 'app-about-us',
  imports: [RouterLink, SectionHeader],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  milestones = [
    {
      year: '1990',
      text: 'Jay began his career as a software developer, starting on mainframes while keeping a close eye on the early internet.',
    },
    {
      year: '1999',
      text: 'Jay joined a specialized internet software consultancy — and found a deep appreciation for the craft, the diversity of clients, and the people who simply love to build.',
    },
    {
      year: '2010',
      text: 'JvR Enterprises was founded. After years of watching great companies drift away from their technical roots, Jay set out to build a firm that never would.',
    },
    {
      year: '2014',
      text: 'Mike Wardman joined the team. Together, they led the development of Applications & Enrollment for National Heritage Academies\' Student Information System.',
    },
    {
      year: '2020',
      text: 'Mike took on a new enterprise engagement at Amway and deepened his focus on AWS cloud infrastructure.',
    },
    {
      year: '2022',
      text: 'Jay applied his Azure expertise to a major initiative with Meijer. Khiem Nguyen joined the team, bringing full-stack depth to a new engagement with Consumers Energy.',
    },
    {
      year: '2026',
      text: 'The entire team embraces AI as a core part of the workflow — accelerating analysis, research, and delivery without replacing the craft.',
    },
  ];

  values = [
    {
      icon: 'pi-users',
      colorClass: 'blue',
      title: 'Success Is a Team Sport',
      description:
        'We tackle challenges together — with each other and with our clients. When something needs solving, we own it as a team. That means honest communication, shared accountability, and showing up fully, even when things get complicated.',
    },
    {
      icon: 'pi-bullseye',
      colorClass: 'purple',
      title: 'Right Tool, Not the Trending One',
      description:
        'We evaluate every technology on one question: does it genuinely help our clients? We are not here to sell the latest trend or position ourselves as thought leaders. We are here to find the right solution — and build it well.',
    },
    {
      icon: 'pi-lightbulb',
      colorClass: 'orange',
      title: 'We Actually Love This Work',
      description:
        'Jay likes to say that the best developers would be writing code in a dark alley if it were illegal. That is the energy we look for in everyone we hire. Curiosity and genuine enthusiasm for the craft make all the difference.',
    },
  ];

  team = [
    {
      name: 'Jay von Rosen',
      bio2: '',
      role: 'Founder & Principal Consultant',
      initials: 'JvR',
      colorClass: 'blue',
      bio: 'Jay has been writing software since 1990 and working in internet consulting since 1999. He started JvR in 2010 with a clear goal: build a firm where developers are trusted partners, not order-takers. He specializes in Azure and enterprise systems, speaks at tech meetups across the region, and organizes Beer City Code — one of the Midwest\'s best developer conferences.',
      tags: ['Azure', 'Enterprise Architecture', 'C#', '.NET'],
    },
    {
      name: 'Mike Wardman',
      bio2: '',
      role: 'Senior Consultant — AWS & QA Automation',
      initials: 'MW',
      colorClass: 'purple',
      bio: 'Mike joined JvR in 2014 and has been a steady, reliable part of the team ever since. He co-led the build of Applications & Enrollment for National Heritage Academies\' Student Information System, and has since become our go-to for AWS infrastructure and Playwright-based test automation. Outside of work, he volunteers his time as a live-streaming technician for roller derby competitions.',
      tags: ['AWS', 'Playwright', 'Test Automation', 'Node.js'],
    },
    {
      name: 'Khiem Nguyen, P.E.',
      role: 'Full-Stack Consultant — Angular & .NET',
      initials: 'KN',
      colorClass: 'orange',
      bio: 'Khiem came to software after a decade as a licensed Professional Engineer — a background that shows in how he approaches complex systems. He holds a Master\'s in Applied Computer Science from Grand Valley State University and has been with JvR since 2022, collaborating with senior developers at Consumers Energy on Angular UI components and .NET API development for a large employee scheduling platform.',
      bio2: 'Outside of client work, he designed and built a personal IoT gardening system — combining an AI-powered backend using Semantic Kernel, a real-time Angular dashboard, and multi-cloud integration.',
      tags: ['Angular', 'TypeScript / JavaScript', '.NET / C#', 'AI / Semantic Kernel'],
    },
  ];
}
