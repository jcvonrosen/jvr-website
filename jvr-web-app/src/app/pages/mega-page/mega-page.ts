import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
} from '@angular/core';
import { SectionHeader } from '../../shared/section-header/section-header';
import { ContactForm } from '../../shared/contact-form/contact-form';
import { SmoothScrollService } from '../../services/smooth-scroll.service';
import { ScrollStateService } from '../../services/scroll-state.service';

@Component({
  selector: 'app-mega-page',
  imports: [SectionHeader, ContactForm],
  templateUrl: './mega-page.html',
  styleUrl: './mega-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MegaPage {
  private readonly doc = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  readonly scrollState = inject(ScrollStateService);
  readonly smoothScroll = inject(SmoothScrollService);

  // ── Services tab carousel ─────────────────────────────────────────
  selectedCapability = signal(0);
  private capCarouselEl = viewChild<ElementRef<HTMLElement>>('capCarousel');

  selectCapability(i: number): void {
    this.selectedCapability.set(i);

    // Scroll to the divider that opens the "What We Do" subsection if not in view
    const divider = this.doc.getElementById('what-we-do-divider');
    if (divider) {
      const rect = divider.getBoundingClientRect();
      const navHeight = 57;
      // Only skip scroll if the divider is already sitting just below the nav
      // (within 100px). On mobile the old `* 0.75` threshold was too wide —
      // the divider could be mid-screen while the carousel was also visible,
      // so the scroll never fired.
      const alreadyFramed = rect.top >= navHeight && rect.top <= navHeight + 100;
      if (!alreadyFramed) {
        this.smoothScroll.scrollTo('what-we-do-divider');
      }
    }

    this.centerActiveButton('smooth');
  }

  private centerActiveButton(behavior: ScrollBehavior = 'smooth'): void {
    const carousel = this.capCarouselEl()?.nativeElement;
    if (!carousel) return;
    const i = this.selectedCapability();
    const btn = carousel.children[i] as HTMLElement;
    if (!btn) return;
    const scrollLeft = btn.offsetLeft + btn.offsetWidth / 2 - carousel.offsetWidth / 2;
    carousel.scrollTo({ left: Math.max(0, scrollLeft), behavior });
  }

  // ── Case studies filter ───────────────────────────────────────────
  selectedIndustries = signal<string[]>([]);

  filteredStudies = computed(() => {
    const selected = this.selectedIndustries();
    if (selected.length === 0) return this.caseStudies;
    return this.caseStudies.filter(study =>
      study.industries.some(ind => selected.includes(ind))
    );
  });

  toggleIndustry(label: string): void {
    this.selectedIndustries.update(current =>
      current.includes(label) ? current.filter(i => i !== label) : [...current, label]
    );
  }

  toggleIndustryAndScroll(label: string): void {
    this.toggleIndustry(label);

    const divider = this.doc.getElementById('studies-divider');
    if (divider) {
      const rect = divider.getBoundingClientRect();
      const navHeight = 57;
      const alreadyFramed = rect.top >= navHeight && rect.top <= navHeight + 100;
      if (!alreadyFramed) {
        this.smoothScroll.scrollTo('studies-divider');
      }
    }
  }

  isSelected(label: string): boolean {
    return this.selectedIndustries().includes(label);
  }

  clearFilter(): void {
    this.selectedIndustries.set([]);
  }

  // ── IntersectionObserver setup ────────────────────────────────────
  constructor() {
    afterNextRender(() => {
      this.ngZone.runOutsideAngular(() => {
        // Hero visibility — drives nav show/hide
        const heroEl = this.doc.getElementById('hero');
        if (heroEl) {
          const heroObs = new IntersectionObserver(
            ([entry]) => {
              this.ngZone.run(() => this.scrollState.heroVisible.set(entry.isIntersecting));
            },
            { threshold: 0.2 }
          );
          heroObs.observe(heroEl);
        }

        // Active section — drives background colour shift.
        //
        // A section is "selected" when its top divider has crossed 35% of the
        // effective viewport (below the nav bar).  The "effective viewport" is the
        // visible area below the fixed nav: (innerHeight - NAV_HEIGHT).
        //
        //   triggerLine = NAV_HEIGHT + (innerHeight - NAV_HEIGHT) * 0.35
        //
        // We walk sections in DOM order and keep the last one whose top rect ≤
        // triggerLine — that is the section the user is currently "in".  This is
        // equivalent to saying both:
        //   • the section's top divider is ≤ 35 % from the top (below nav), AND
        //   • the next section's top divider hasn't crossed that line yet (so the
        //     current section still owns the viewport from 35 % downward).
        const NAV_HEIGHT = 57;
        const sectionOrder = ['hero', 'why-us', 'services', 'case-studies', 'about', 'contact'];

        const resolveActiveByScroll = () => {
          const triggerLine = NAV_HEIGHT + (window.innerHeight - NAV_HEIGHT) * 0.35;
          let newActive = sectionOrder[0];
          for (const id of sectionOrder) {
            const el = this.doc.getElementById(id);
            if (!el) continue;
            if (el.getBoundingClientRect().top <= triggerLine) {
              newActive = id;
            }
          }
          this.ngZone.run(() => this.scrollState.activeSection.set(newActive));
        };

        // Run once on load, then on every scroll frame.
        resolveActiveByScroll();
        let scrollRaf = 0;
        window.addEventListener(
          'scroll',
          () => {
            cancelAnimationFrame(scrollRaf);
            scrollRaf = requestAnimationFrame(resolveActiveByScroll);
          },
          { passive: true }
        );

        // On viewport resize, re-anchor to whichever section was active before
        // the resize began, so the user doesn't lose their place.
        let resizeTimer: ReturnType<typeof setTimeout> | null = null;
        let sectionBeforeResize: string | null = null;

        window.addEventListener('resize', () => {
          if (resizeTimer === null) {
            // Capture the active section at the start of the resize gesture.
            sectionBeforeResize = this.scrollState.activeSection();
          }
          clearTimeout(resizeTimer!);
          resizeTimer = setTimeout(() => {
            resizeTimer = null;
            if (sectionBeforeResize) {
              this.smoothScroll.scrollToInstant(sectionBeforeResize);
              sectionBeforeResize = null;
            }
          }, 150);
        });

        // Re-center active carousel button when carousel width changes (viewport resize)
        const carousel = this.capCarouselEl()?.nativeElement;
        if (carousel) {
          const ro = new ResizeObserver(() => this.centerActiveButton('instant'));
          ro.observe(carousel);
        }
      });
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // DATA
  // ══════════════════════════════════════════════════════════════════

  // ── Why JvR (from homepage) ───────────────────────────────────────
  whyFeatures = [
    {
      dotColor: 'blue',
      title: 'You Own the Solution',
      description:
        'We build within your environment, on your infrastructure. When the engagement ends, the solution is fully yours — documented, understood, and built the way your team works.',
    },
    {
      dotColor: 'purple',
      title: 'Your Needs Drive the Technology',
      description:
        'We do not arrive with a preferred stack to promote. Every tool we recommend is evaluated on one question: does it genuinely fit your system, your team, and your goals?',
    },
    {
      dotColor: 'orange',
      title: 'Clients Call Us Part of Their Team',
      description:
        'The most consistent feedback we hear is that clients are glad to have us on their team — not working for them, on their team. That distinction is how we know an engagement is going well.',
    },
    {
      dotColor: 'blue',
      title: 'The Hard Problems Come to Us',
      description:
        'When difficult tasks come up, clients consistently hand them to us. That kind of trust is earned, not claimed — and it drives how we show up every day.',
    },
  ];

  whyIndustries = ['Manufacturing', 'Retail', 'Energy', 'Education', 'Insurance'];
  whyTechStack = ['Azure', 'AWS', 'Angular', 'React', 'Vue', '.NET / C#', 'Node.js', 'Playwright'];

  // ── Process steps ─────────────────────────────────────────────────
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

  // ── Scenarios ─────────────────────────────────────────────────────
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
        'Your team is strong, but the project calls for expertise you have not yet built internally. We bring the depth; your team provides the context.',
    },
    {
      icon: 'pi-link',
      colorClass: 'orange',
      title: 'Reliability and Quality at Scale',
      description:
        'Enterprise systems need to connect reliably and behave predictably under load. We build and integrate automated testing, establish deployment processes, and help teams maintain quality as their systems grow.',
    },
  ];

  // ── Mini case studies (Why Us — results) ─────────────────────────
  miniCaseStudies = [
    {
      industry: 'Retail / Manufacturing',
      colorClass: 'blue',
      fragment: 'forecasting-pipeline',
      stat: '6 hrs → 20 min',
      statLabel: 'Pipeline Runtime',
      challenge: 'A forecasting pipeline analysts could only run once or twice per day was bottlenecking business decisions.',
      outcome: 'Runtime cut from six hours to twenty minutes — a full week of scenarios completable in a single day. Nearly 20% cost savings in year one.',
    },
    {
      industry: 'Education',
      colorClass: 'purple',
      fragment: 'enrollment-rules-engine',
      stat: '1 System',
      statLabel: 'Every State. Every School.',
      challenge: 'A charter school network needed one enrollment system that applied different state-specific acceptance rules per school.',
      outcome: 'A configurable rules engine handled every state and school variation within a single workflow — no duplicate logic, no separate processes.',
    },
    {
      industry: 'Retail',
      colorClass: 'orange',
      fragment: 'payment-cloud-migration',
      stat: 'Zero',
      statLabel: 'Service Disruption',
      challenge: 'A major retailer needed to simultaneously switch payment providers and migrate analytics infrastructure from on-prem to Azure.',
      outcome: 'Both initiatives coordinated in parallel and completed without interrupting live operations.',
    },
  ];

  // ── Services capabilities (detailed — for expandable cards) ───────
  capabilities = [
    {
      id: 'full-stack',
      icon: 'pi-code',
      colorClass: 'blue',
      title: 'Full-Stack Application Development',
      preview: 'Enterprise-grade applications built across the full stack — from Angular, React, and Vue on the front end to .NET / C# and Node.js on the back end.',
      description:
        'From Angular, React, and Vue on the front end to .NET / C# and Node.js on the back end — we build enterprise-grade applications that handle complex workflows and scale with your business. We specialize in internal systems and B2B integrations, not consumer-facing marketing sites.',
      tags: ['Angular', 'React', 'Vue', '.NET / C#', 'Node.js', 'TypeScript'],
      bestFor: 'New enterprise systems or rewrites of outdated internal applications.',
    },
    {
      id: 'cloud',
      icon: 'pi-cloud',
      colorClass: 'purple',
      title: 'Cloud Architecture & Migration',
      preview: 'Cloud solutions on Azure and AWS — infrastructure architecture, on-prem to cloud migrations, Azure Data Factory pipelines, and message queue systems.',
      description:
        'We design and implement cloud solutions on Azure and AWS — and have been growing our Google Cloud expertise as well. This includes infrastructure architecture, on-prem to cloud migrations, Azure Data Factory pipelines, and message queue systems like Kafka and RabbitMQ.',
      tags: ['Azure', 'AWS', 'Azure Data Factory', 'Kafka', 'RabbitMQ'],
      bestFor: 'Organizations modernizing legacy infrastructure or moving large workloads to the cloud.',
    },
    {
      id: 'etl',
      icon: 'pi-database',
      colorClass: 'orange',
      title: 'ETL & Data Pipelines',
      preview: 'Deep expertise in large-scale data movement — complex transformations, phased migrations running two systems in parallel, and reconciliation pipelines.',
      description:
        'We have deep expertise in large-scale data movement — whether for internal system functionality, cloud migrations, or analytics workflows. We have handled complex transformations, phased migrations running two systems in parallel, and built reconciliation pipelines to ensure data integrity throughout.',
      tags: ['Azure Data Factory', 'SQL Server', 'Kafka', 'Data Transformation'],
      bestFor: 'Organizations with large datasets to migrate, transform, or move between systems.',
    },
    {
      id: 'testing',
      icon: 'pi-check-circle',
      colorClass: 'blue',
      title: 'Automated Testing & QA',
      preview: 'Automated test suites for UI and API layers using Playwright, integrated into CI/CD pipelines — with AI-assisted generation for broader coverage.',
      description:
        'We build automated test suites for UI and API layers using Playwright and custom frameworks, integrated directly into your CI/CD pipeline. We have also built supporting tooling to track test outcomes against documented test cases — and leveraged AI to generate more comprehensive coverage in significantly less time.',
      tags: ['Playwright', 'CI/CD Integration', 'API Testing', 'AI-Assisted Testing'],
      bestFor: 'Enterprise teams that need reliable regression coverage without slowing release cycles.',
    },
    {
      id: 'ai',
      icon: 'pi-microchip',
      colorClass: 'purple',
      title: 'AI Workflow Integration',
      preview: 'Practical AI adoption into development workflows and business processes — Semantic Kernel orchestrations, OpenAI, Claude, and Azure AI Search.',
      description:
        'We have integrated AI into our own processes and helped clients do the same — using it as a guide and accelerator, while our team still owns the work. We build orchestrations with Semantic Kernel and OpenAI, and have used Claude and Qwen as active development partners.',
      tags: ['Semantic Kernel', 'OpenAI GPTs', 'Claude', 'Azure AI Search', 'Qwen'],
      bestFor: 'Teams looking for real, practical AI adoption — focused on outcomes, not hype.',
    },
    {
      id: 'team',
      icon: 'pi-users',
      colorClass: 'orange',
      title: 'Team Integration & Augmentation',
      preview: 'We embed directly with your group — adopting your tools, attending your standups, contributing as a natural extension of your team.',
      description:
        'When you have the team but need more capacity or specialized skills for a specific initiative, we embed directly with your group. We adopt your tools, attend your standups, and contribute as a natural extension of your team — not a separate vendor managing a separate queue.',
      tags: ['Embedded Consulting', 'Staff Augmentation', 'Agile / Kanban', 'Long-Term Engagements'],
      bestFor: 'Large enterprise initiatives where capacity or specialized skills are the gap.',
    },
  ];

  // ── Tech stack ────────────────────────────────────────────────────
  techStack = [
    { category: 'Languages',           colorClass: 'blue',   items: ['C# / .NET', 'Node.js', 'TypeScript', 'JavaScript'] },
    { category: 'Front End',           colorClass: 'purple', items: ['Angular', 'React', 'Vue', 'Svelte'] },
    { category: 'Cloud',               colorClass: 'orange', items: ['Azure', 'AWS', 'Google Cloud'] },
    { category: 'Data & Integration',  colorClass: 'blue',   items: ['Azure Data Factory', 'Kafka', 'RabbitMQ', 'SQL Server'] },
    { category: 'AI & Search',         colorClass: 'purple', items: ['Semantic Kernel', 'OpenAI GPTs', 'Azure AI Search', 'Claude'] },
    { category: 'Quality & Security',  colorClass: 'orange', items: ['Playwright', 'SonarQube', 'Veracode', 'CI/CD Integration'] },
  ];

  // ── Engagement models ─────────────────────────────────────────────
  engagementModels = [
    {
      icon: 'pi-clock',
      colorClass: 'blue',
      title: 'Time & Materials',
      description:
        'All of our work is time and materials. We provide high-level estimates upfront and work with you to define a schedule of deliverables that fits your budget — no hidden assumptions baked into a fixed-bid scope.',
    },
    {
      icon: 'pi-send',
      colorClass: 'purple',
      title: 'Pilot Engagements',
      description:
        'We encourage clients who are not ready for a full build to start small. A focused pilot lets you validate assumptions, prove value to stakeholders, and build confidence before committing to a larger investment.',
    },
    {
      icon: 'pi-refresh',
      colorClass: 'orange',
      title: 'Long-Term Partnerships',
      description:
        'Most of our work is sustained engagement within existing client teams — often spanning months to years. After any project delivery, we offer retainer agreements to stay available for ongoing support and new work.',
    },
  ];

  // ── Honest limits ─────────────────────────────────────────────────
  honestLimits = [
    'Marketing websites and consumer-facing promotional sites',
    'UI / UX design work — we build systems, not storefronts',
    'Fixed-scope, fixed-bid project proposals',
    'Early-stage startups without established infrastructure',
  ];

  // ── Case studies ──────────────────────────────────────────────────
  caseStudies = [
    {
      id: 'forecasting-pipeline',
      industry: 'Retail / Manufacturing',
      industries: ['Retail', 'Manufacturing'],
      colorClass: 'blue',
      title: 'Forecasting Pipeline Redesign',
      challenge: 'A data gathering process central to "what if" forecasting scenarios took six hours to complete. Analysts could only run it once or twice per day — severely limiting how many scenarios they could model before decisions had to be made.',
      solution: 'Redesigned the data pipeline architecture, eliminating bottlenecks and optimizing query and transformation logic throughout the process.',
      outcome: 'Runtime dropped from six hours to twenty minutes. Analysts went from one run per day to completing a full week\'s worth of scenarios in a single session.',
      stat: { value: '6 hrs → 20 min', label: 'Pipeline Runtime' },
      impact: 'Contributed to nearly 20% cost savings in the first year.',
    },
    {
      id: 'enrollment-rules-engine',
      industry: 'Education',
      industries: ['Education'],
      colorClass: 'purple',
      title: 'Student Enrollment Rules Engine',
      challenge: 'A charter school network operating across multiple states needed a single student information system where each school could apply its own acceptance criteria based on state-specific requirements.',
      solution: 'Designed a configurable rules engine that selectively applied state-specific and school-specific acceptance rules conditionally within a single, shared enrollment workflow for National Heritage Academies.',
      outcome: 'A scalable enrollment system that accommodated each school\'s rules without code duplication — reducing maintenance overhead and making future rule changes straightforward.',
      stat: null,
      impact: null,
    },
    {
      id: 'payment-cloud-migration',
      industry: 'Retail',
      industries: ['Retail'],
      colorClass: 'orange',
      title: 'Payment Platform & Cloud Migration',
      challenge: 'A major retail client needed to simultaneously switch payment providers and migrate payment acceptance and analytics infrastructure from on-premise servers to Azure — without disrupting live operations.',
      solution: 'Coordinated a phased migration strategy covering payment pipeline redesign, Azure infrastructure provisioning, and analytics process migration — executed in parallel to keep live systems stable throughout.',
      outcome: 'Successful migration completed without service interruption. The client transitioned to modern Azure-native infrastructure with updated payment processing and analytics capabilities.',
      stat: { value: 'Zero', label: 'Service Disruption' },
      impact: null,
    },
    {
      id: 'legacy-data-migration',
      industry: 'Enterprise',
      industries: [],
      colorClass: 'blue',
      title: 'Large-Scale Legacy Data Migration',
      challenge: 'A major enterprise needed to migrate large volumes of legacy data to a new cloud architecture. The data involved complex transformations and the migration was phased — requiring both old and new systems to run simultaneously for an extended period.',
      solution: 'Built the migration pipelines and designed additional reconciliation pipelines that ran continuously while both systems were live, automatically identifying discrepancies in real time.',
      outcome: 'A clean, validated migration to cloud architecture with full data integrity coverage maintained throughout the entire transition window.',
      stat: null,
      impact: null,
    },
    {
      id: 'automated-testing',
      industry: 'Manufacturing · Energy · Retail',
      industries: ['Manufacturing', 'Energy', 'Retail'],
      colorClass: 'purple',
      title: 'Enterprise Automated Testing Programs',
      challenge: 'Multiple enterprise clients had complex, high-stakes systems but lacked the tooling and processes to maintain reliable automated test coverage — especially as deployment cadences increased.',
      solution: 'Built automated UI and API test suites using Playwright and custom frameworks, integrated directly into CI/CD pipelines. Used AI-assisted generation on select engagements to build more comprehensive coverage in less time.',
      outcome: 'Reliable, repeatable regression coverage at scale across multiple enterprise clients — reducing manual QA overhead and surfacing defects earlier in the release cycle.',
      stat: null,
      impact: null,
    },
    {
      id: 'workforce-scheduling',
      industry: 'Energy / Utilities',
      industries: ['Energy', 'Utilities'],
      colorClass: 'orange',
      title: 'Long-Term Workforce Scheduling Platform',
      challenge: 'A regional energy utility had an active workforce scheduling application used daily by schedulers and field technicians. The platform needed continuous feature development but lacked onboarding documentation and a long-term development partner.',
      solution: 'Embedded directly within the client\'s development team for three years. Delivered ongoing Angular UI enhancements, extended the .NET REST API, and built a custom usage analytics tool. Authored an 80-page internal environment setup guide and assisted with onboarding the client\'s own new engineers.',
      outcome: 'The platform grew steadily throughout the engagement — expanded admin workflows, new operational analytics, and a fully documented environment. JvR became the institutional knowledge resource for the team.',
      stat: { value: '3 Years', label: 'Embedded Partnership' },
      impact: 'The most consistent feedback we receive: clients say they are glad to have us on their team — not working for them, on their team.',
    },
  ];

  caseStudyIndustries = [
    { label: 'Retail',        icon: 'pi-shopping-cart', colorClass: 'blue'   },
    { label: 'Manufacturing', icon: 'pi-cog',           colorClass: 'purple' },
    { label: 'Energy',        icon: 'pi-bolt',          colorClass: 'orange' },
    { label: 'Education',     icon: 'pi-book',          colorClass: 'blue'   },
    { label: 'Insurance',     icon: 'pi-shield',        colorClass: 'purple' },
    { label: 'Utilities',     icon: 'pi-building',      colorClass: 'orange' },
  ];

  // ── About — milestones ────────────────────────────────────────────
  milestones = [
    { year: '1990', text: 'Jay began his career as a software developer, starting on mainframes while keeping a close eye on the early internet.' },
    { year: '1999', text: 'Jay joined a specialized internet software consultancy — and found a deep appreciation for the craft, the diversity of clients, and the people who simply love to build.' },
    { year: '2010', text: 'JvR Enterprises was founded. After years of watching great companies drift away from their technical roots, Jay set out to build a firm that never would.' },
    { year: '2014', text: 'Mike Wardman joined the team. Together, they led the development of Applications & Enrollment for National Heritage Academies\' Student Information System.' },
    { year: '2020', text: 'Mike took on a new enterprise engagement at Amway and deepened his focus on AWS cloud infrastructure.' },
    { year: '2022', text: 'Jay applied his Azure expertise to a major initiative with Meijer. Khiem Nguyen joined the team, bringing full-stack depth to a new engagement with Consumers Energy.' },
    { year: '2026', text: 'The entire team embraces AI as a core part of the workflow — accelerating analysis, research, and delivery without replacing the craft.' },
  ];

  // ── About — values ────────────────────────────────────────────────
  values = [
    {
      icon: 'pi-users',
      colorClass: 'blue',
      title: 'Success Is a Team Sport',
      description: 'We tackle challenges together — with each other and with our clients. When something needs solving, we own it as a team. That means honest communication, shared accountability, and showing up fully, even when things get complicated.',
    },
    {
      icon: 'pi-bullseye',
      colorClass: 'purple',
      title: 'Right Tool, Not the Trending One',
      description: 'We evaluate every technology on one question: does it genuinely help our clients? We are not here to sell the latest trend. We are here to find the right solution — and build it well.',
    },
    {
      icon: 'pi-lightbulb',
      colorClass: 'orange',
      title: 'We Actually Love This Work',
      description: 'Jay likes to say that the best developers would be writing code in a dark alley if it were illegal. That is the energy we look for in everyone we hire. Curiosity and genuine enthusiasm for the craft make all the difference.',
    },
  ];

  // ── About — team ──────────────────────────────────────────────────
  team = [
    {
      name: 'Jay von Rosen',
      role: 'Founder & Principal Consultant',
      initials: 'JvR',
      colorClass: 'blue',
      bio: 'Jay has been writing software since 1990 and working in internet consulting since 1999. He started JvR in 2010 with a clear goal: build a firm where developers are trusted partners, not order-takers. He specializes in Azure and enterprise systems, speaks at tech meetups across the region, and organizes Beer City Code — one of the Midwest\'s best developer conferences.',
      bio2: '',
      tags: ['Azure', 'Enterprise Architecture', 'C#', '.NET'],
    },
    {
      name: 'Mike Wardman',
      role: 'Senior Consultant — AWS & QA Automation',
      initials: 'MW',
      colorClass: 'purple',
      bio: 'Mike joined JvR in 2014 and has been a steady, reliable part of the team ever since. He co-led the build of Applications & Enrollment for National Heritage Academies\' Student Information System, and has since become our go-to for AWS infrastructure and Playwright-based test automation.',
      bio2: 'Outside the office, he moonlights as a Dungeon Master running tabletop RPG campaigns, volunteers as a live-streaming technician for roller derby competitions, and runs his own home servers — always tinkering with the next interesting technology.',
      tags: ['AWS', 'Playwright', 'Test Automation', 'Node.js'],
    },
    {
      name: 'Khiem Nguyen, P.E.',
      role: 'Full-Stack Consultant — Angular & .NET',
      initials: 'KN',
      colorClass: 'orange',
      bio: 'Khiem came to software after a decade as a licensed Professional Engineer — a background that shows in how he approaches complex systems. He holds a Master\'s in Applied Computer Science from Grand Valley State University and has been with JvR since 2022, collaborating with senior developers at Consumers Energy on Angular UI components and .NET API development.',
      bio2: 'Outside work, he tends a garden monitored by a personal IoT system he built — with an Angular dashboard, Semantic Kernel AI backend, and multi-cloud integration. He also enjoys cooking, leatherwork, pottery, and woodworking.',
      tags: ['Angular', 'TypeScript / JavaScript', '.NET / C#', 'AI / Semantic Kernel'],
    },
  ];
}
