import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeader } from '../../shared/section-header/section-header';

@Component({
  selector: 'app-case-study',
  imports: [RouterLink, SectionHeader],
  templateUrl: './case-study.html',
  styleUrl: './case-study.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudy {
  private doc = inject(DOCUMENT);

  selectedIndustries = signal<string[]>([]);

  filteredStudies = computed(() => {
    const selected = this.selectedIndustries();
    if (selected.length === 0) return this.caseStudies;
    return this.caseStudies.filter(study =>
      study.industries.some(ind => selected.includes(ind))
    );
  });

  toggleIndustry(label: string) {
    this.selectedIndustries.update(current =>
      current.includes(label)
        ? current.filter(i => i !== label)
        : [...current, label]
    );
    this.doc.getElementById('studies-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  isSelected(label: string): boolean {
    return this.selectedIndustries().includes(label);
  }

  caseStudies = [
    {
      id: 'forecasting-pipeline',
      industry: 'Retail / Manufacturing',
      industries: ['Retail', 'Manufacturing'],
      colorClass: 'blue',
      title: 'Forecasting Pipeline Redesign',
      challenge:
        'A data gathering process central to "what if" forecasting scenarios took six hours to complete. Analysts could only run it once or twice per day — severely limiting how many scenarios they could model before decisions had to be made.',
      solution:
        'Redesigned the data pipeline architecture, eliminating bottlenecks and optimizing query and transformation logic throughout the process.',
      outcome:
        'Runtime dropped from six hours to twenty minutes. Analysts went from one run per day to completing a full week\'s worth of scenarios in a single session, enabling more accurate and confident forecasting decisions.',
      stat: { value: '6 hrs → 20 min', label: 'Pipeline Runtime' },
      impact: 'Contributed to nearly 20% cost savings in the first year.',
    },
    {
      id: 'enrollment-rules-engine',
      industry: 'Education',
      industries: ['Education'],
      colorClass: 'purple',
      title: 'Student Enrollment Rules Engine',
      challenge:
        'A charter school network operating across multiple states needed a single student information system where each school could apply its own acceptance criteria based on state-specific requirements — without creating separate workflows for every school.',
      solution:
        'Designed a configurable rules engine that selectively applied state-specific and school-specific acceptance rules conditionally within a single, shared enrollment workflow for National Heritage Academies.',
      outcome:
        'A scalable enrollment system that accommodated each school\'s rules without code duplication — reducing maintenance overhead and making future rule changes straightforward for the entire network.',
      stat: null,
      impact: null,
    },
    {
      id: 'payment-cloud-migration',
      industry: 'Retail',
      industries: ['Retail'],
      colorClass: 'orange',
      title: 'Payment Platform & Cloud Migration',
      challenge:
        'A major retail client needed to simultaneously switch payment providers and migrate payment acceptance and internal analytics infrastructure from on-premise servers to Azure — all without disrupting live operations.',
      solution:
        'Coordinated a phased migration strategy covering payment pipeline redesign, Azure infrastructure provisioning, and analytics process migration — planned and executed in parallel to keep live systems stable throughout the transition.',
      outcome:
        'Successful migration completed without service interruption. The client transitioned to modern Azure-native infrastructure with updated payment processing and analytics capabilities.',
      stat: { value: 'Zero', label: 'Service Disruption' },
      impact: null,
    },
    {
      id: 'legacy-data-migration',
      industry: 'Enterprise',
      industries: [],
      colorClass: 'blue',
      title: 'Large-Scale Legacy Data Migration',
      challenge:
        'A major enterprise needed to migrate large volumes of legacy data to a new cloud architecture. The data involved complex transformations, and the migration was phased — requiring both old and new systems to run simultaneously for an extended period.',
      solution:
        'Built the migration pipelines and designed additional reconciliation pipelines that ran continuously while both systems were live, automatically identifying discrepancies and flagging integrity issues in real time.',
      outcome:
        'A clean, validated migration to cloud architecture with full data integrity coverage maintained throughout the entire transition window.',
      stat: null,
      impact: null,
    },
    {
      id: 'automated-testing',
      industry: 'Manufacturing · Energy · Retail',
      industries: ['Manufacturing', 'Energy', 'Retail'],
      colorClass: 'purple',
      title: 'Enterprise Automated Testing Programs',
      challenge:
        'Multiple enterprise clients had complex, high-stakes systems but lacked the tooling and processes to maintain reliable automated test coverage — especially as deployment cadences increased.',
      solution:
        'Built automated UI and API test suites using Playwright and custom frameworks, integrated directly into CI/CD pipelines. Created supporting tooling for tracking test outcomes against documented test cases. Used AI-assisted generation on select engagements to build more comprehensive coverage in less time.',
      outcome:
        'Reliable, repeatable regression coverage at scale across multiple enterprise clients — reducing manual QA overhead and surfacing defects earlier in the release cycle.',
      stat: null,
      impact: null,
    },
    {
      id: 'workforce-scheduling',
      industry: 'Energy / Utilities',
      industries: ['Energy', 'Utilities'],
      colorClass: 'orange',
      title: 'Long-Term Workforce Scheduling Platform',
      challenge:
        'A regional energy utility had an active workforce scheduling application used daily by schedulers and field technicians. The platform needed continuous feature development, API expansion, and operational analytics tooling — but lacked onboarding documentation and a long-term development partner who truly knew the system.',
      solution:
        'Embedded directly within the client\'s development team for three years. Delivered ongoing Angular UI enhancements including a new administrative section, extended and refactored the .NET REST API, and built a custom usage analytics tool for business intelligence and support insights. Authored an 80-page internal environment setup guide and assisted with onboarding the client\'s own new engineers onto the platform.',
      outcome:
        'The platform grew steadily throughout the engagement — expanded admin workflows, new operational analytics, and a fully documented environment that no longer existed only in people\'s heads. JvR became the institutional knowledge resource for the team, to the point of onboarding the client\'s own new hires.',
      stat: { value: '3 Years', label: 'Embedded Partnership' },
      impact: 'The most consistent feedback we receive: clients say they are glad to have us on their team — not working for them, on their team.',
    },
  ];

  industries = [
    { label: 'Retail',         icon: 'pi-shopping-cart', colorClass: 'blue'   },
    { label: 'Manufacturing',  icon: 'pi-cog',           colorClass: 'purple' },
    { label: 'Energy',         icon: 'pi-bolt',          colorClass: 'orange' },
    { label: 'Education',      icon: 'pi-book',          colorClass: 'blue'   },
    { label: 'Insurance',      icon: 'pi-shield',        colorClass: 'purple' },
    { label: 'Utilities',      icon: 'pi-building',      colorClass: 'orange' },
  ];
}
