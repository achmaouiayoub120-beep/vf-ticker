/**
 * Images des stades et terrains.
 * Chemins sous /assets/images/stadiums/ (public).
 */
const STADIUM_IMAGES: Record<number, string> = {
  1: '/assets/images/stadiums/mohammed_v.svg',
  2: '/assets/images/stadiums/marrakech.svg',
  3: '/assets/images/stadiums/fes.svg',
  4: '/assets/images/stadiums/moulay_abdellah.svg',
  5: '/assets/images/stadiums/tanger_ibn_batouta.svg',
};

const TERRAIN_GALLERY = [
  '/assets/images/stadiums/mohammed_v.svg',
  '/assets/images/stadiums/marrakech.svg',
  '/assets/images/stadiums/fes.svg',
  '/assets/images/stadiums/moulay_abdellah.svg',
  '/assets/images/stadiums/tanger_ibn_batouta.svg',
  '/assets/images/stadiums/terrain_night.svg',
  '/assets/images/stadiums/terrain_wide.svg',
  '/assets/images/stadiums/terrain_classic.svg',
  '/assets/images/stadiums/terrain_sunset.svg',
  '/assets/images/stadiums/terrain_aerial.svg',
];

export function getStadiumImageUrl(stadiumId: number | undefined): string {
  if (stadiumId && STADIUM_IMAGES[stadiumId]) return STADIUM_IMAGES[stadiumId];
  return STADIUM_IMAGES[1];
}

export function getTerrainGalleryUrls(): string[] {
  return TERRAIN_GALLERY;
}
