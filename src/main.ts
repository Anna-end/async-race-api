import { createAppContainer, createGarageUI, createWinnersUI } from './ui';
import { updatePaginatorContainer } from './paginator/paginator';
import { resetRase, deleteAllWinners } from './deleteLogic/deleteBtn';
import { setState } from './sate/appState';
import { createPageWithCars } from './creatorCar/creatorCar';
import { adjustLogicNextPageBtn, adjustLogicPrevPageBtn } from './paginator/paginator';
import { createOneElemCarWithDataInput, createRandomCars } from './creatorCar/creatorCar';
import { drive, startAllSelectedCars, resetRace } from './driveControl';
import { getAllWinners, createTableWinners } from './winners/winnersControl';
import { checkCarsOnServer, displayNumberCars } from './utils';

createAppContainer();

async function init() {
  //настройка первого показа игры:
  //загрузка данных с сервера и отображение их на игровом поле

  const countCar = await checkCarsOnServer();
  if (countCar) {
    const cars = countCar.length;
    setState({ totalCars: cars, garagePage: 1 });
  }

  createGarageUI();
  displayNumberCars();

  await createPageWithCars(1);

  adjustLogicNextPageBtn();
  adjustLogicPrevPageBtn();
  updatePaginatorContainer(1);
  createWinnersUI();

  // настройка обработчиков событий на кнопки добавления машин

  const createOneCarBtn = document.getElementById('create-btn');
  if (createOneCarBtn) {
    createOneCarBtn.addEventListener('click', async () => {
      const isRightRequest = await createOneElemCarWithDataInput();
      if (!isRightRequest) {
        return;
      }
      displayNumberCars();
    });
  }

  const createBtnHundredCars = document.getElementById('generate-btn');
  if (createBtnHundredCars) {
    createBtnHundredCars.addEventListener('click', async () => {
      const isRightRequest = await createRandomCars(100);
      if (isRightRequest) {
        displayNumberCars();
      }
    });
  }

  const createBtnRandomCar = document.getElementById('create-random-btn');
  if (createBtnRandomCar) {
    createBtnRandomCar.addEventListener('click', async () => {
      const isRightRequest = await createRandomCars(1);
      if (isRightRequest) {
        displayNumberCars();
      }
    });
  }
  // Удаление всех машин
  const deleteCarsBtn = document.getElementById('deleteAll-btn');
  if (deleteCarsBtn) {
    deleteCarsBtn.addEventListener('click', async () => {
      await resetRase();
    });
  }
  // Кнопки которые отвечают за движение машин
  const startOneCarBtn = document.querySelectorAll('.btn-start');
  startOneCarBtn.forEach((elem) => {
    elem.addEventListener('click', async () => {
      const id = elem.getAttribute('data-car-id');
      if (id) await drive(id);
    });
  });
  const startAllCarBtn = document.getElementById('race-btn');
  if (startAllCarBtn) {
    startAllCarBtn.addEventListener('click', async () => {
      startAllSelectedCars();
    });
  }
  // Кнопки переключатели между гаражом и списком победивших
  const winnersBtn = document.getElementById('winners-btn');
  winnersBtn?.addEventListener('click', async () => {
    const garagePage = document.getElementById('garage');
    const controls = document.querySelector('.controls');
    if (garagePage && controls) {
      garagePage.style.display = 'none';
      controls.classList.add('none');
    }
    const winnersPage = document.getElementById('winners');
    if (winnersPage) winnersPage.style.display = 'block';
    await getAllWinners();
    await createTableWinners(1, 7, 'time', 'ASC');
  });

  const garageBtn = document.getElementById('garage-btn');
  garageBtn?.addEventListener('click', () => {
    const garagePage = document.getElementById('garage');
    const controls = document.querySelector('.controls');
    if (garagePage && controls) {
      garagePage.style.display = 'block';
      controls.classList.remove('none');
    }
    const winnersPage = document.getElementById('winners');
    if (winnersPage) winnersPage.style.display = 'none';
  });

  const resetBtnWinners = document.getElementById('reset-btn');
  resetBtnWinners?.addEventListener('click', () => {
    console.log('click');
    resetRace();
  });

  const btnDeleteWinners = document.getElementById('delete-winners');
  btnDeleteWinners?.addEventListener('click', async () => {
    deleteAllWinners();
  });

  const btSortTime = document.getElementById('sort-time');
  btSortTime?.addEventListener('click', async () => {
    await createTableWinners(1, 10, 'time', 'ASC');
  });
  const btnSortID = document.getElementById('sort-id');
  btnSortID?.addEventListener('click', async () => {
    await createTableWinners(1, 10, 'id', 'ASC');
  });
}
init();
