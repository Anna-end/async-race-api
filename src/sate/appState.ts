type AppView = 'garage' | 'winner';

export interface AppState {
  currentView: AppView;
  garagePage: number;
  winnersPage: number;
  selectedCarId: number | null;
  totalCars: number;
  totalWinners: number;
  carsPerPage: number;
  winnersPerPage: number;
  sortBy: 'id' | 'time' | null;
  sortOrder: 'ASC' | 'DESC' | null;
}

const initialState: AppState = {
  currentView: 'garage',
  garagePage: 1,
  winnersPage: 1,
  selectedCarId: null,
  totalCars: 0,
  totalWinners: 0,
  carsPerPage: 7,
  winnersPerPage: 10,
  sortBy: null,
  sortOrder: null,
};

let state: AppState = { ...initialState };

export function getState(): AppState {
  return JSON.parse(JSON.stringify(state));
}

export function setState(updates: Partial<AppState>): void {
  const oldState = { ...state };
  state = { ...state, ...updates };
  console.log('State changed:', {
    from: oldState,
    to: state,
    changed: updates,
  });
}

export function updateCarsState(minus: number = 0, plus: number = 0) {
  const currentNumCars = getState().totalCars;

  if (minus === 0) {
    setState({ totalCars: currentNumCars + plus });
  }

  if (plus === 0) {
    setState({ totalCars: currentNumCars - plus });
  }
}

export function updateWinnerState(minus: number = 0, plus: number = 0) {
  const currentNumWinners = getState().totalWinners;

  if (minus === 0) {
    setState({ totalWinners: currentNumWinners + plus });
  }

  if (plus === 0) {
    setState({ totalCars: currentNumWinners - plus });
  }
}

export function updatePageState(minus: number = 0, plus: number = 0) {
  const currentNumCars = getState().garagePage;

  if (minus === 0) {
    setState({ garagePage: currentNumCars + plus });
  }

  if (plus === 0) {
    setState({ garagePage: currentNumCars - plus });
  }
}

export function switchView(view: AppView): void {
  setState({
    currentView: view,
    selectedCarId: null,
  });
}
