import { driveCar, controlEngine } from './api';
import { trackTimeInterval } from './timeTracker/timeTracker';
import { setWinners } from './winners/winnersControl';
import { getState } from './sate/appState';

const activeAnimations = new Map<number, number>();
let firstCarFinished = false;

export async function drive(id: string) {
  const idNum = Number(id);
  try {
    const data = await startOneCar(idNum);
    const car = document.getElementById(`car-image-${idNum}`);
    const finish = document.getElementById(`track-id=${idNum}`);

    if (data) {
      const velocity = data.velocity / 1000;
      if (car && finish) smoothMoveBySpeed(car, finish, velocity, idNum);
    }
    const res = await driveResponse(idNum);
    if (!res?.success && car) {
      stopAnimation(idNum);
    }
  } catch {
    console.log('Error');
  }
}

export async function startOneCar(idCar: number) {
  try {
    const dataStart = await controlEngine(idCar, 'started');
    return dataStart;
  } catch {
    console.log('error');
    return null;
  }
}

export async function stopOneCar(idCar: number) {
  try {
    const dataStop = await controlEngine(idCar, 'stopped');
    console.log(dataStop);
    return dataStop;
  } catch {
    console.log('error');
    return null;
  }
}

export async function driveResponse(id: number) {
  try {
    const driveResponse = await driveCar(id);
    return driveResponse;
  } catch {
    console.log('error');
    return null;
  }
}

export async function smoothMoveBySpeed(
  element: HTMLElement,
  finish: HTMLElement,
  speed: number,
  id: number
): Promise<void> {
  stopAnimation(id);

  const startTimeForData = new Date();

  const startTime = performance.now();
  const startPosition = element.getBoundingClientRect().left;
  const targetPosition = finish.getBoundingClientRect().left;
  const distance = targetPosition - startPosition;

  const duration = Math.abs(distance / speed);

  async function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const ease = progress * (2 - progress);
    const newPosition = startPosition + distance * ease;
    element.style.transform = `translateX(${newPosition - startPosition}px)`;
    if (progress < 1) {
      const animationId = requestAnimationFrame(animate);
      activeAnimations.set(id, animationId);
    } else {
      // в этой части добавляю первую приехавашую машину в таблицу победителей
      activeAnimations.delete(id);
      const timer = trackTimeInterval(startTimeForData);

      if (!firstCarFinished) {
        firstCarFinished = true;
        await setWinners(id, timer, 1);
        return;
      }

      stopOneCar(id).catch(() => console.log('error stopping'));
    }
  }

  const animationId = requestAnimationFrame(animate);
  activeAnimations.set(id, animationId);
}

export function stopAnimation(id: number): void {
  const animationId = activeAnimations.get(id);
  if (animationId) {
    cancelAnimationFrame(animationId);
    activeAnimations.delete(id);
    stopOneCar(id).catch(() => console.log('error stopping'));
  }
}

export async function startAllSelectedCars(): Promise<void> {
  const currentPage = getState().garagePage;
  const page = document.getElementById(`page-${currentPage}`);

  if (page) {
    const selectedCars = page.querySelectorAll('.btn-start');
    if (selectedCars) {
      try {
        const startPromises = Array.from(selectedCars).map(async (carElement) => {
          const id = carElement.getAttribute('data-car-id');
          if (!id) return null;

          const idNum = Number(id);
          try {
            const data = await startOneCar(idNum);
            return { id: idNum, data, element: carElement };
          } catch (error) {
            console.error(`Error starting car ${id}:`, error);
            return { id: idNum, error, element: carElement };
          }
        });

        const results = await Promise.all(startPromises);

        results.forEach(async (result) => {
          if (result && result.data) {
            console.log(`Car ${result.id} started successfully`);
            const carImg = document.getElementById(`car-image-${result.id}`);
            const finish = document.getElementById(`track-id=${result.id}`);
            if (carImg && finish && result.data.velocity) {
              const velocity = result.data.velocity / 1000;
              smoothMoveBySpeed(carImg, finish, velocity, result.id);
            }
            const res = await driveResponse(result.id);
            if (!res?.success) {
              stopAnimation(result.id);
            }
          }
        });
      } catch (error) {
        console.error('Error in batch start:', error);
      }
    }
  }
}

export function resetRace() {
  firstCarFinished = false;
  activeAnimations.forEach((animationId, id) => {
    cancelAnimationFrame(animationId);
    stopOneCar(id).catch(() => console.log('error stopping'));
  });
  activeAnimations.clear();

  document.querySelectorAll('.car-image-container').forEach((el) => {
    (el as HTMLElement).style = '';
  });
}
