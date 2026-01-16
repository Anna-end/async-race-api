import { Car, EngineResponse, DriveResponse, PaginationParams, PaginatedResponse } from './types';

const API_BASE_URL = 'http://localhost:3000';

async function sendRequest<T>(andpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${andpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {} as T;
    }

    if (response.status === 500) {
      throw new Error('Car engine broken');
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
