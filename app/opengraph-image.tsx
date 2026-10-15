import { SITE } from '@/lib/site';
import { socialCard, socialCardSize } from '@/lib/social-card';

export const alt = `${SITE.name} social preview`;
export const size = socialCardSize;
export const contentType = 'image/png';

export default function Image() {
  return socialCard();
}
