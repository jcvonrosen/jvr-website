import { Component } from '@angular/core';
import { ContactForm } from '../../shared/contact-form/contact-form';

@Component({
  selector: 'app-contact-page',
  imports: [ContactForm],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage {}
