import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeader } from '../../../../shared/section-header/section-header';

@Component({
  selector: 'app-why-jvr-section',
  imports: [RouterLink, SectionHeader],
  templateUrl: './why-jvr-section.html',
  styleUrl: './why-jvr-section.css',
})
export class WhyJvrSection {
  features = [
    {
      icon: 'pi-handshake',
      dotColor: 'blue',
      title: 'A Trusted Partner, Not a Vendor',
      description:
        'The client has the vision. We make it a reality. We embed with your team, share accountability, and take genuine ownership of outcomes.',
    },
    {
      icon: 'pi-users',
      dotColor: 'purple',
      title: 'Team-First Approach',
      description:
        'We face every challenge together — internally and alongside our clients. When something needs solving, everyone is accountable for finding the solution.',
    },
    {
      icon: 'pi-crosshairs',
      dotColor: 'orange',
      title: 'Practical Technology Selection',
      description:
        'We evaluate every technology on one question: does it genuinely help the client? We are not here to sell the latest trend — we are here to build the right solution.',
    },
    {
      icon: 'pi-lightbulb',
      dotColor: 'blue',
      title: 'Genuine Passion for the Craft',
      description:
        'Everyone on our team genuinely loves what they do. That enthusiasm is not a talking point — it shows up in how thoughtfully we build and how reliably we deliver.',
    },
  ];

  industries = ['Manufacturing', 'Retail', 'Energy', 'Education'];

  techStack = ['Azure', 'AWS', 'Angular', 'React', 'Vue', '.NET / C#', 'Node.js', 'Playwright'];
}
