export interface Car {
  id: number;
  name: string;
  color: string;
}
export interface EngineResponse {
  velocity: number;
  distance: number;
}
export interface DriveResponse {
  success: boolean;
}
export interface Winner {
  id: number;
  wins: number;
  time: number;
}
export interface CarWithStates extends Car {
  velocity?: number;
  distance?: number;
  success?: boolean;
  time?: number;
  isEngineStarted?: boolean;
  isDriving?: boolean;
  isBroken?: boolean;
}
export interface PaginationParams {
  _page?: number;
  _limit?: number;
}


export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}


export const EngineStatus = {
  STARTED: 'started',
  STOPPED: 'stopped',
  DRIVE: 'drive',
} as const;
