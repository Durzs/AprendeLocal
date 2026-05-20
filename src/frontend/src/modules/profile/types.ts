export type TranslatedField = string | Record<string, string> | null | undefined;

export type ProfileData = {
  name: TranslatedField;
  age: number | null;
  avatarUrl: TranslatedField;
  cep: TranslatedField;
};

export type CepLookupResult = {
  ok: boolean;
  error: string | null;
  data: {
    cidade: string;
    uf: string;
    bairro: string;
  } | null;
};

export type Particle = {
  x: number;
  y: number;
  scale: number;
  dx: number;
  dy: number;
  duration: number;
};