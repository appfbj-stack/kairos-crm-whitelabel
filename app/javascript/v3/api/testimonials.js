import kairosConstants from 'dashboard/constants/globals';
import kairosAPI from './apiClient';

export const getTestimonialContent = () => {
  return kairosAPI.get(kairosConstants.TESTIMONIAL_URL);
};
