"""
Clasificador de ecosistemas para zonas de La Araucanía.
MVP: Features tabulares + Random Forest sobre datos CONAF + Sentinel-2.
"""

from dataclasses import dataclass
from enum import Enum


class EcosystemType(Enum):
    BOSQUE_ARAUCARIA = "bosque_araucaria"
    BOSQUE_VALDIVIANO = "bosque_templado_valdiviano"
    MATORRAL_ANDINO = "matorral_andino"
    ESTEPA_ALTOANDINA = "estepa_altoandina"
    HUMEDAL = "humedal"
    ZONA_VOLCANICA = "zona_volcanica"
    PRADERA_AGRICOLA = "pradera_agricola"


@dataclass
class EcosystemProfile:
    ecosystem_type: EcosystemType
    vegetation: list[str]
    biodiversity_index: float
    conservation_status: str
    key_species: list[str]
    threats: list[str]
    stem_opportunities: list[str]


@dataclass
class GeoPoint:
    lat: float
    lon: float
    radius_km: float = 5.0


class EcosystemClassifier:
    """Clasifica el ecosistema de una zona geográfica usando datos CONAF + Sentinel-2."""

    def __init__(self, model_path: str | None = None):
        self.model = None
        self.conaf_data = None
        if model_path:
            self._load_model(model_path)

    def _load_model(self, path: str):
        # TODO: cargar modelo entrenado (sklearn joblib)
        pass

    def classify(self, point: GeoPoint) -> EcosystemProfile:
        """Clasifica el ecosistema para un punto geográfico dado."""
        features = self._extract_features(point)
        ecosystem_type = self._predict(features)
        return self._build_profile(ecosystem_type, point)

    def _extract_features(self, point: GeoPoint) -> dict:
        """Extrae features de NDVI, elevación, precipitación, etc."""
        # MVP: lookup en catastro CONAF + índices vegetacionales Sentinel-2
        return {
            "ndvi_mean": 0.0,
            "elevation_m": 0.0,
            "precipitation_mm": 0.0,
            "temperature_c": 0.0,
            "conaf_formation": "",
        }

    def _predict(self, features: dict) -> EcosystemType:
        """Predice tipo de ecosistema."""
        # TODO: usar modelo entrenado
        return EcosystemType.BOSQUE_ARAUCARIA

    def _build_profile(self, eco_type: EcosystemType, point: GeoPoint) -> EcosystemProfile:
        """Construye perfil completo del ecosistema."""
        # TODO: enriquecer con datos de biodiversidad
        return EcosystemProfile(
            ecosystem_type=eco_type,
            vegetation=[],
            biodiversity_index=0.0,
            conservation_status="",
            key_species=[],
            threats=[],
            stem_opportunities=[],
        )
