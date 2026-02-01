import { getState, setState } from '../sate/appState';
import { createPageWithCars } from '../creatorCar/creatorCar';

export function getPaginatorNumber() {
  const currentState = getState();

  const pages = Math.ceil(currentState.totalCars / currentState.carsPerPage);
  return pages;
}

export function adjustLogicNextPageBtn() {
  const nextPageButton = document.getElementById('next-page') as HTMLButtonElement;

  nextPageButton?.addEventListener('click', async () => {
    const currentStatePage = getState().garagePage;
    const carsList = document.getElementById(`page-${currentStatePage}`);
    if (carsList) carsList.style.display = 'none';

    const nextPage = currentStatePage + 1;

    const carsListNext = document.getElementById(`page-${nextPage}`);
    if (carsListNext) {
      carsListNext.style.display = 'block';
      updatePaginatorContainer(nextPage);
      setState({ garagePage: nextPage });
      return;
    }
    await createPageWithCars(nextPage);
    updatePaginatorContainer(nextPage);
    setState({ garagePage: nextPage });
  });
}

export function adjustLogicPrevPageBtn() {
  const prevPageButton = document.getElementById('prev-page') as HTMLButtonElement;

  prevPageButton?.addEventListener('click', () => {
    const currentStatePage = getState().garagePage;
    const carsList = document.getElementById(`page-${currentStatePage}`);
    const carsListPrev = document.getElementById(`page-${currentStatePage - 1}`);

    if (carsList) carsList.style.display = 'none';
    if (carsListPrev) carsListPrev.style.display = 'block';

    const page = currentStatePage - 1;
    updatePaginatorContainer(page);
    setState({ garagePage: page });
  });
}

export function updatePaginatorContainer(updatePage: number) {
  const pagePaginatorInfo = document.querySelector('.page-info');
  const nextPageButton = document.getElementById('next-page') as HTMLButtonElement;
  const prevPageButton = document.getElementById('prev-page') as HTMLButtonElement;
  const allPaginatorNum = getPaginatorNumber();

  if (pagePaginatorInfo) pagePaginatorInfo.textContent = `Page: ${updatePage}/ ${allPaginatorNum}`;

  if (updatePage === allPaginatorNum) {
    nextPageButton.disabled = true;
  }
  if (updatePage < allPaginatorNum) {
    nextPageButton.disabled = false;
  }

  if (updatePage === 1) {
    prevPageButton.disabled = true;
  }
  if (updatePage > 1) {
    prevPageButton.disabled = false;
  }
}
