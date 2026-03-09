export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  income?: number | null;
  source?: string | null;
  interested_project_id?: string | null;
  subject?: string | null;
  message?: string | null;
  status?: string | null;
  next_step?: string | null;
  next_step_at?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type UpdateLeadPayload = {
  status?: string;
  next_step?: string;
  next_step_at?: string;
  source?: string;
};
