import Axios from 'axios';

import { env } from '@/config/env';

export const api = Axios.create({
  baseURL: env.API_BASE_URL,
});

api.interceptors.response.use((response) => {
  return response.data;
});
