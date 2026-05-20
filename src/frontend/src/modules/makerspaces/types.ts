export type TranslatedField = string | Record<string, string> | null | undefined;

export type Makerspace = {
  id: number;
  name: TranslatedField;
  rating: number;
  description: TranslatedField;
  location: TranslatedField;
  hours: TranslatedField;
  image: string;
};

export type Particle = {
  x: number;
  y: number;
  scale: number;
  dx: number;
  dy: number;
  duration: number;
};