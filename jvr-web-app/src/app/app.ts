import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { TopMenubar } from './shared/top-menubar/top-menubar';
import { Footer } from './shared/footer/footer';
import { SmoothScrollService } from './services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopMenubar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  private smoothScroll = inject(SmoothScrollService);
  private titleService = inject(Title);

  readonly navAnnouncement = signal('');

  private url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly showShell = computed(() => this.url() !== '/');

  constructor() {
    afterNextRender(() => {
      this.smoothScroll.init();

      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
          this.smoothScroll.scrollToTop();
          // Announce navigation to screen readers via live region
          const title = this.titleService.getTitle();
          this.navAnnouncement.set('');
          setTimeout(() => this.navAnnouncement.set(`Navigated to ${title}`), 50);
          // Move focus to main content area
          const main = document.getElementById('main-content');
          if (main) main.focus();
        });
    });
  }
}
