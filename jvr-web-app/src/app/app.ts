import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenubar } from './shared/top-menubar/top-menubar';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopMenubar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
