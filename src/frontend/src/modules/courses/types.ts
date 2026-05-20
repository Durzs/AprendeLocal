export type TranslatedField = string | Record<string, string> | null | undefined;

export type Course = {
  id: string | number;
  titulo: TranslatedField;
  descricao: TranslatedField;
  categoria: TranslatedField;
  nivel: TranslatedField;
  badge: TranslatedField;
  url_img: string;
};

export type Particle = {
  x: number;
  y: number;
  scale: number;
  dx: number;
  dy: number;
  duration: number;
};

export type CourseStep = {
  id: string | number;
  title: TranslatedField;
  content: TranslatedField;
  order?: number;
};

export type CourseDetails = {
  id: string | number;
  titulo: TranslatedField;
  descricao: TranslatedField;
  categoria: TranslatedField;
  nivel: TranslatedField;
  badge: TranslatedField;
  url_img?: string | null;
};

export type CourseProgress = {
  currentStep: number;
  completed: boolean;
};