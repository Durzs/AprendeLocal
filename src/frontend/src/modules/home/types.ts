export type TranslatedField = string | Record<string, string> | null | undefined;

export type Course = {
  id: string | number;
  titulo: TranslatedField;
  categoria: TranslatedField;
  nivel: TranslatedField;
  url_img?: string;
  descricao?: TranslatedField;
};

export type HeroSectionProps = {
  onStart: () => void;
  onExplore: () => void;
};

export type CourseCardProps = {
  course: Course;
};

export type CoursesSectionProps = {
  courses: Course[];
  loading: boolean;
  error: string;
};

export type CallToActionProps = {
  onStart: () => void;
};

export type Particle = {
  x: number;
  y: number;
  scale: number;
  dx: number;
  dy: number;
  duration: number;
};