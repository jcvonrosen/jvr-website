import { afterNextRender, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { TopMenubar } from './shared/top-menubar/top-menubar';
import { Footer } from './shared/footer/footer';
import { SmoothScrollService } from './services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopMenubar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  private smoothScroll = inject(SmoothScrollService);
  private titleService = inject(Title);

  readonly navAnnouncement = signal('');

  constructor() {
    afterNextRender(() => {
      this.smoothScroll.init();

      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
          const title = this.titleService.getTitle();
          this.navAnnouncement.set('');
          setTimeout(() => this.navAnnouncement.set(`Navigated to ${title}`), 50);
          const main = document.getElementById('main-content');
          if (main) main.focus();
        });
    });
  }
}
