import type { TranslatedField } from "../../shared/i18n/pickLang";

export type Community = {
  id: string | number;
  name: TranslatedField;
  description: TranslatedField;
  image_url: string | null;
  members_count?: number | null;
  created_at?: string | null;
};

export type Particle = {
  x: number;
  y: number;
  scale: number;
  dx: number;
  dy: number;
  duration: number;
};