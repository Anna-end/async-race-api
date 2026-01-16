import { URLSearchParams } from 'node:url';
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

export async function getCars(params?: PaginationParams): Promise<PaginatedResponse<Car>> {
  const queryParams = new URLSearchParams(); //то что добавляется после ?

  if (params?._page) queryParams.append('_page', params._page.toString());
  if (params?._limit) queryParams.append('_limit', params._limit.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/garage?${queryString}` : '/garage';

  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch cars: ${response.status}`);
  }

  const data = await response.json();

  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);

  return {
    data: data as Car[],
    totalCount,
  };
}
export async function getCar(id: number): Promise<Car> {
  return sendRequest<Car>(`/garage/${id}`);
}
export async function createCar(carData: Omit<Car, 'id'>): Promise<Car> {
  return sendRequest<Car>('/garage', {
    method: 'POST',
    body: JSON.stringify(carData),
  });
}
export async function updateCar(id: number, carData: Omit<Car, 'id'>): Promise<Car> {
  return sendRequest<Car>(`/garage/${id}`, {
    method: 'PUT',
    body: JSON.stringify(carData),
  });
}
export async function deleteCar(id: number): Promise<void> {
  await sendRequest(`/garage/${id}`, {
    method: 'DELETE',
  });
}
