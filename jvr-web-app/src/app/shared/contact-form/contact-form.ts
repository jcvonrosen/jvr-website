import { Component, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { InputMask } from 'primeng/inputmask';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { SubjectOption, ContactFormModel } from '../../interfaces/contact-form.interface';
import { ResendProvider } from '../../provider/contact-email/resend.provider';

const EMPTY_FORM: ContactFormModel = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: null,
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[a-zA-Z\-]+$/;

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule, FormField, InputText, Select, Textarea, InputMask, Button, Message],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm implements OnInit {
  constructor(private emailProvider: ResendProvider) {}

  // ── Must be declared before contactForm so validators can close over it ──
  readonly submitted = signal(false);

  // ── Form field signals ─────────────────────────────────────────
  contactFormModel = signal<ContactFormModel>({ ...EMPTY_FORM });

  contactForm = form(this.contactFormModel, (schema) => {
    // ── firstName ────────────────────────────────────────────────
    validate(schema.firstName, ({ value }) => {
      const v = value().trim();
      if (!v)
        return this.submitted() ? { kind: 'required', message: 'First name is required.' } : null;
      if (!NAME_RE.test(v))
        return { kind: 'invalid', message: 'First name may only contain letters and hyphens.' };
      return null;
    });

    // ── lastName ─────────────────────────────────────────────────
    validate(schema.lastName, ({ value }) => {
      const v = value().trim();
      if (!v)
        return this.submitted() ? { kind: 'required', message: 'Last name is required.' } : null;
      if (!NAME_RE.test(v))
        return { kind: 'invalid', message: 'Last name may only contain letters and hyphens.' };
      return null;
    });

    // ── email ────────────────────────────────────────────────────
    validate(schema.email, ({ value }) => {
      const v = value().trim();
      if (!v) return this.submitted() ? { kind: 'required', message: 'Email is required.' } : null;
      if (!EMAIL_RE.test(v))
        return { kind: 'email', message: 'Please enter a valid email address.' };
      return null;
    });

    // ── phone (optional) ─────────────────────────────────────────
    validate(schema.phone, ({ value }) => {
      const digits = value().replace(/\D/g, '');
      if (digits.length > 0 && digits.length < 10)
        return { kind: 'invalid', message: 'Phone number must be 10 digits.' };
      return null;
    });

    // ── subject ──────────────────────────────────────────────
    validate(schema.subject, ({ value }) => {
      if (!value() && this.submitted())
        return { kind: 'required', message: 'Please select an inquiry type.' };
      return null;
    });

    // ── message ──────────────────────────────────────────────────
    validate(schema.message, ({ value }) => {
      if (!value().trim() && this.submitted())
        return { kind: 'required', message: 'Message is required.' };
      return null;
    });
  });

  // ── Manual touched state for ngModel-bound fields ─────────────
  readonly phoneTouched = signal(false);
  readonly messageTouched = signal(false);

  // ── Form submission state ──────────────────────────────────────
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);

  // ── Subject type options ───────────────────────────────────────
  readonly subjectOptions: SubjectOption[] = [
    { label: 'Full-Stack Development', value: 'full-stack' },
    { label: 'Cloud Architecture & Migration', value: 'cloud' },
    { label: 'ETL & Data Pipelines', value: 'etl' },
    { label: 'Automated Testing & QA', value: 'testing' },
    { label: 'AI Workflow Integration', value: 'ai' },
    { label: 'Team Augmentation', value: 'team' },
    { label: 'General Inquiry', value: 'general' },
    { label: 'Careers', value: 'careers' },
    { label: 'Billing', value: 'billing' },
  ];

  // ── Whether any field has a non-empty value ───────────────────
  readonly formDirty = computed(() => {
    const m = this.contactFormModel();
    return !!(m.firstName || m.lastName || m.email || m.phone || m.subject || m.message);
  });

  // ── Whether the form has been touched at all ──────────────────
  readonly formTouched = computed(
    () =>
      this.submitted() ||
      this.contactForm.firstName().touched() ||
      this.contactForm.lastName().touched() ||
      this.contactForm.email().touched() ||
      this.phoneTouched() ||
      this.contactForm.subject().touched() ||
      this.messageTouched(),
  );

  // ── Per-field invalid state ────────────────────────────────────
  // Required errors: only after submit.  Format errors: after touch.
  readonly firstNameInvalid = computed(
    () =>
      (this.contactForm.firstName().touched() || this.submitted()) &&
      this.contactForm.firstName().invalid(),
  );
  readonly lastNameInvalid = computed(
    () =>
      (this.contactForm.lastName().touched() || this.submitted()) &&
      this.contactForm.lastName().invalid(),
  );
  readonly emailInvalid = computed(
    () =>
      (this.contactForm.email().touched() || this.submitted()) &&
      this.contactForm.email().invalid(),
  );
  readonly phoneInvalid = computed(() => this.phoneTouched() && this.contactForm.phone().invalid());
  readonly subjectInvalid = computed(
    () =>
      (this.contactForm.subject().touched() || this.submitted()) &&
      this.contactForm.subject().invalid(),
  );
  readonly messageInvalid = computed(
    () => (this.messageTouched() || this.submitted()) && this.contactForm.message().invalid(),
  );

  // ── Init: ensure clean state on component mount ───────────────
  ngOnInit(): void {
    this.contactFormModel.set({ ...EMPTY_FORM });
    this.contactForm().reset();
    this.submitted.set(false);
  }

  // ── Submit ─────────────────────────────────────────────────────
  async onSubmit(): Promise<void> {
    this.submitted.set(true); // triggers required validators reactively
    this.submitError.set(null);

    if (!this.contactForm().valid()) return;

    this.isSubmitting.set(true);
    try {
      const result = await firstValueFrom(this.emailProvider.sendEmail(this.contactFormModel()));
      console.log('Email send result:', result.status, result);
      if (result.status === 200 || result.ok) {
        console.log('Contact form submitted:', this.contactFormModel());
        this.submitSuccess.set(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      this.submitError.set(msg);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // ── Clear form values, touched state, and submitted flag ───────
  clearForm(): void {
    this.contactFormModel.set({ ...EMPTY_FORM });
    this.contactForm().reset();
    this.submitted.set(false);
    this.phoneTouched.set(false);
    this.messageTouched.set(false);
    this.submitError.set(null);
  }

  // ── Reset back to the empty form (after success) ───────────────
  resetForm(): void {
    this.contactFormModel.set({ ...EMPTY_FORM });
    this.contactForm().reset();
    this.submitted.set(false);
    this.phoneTouched.set(false);
    this.messageTouched.set(false);
    this.submitSuccess.set(false);
    this.submitError.set(null);
  }
}
