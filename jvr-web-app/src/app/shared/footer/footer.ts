import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SmoothScrollService } from '../../services/smooth-scroll.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly smoothScroll = inject(SmoothScrollService);
  year = new Date().getFullYear();
}
