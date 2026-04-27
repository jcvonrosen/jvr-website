import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ContactFormModel } from '../../interfaces/contact-form.interface';
import { ContactEmailProvider } from '../../services/contact-email.service';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhpProvider extends ContactEmailProvider {
  constructor(private http: HttpClient) {
    super();
  }

  override sendEmail(contactForm: ContactFormModel): Observable<HttpResponse<void>> {
    return this.http.post<void>(environment.phpEmailServer.apiUrl, contactForm, {
      observe: 'response',
    });
  }
}
