import { getState } from './sate/appState';
import { getCars } from './api';

export function generateCarImage(color: string, size: number = 40): string {
  return `
</svg>
    <svg width="${size}" height="${size / 2}" viewBox="0 0 200 100">
    
      <rect x="10" y="20" width="80" height="20" rx="5" fill="${color}" />
      
      <rect x="5" y="30" width="90" height="10" rx="4" fill="#333" />
      
 
      <circle cx="20" cy="40" r="7" fill="#666" />
      <circle cx="80" cy="40" r="7" fill="#666" />
      

      <rect x="30" y="10" width="40" height="10" rx="5" fill="${color}" />
    </svg>
  `.replace(/\s+/g, ' ');
}

export async function checkCarsOnServer() {
  try {
    const allCarsObj = await getCars();
    const allCarsArr = allCarsObj.data;
    return allCarsArr;
  } catch {
    console.log('Error');
  }
}

export function getCurrentCounterCars() {
  const currentState = getState();
  return currentState.totalCars;
}

export function displayNumberCars() {
  const allOfCarsState = getCurrentCounterCars();
  const carInGarage = document.getElementById('CarInGarage');
  if (carInGarage) {
    carInGarage.textContent = `${allOfCarsState}`;
  }
}
