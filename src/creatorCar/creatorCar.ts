import { Car } from '../types';
import { createCar } from '../api';
import { getState } from '../sate/appState';
import { createCarItemUI } from '../ui';
import { updatePaginatorContainer } from '../paginator/paginator';
import { getCars } from '../api';
import { setupDeleteHandler } from '../deleteLogic/deleteBtn';
import { updateCarsState } from '../sate/appState';

export async function createRandomCars(carNum: number) {
  const createdCars = generateRandomCars(carNum);

  try {
    const promises = createdCars.map(async (elem) => {
      const car = await createCar(elem);
      addCarInProject(car);
    });

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
}

export async function createPageWithCars(page: number, limit: number = 7) {
  const newPage = document.createElement('div');
  const garage = document.querySelector('.garage-container');
  garage?.appendChild(newPage);
  if (newPage) newPage.id = `page-${page}`;

  try {
    const CarsNewPageRequest = await getCars({ _page: page, _limit: limit });
    CarsNewPageRequest.data.forEach((car) => {
      const elem = createCarItemUI(car);
      newPage.append(elem);
    });
  } catch {
    console.log('no data cars');
  }
  setupDeleteHandler();
}

export async function createOneElemCarWithDataInput() {
  const data = checkInputName();
  if (data.isValid === false) {
    return false;
  }
  try {
    const carInDataBase = await createCar({ name: data.name, color: data.color });
    addCarInProject(carInDataBase);
    return true;
  } catch {
    throw new Error('Didn`t get the chance to create a car');
  }
}

export function generateRandomCar(): Omit<Car, 'id'> {
  const brands = [
    'Tesla',
    'Ford',
    'BMW',
    'Audi',
    'Mercedes',
    'Toyota',
    'Honda',
    'Porsche',
    'Ferrari',
    'Lamborghini',
  ];

  const models = [
    'Model S',
    'Mustang',
    'M3',
    'A4',
    'C-Class',
    'Camry',
    'Civic',
    '911',
    'F8',
    'Aventador',
  ];

  const randomBrand = brands[Math.floor(Math.random() * brands.length)];
  const randomModel = models[Math.floor(Math.random() * models.length)];

  const randomColor = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;

  return {
    name: `${randomBrand} ${randomModel}`,
    color: randomColor,
  };
}

export function generateRandomCars(count: number): Omit<Car, 'id'>[] {
  const cars: Omit<Car, 'id'>[] = [];

  for (let i = 0; i < count; i++) {
    cars.push(generateRandomCar());
  }

  return cars;
}

function addCarInProject(data: Car) {
  const currentPage = getState().garagePage;
  const elementCurrentPage = document.getElementById(`page-${currentPage}`);

  const controlCar = checkCarOnList();
  if (controlCar === true) {
    const elem = createCarItemUI(data);
    elementCurrentPage?.append(elem);
  }
  updateCarsState(0, 1);
  updatePaginatorContainer(currentPage);
}

export function checkInputName(): { name: string; color: string; isValid: boolean } {
  const carName = document.getElementById('car-name') as HTMLInputElement;
  const name = carName.value.trim();
  const carColor = document.getElementById('car-color') as HTMLInputElement;
  const color = carColor.value;

  carName.style.borderColor = '';
  carName.placeholder = 'Enter car name';

  if (!name) {
    carName.style.borderColor = 'red';
    carName.placeholder = 'Car name is required!';
    setTimeout(() => {
      carName.style.borderColor = '';
      carName.placeholder = 'Enter car name';
    }, 1000);
    return {
      isValid: false,
      name: '',
      color: '',
    };
  }

  carName.style.borderColor = 'green';
  return {
    name,
    color,
    isValid: true,
  };
}

function checkCarOnList() {
  const currentState = getState();
  const currentPage = document.getElementById(`page-${currentState.garagePage}`);
  if (currentPage) {
    const carsElementOnPage = currentPage.children;
    let countCar = 0;
    for (let i = 0; i <= carsElementOnPage.length; i++) {
      countCar += 1;
    }
    if (countCar <= 7) {
      return true;
    }
  }
}
