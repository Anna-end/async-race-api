import {
  Car,
  EngineResponse,
  DriveResponse,
  PaginationParams,
  PaginatedResponse,
  Winner,
  WinnersParams,
  WinnersResponse,
} from './types';

const API_BASE_URL = 'http://localhost:3000';

async function sendRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

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
  const queryParams = new URLSearchParams();

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

export async function deleteCar(id: number): Promise<void> {
  await sendRequest(`/garage/${id}`, {
    method: 'DELETE',
  });
}

export async function driveCar(id: number): Promise<DriveResponse> {
  const endpoint = `/engine?id=${id}&status=drive`;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
    });
    if (response.status === 429) {
      throw new Error('Drive already in progress');
    }
    if (response.status === 500) {
      throw new Error('Engine broken');
    }
    if (!response.ok) {
      throw new Error(`Drive failed: ${response.status}`);
    }
    return response.json();
  } catch {
    throw new Error('Drive request failed');
  }
}

export async function controlEngine(
  id: number,
  status: 'started' | 'stopped'
): Promise<EngineResponse> {
  const endpoint = `/engine?id=${id}&status=${status}`;
  return sendRequest<EngineResponse>(endpoint, {
    method: 'PATCH',
  });
}

export async function createWinner(carData: Winner): Promise<Winner> {
  return sendRequest<Winner>('/winners', {
    method: 'POST',
    body: JSON.stringify(carData),
  });
}

export async function getWinner(id: number): Promise<Winner> {
  return sendRequest<Winner>(`/winners/${id}`);
}
export async function deleteWinners(id: number): Promise<void> {
  await sendRequest(`/winners/${id}`, {
    method: 'DELETE',
  });
}

export async function getWinners(params?: WinnersParams): Promise<WinnersResponse<Winner>> {
  try {
    const url = new URL(`${API_BASE_URL}/winners`);

    if (params) {
      if (params._page !== undefined) url.searchParams.append('_page', params._page.toString());
      if (params._limit !== undefined) url.searchParams.append('_limit', params._limit.toString());
      if (params._sort) url.searchParams.append('_sort', params._sort);
      if (params._order) url.searchParams.append('_order', params._order);
    }

    console.log('Fetching from:', url.toString()); // Для отладки

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // JSON Server возвращает X-Total-Count только при наличии _limit
    const totalCountHeader = response.headers.get('X-Total-Count');
    let totalCount = data.length;

    if (totalCountHeader) {
      totalCount = parseInt(totalCountHeader, 10);
    } else if (params?._limit) {
      // Если есть лимит, но нет заголовка, делаем запрос для подсчета
      const countResponse = await fetch(`${API_BASE_URL}/winners`);
      const allWinners = await countResponse.json();
      totalCount = allWinners.length;
    }

    return {
      data: Array.isArray(data) ? data : [data],
      totalCount,
    };
  } catch (error) {
    console.error('Error in getWinners:', error);
    throw error;
  }
}
