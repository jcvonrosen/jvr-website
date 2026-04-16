import { Injectable } from '@angular/core';
import { ContactFormModel } from '../../interfaces/contact-form.interface';
import { ContactEmailProvider } from '../../services/contact-email.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResendProvider extends ContactEmailProvider {
  constructor(private http: HttpClient) {
    super();
  }

  override sendEmail(contactForm: ContactFormModel): Observable<HttpResponse<void>> {
    return this.http.post<void>(environment.emailServer.apiUrl + 'resend/email', contactForm, {
      observe: 'response',
    });
  }
}
