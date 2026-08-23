export type TranslatedField = string | Record<string, string> | null | undefined;

export type ProfileData = {
  name: TranslatedField;
  age: number | null;
  avatarUrl: TranslatedField;
  role?: string | null;
  school_id?: string | null;
  school_ids?: string[] | null;
  school_name?: string | null;
  school_commune?: string | null;
  subject?: string | null;
};

export type Particle = {
  x: number;
  y: number;
  scale: number;
  dx: number;
  dy: number;
  duration: number;
};