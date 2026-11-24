import { USE_MOCK } from '../config.js';
import * as mockApi from './mockApi.js';
import * as reportesApi from './reportesApi.js';

export const api = USE_MOCK ? mockApi : reportesApi;