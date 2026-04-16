import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ContactFormModel } from '../interfaces/contact-form.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactEmailProvider {
  sendEmail(contactForm: ContactFormModel): Observable<HttpResponse<void>> {
    throw new Error('sendEmail() must be implemented by provider');
  }
}
