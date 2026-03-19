import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { InputMask } from 'primeng/inputmask';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

interface InquiryOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule, InputText, Select, Textarea, InputMask, Button, Message],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  // ── Form field signals ─────────────────────────────────────────
  firstName   = signal('');
  lastName    = signal('');
  email       = signal('');
  phone       = signal('');
  inquiryType = signal<string | null>(null);
  message     = signal('');

  // ── Touched state — drives per-field validation display ────────
  private touchedFields = signal<Record<string, boolean>>({});

  // ── Form submission state ──────────────────────────────────────
  isSubmitting  = signal(false);
  submitSuccess = signal(false);
  submitError   = signal<string | null>(null);

  // ── Inquiry type options ───────────────────────────────────────
  readonly inquiryOptions: InquiryOption[] = [
    { label: 'Frontend Development',        value: 'frontend' },
    { label: 'Cloud Infrastructure',        value: 'cloud' },
    { label: 'Backend Development & APIs',  value: 'backend' },
    { label: 'ETL & Data Pipelines',        value: 'etl' },
    { label: 'Automated Testing & QA',      value: 'testing' },
    { label: 'AI Workflow Integration',     value: 'ai' },
    { label: 'Careers',                     value: 'careers' },
    { label: 'Business Consulting',         value: 'consulting' },
    { label: 'Billing',                     value: 'billing' },
    { label: 'Project Management',          value: 'project-management' },
    { label: 'UX/UI Design',               value: 'ux-design' },
  ];

  // ── Computed overall form validity ─────────────────────────────
  isFormValid = computed(() =>
    this.firstName().trim().length > 0 &&
    this.lastName().trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()) &&
    this.inquiryType() !== null &&
    this.message().trim().length > 0
  );

  // ── Mark a single field as touched (called on blur) ────────────
  markTouched(field: string): void {
    this.touchedFields.update(prev => ({ ...prev, [field]: true }));
  }

  // ── Per-field invalid check ────────────────────────────────────
  isFieldInvalid(field: string): boolean {
    if (!this.touchedFields()[field]) return false;
    switch (field) {
      case 'firstName':   return !this.firstName().trim();
      case 'lastName':    return !this.lastName().trim();
      case 'email':       return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email());
      case 'inquiryType': return !this.inquiryType();
      case 'message':     return !this.message().trim();
      default:            return false;
    }
  }

  // ── Mark every required field as touched (on submit attempt) ───
  private markAllTouched(): void {
    this.touchedFields.set({
      firstName:   true,
      lastName:    true,
      email:       true,
      inquiryType: true,
      message:     true,
    });
  }

  // ── Submit — fill in your backend / API call in the try block ──
  async onSubmit(): Promise<void> {
    this.markAllTouched();
    this.submitError.set(null);

    if (!this.isFormValid()) return;

    this.isSubmitting.set(true);

    try {
      // TODO: replace with your backend / API call, e.g.:
      // await this.contactService.send({
      //   firstName:   this.firstName(),
      //   lastName:    this.lastName(),
      //   email:       this.email(),
      //   phone:       this.phone(),
      //   inquiryType: this.inquiryType(),
      //   message:     this.message(),
      // });

      this.submitSuccess.set(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      this.submitError.set(msg);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // ── Reset back to the empty form ───────────────────────────────
  resetForm(): void {
    this.firstName.set('');
    this.lastName.set('');
    this.email.set('');
    this.phone.set('');
    this.inquiryType.set(null);
    this.message.set('');
    this.touchedFields.set({});
    this.submitSuccess.set(false);
    this.submitError.set(null);
  }
}
