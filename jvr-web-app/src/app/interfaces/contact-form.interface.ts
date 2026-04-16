export interface SubjectOption {
  label: string;
  value: string;
}

export interface ContactFormModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string | null;
  message: string;
}
