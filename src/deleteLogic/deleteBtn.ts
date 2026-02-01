import { deleteCar, deleteWinners, getWinners } from '../api';
import { updateCarsState } from '../sate/appState';
import { checkCarsOnServer, displayNumberCars } from '../utils';
import { getState, setState } from '../sate/appState';
import { updatePaginatorContainer } from '../paginator/paginator';
import { createPageWithCars } from '../creatorCar/creatorCar';

export async function resetRase() {
  const allCars = await checkCarsOnServer();

  allCars?.forEach(async (elem) => {
    await deleteCar(elem.id);
    await deleteWinners(elem.id);
    setState({ totalCars: 0, garagePage: 1 });
    const garage = document.querySelector('.garage-container');
    if (garage) {
      setTimeout(async () => {
        garage.innerHTML = '';
        displayNumberCars();
        updatePaginatorContainer(1);
        await createPageWithCars(1);
      }, 1000);
    }
  });
}

export function setupDeleteHandler() {
  const currentState = getState();
  const currentPage = currentState.garagePage;

  const parentForDeleteBtn = document.getElementById(`page-${currentPage}`);

  if (!parentForDeleteBtn) {
    console.error('Parent container not found');
    return;
  }

  parentForDeleteBtn.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;

    const deleteBtn = target.closest('.btn-delete');

    if (deleteBtn) {
      event.preventDefault();

      const idCarString = deleteBtn.getAttribute('dat-car-id');
      const idCarNumber = Number(idCarString);

      if (isNaN(idCarNumber)) {
        console.error('Invalid car ID:', idCarString);
        return;
      }
      const carForDelete = document.getElementById(`car-${idCarNumber}`);

      if (carForDelete) {
        updateCarsState(0, 1);
        carForDelete.remove();
      }

      try {
        await deleteCar(idCarNumber);
      } catch {
        console.error(`Failed to delete car ${idCarNumber} with error`);
      }
    }
  });
}

export async function deleteAllWinners() {
  const data = await getWinners();
  data.data.forEach((elem) => {
    deleteWinners(elem.id);
    const tbodyWinners = document.getElementById('winners-body');
    if (tbodyWinners) tbodyWinners.innerHTML = '';
  });
}
