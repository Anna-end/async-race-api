import { CarWithStats } from './types';
import { generateCarImage } from './utils';

export function createAppContainer(): void {
  const container = document.createElement('div');
  const app = document.getElementById('app');
  container.className = 'async-race-app';

  container.innerHTML = `
    <header>
      <h1 class="header">🏎️ Async Race</h1>
      <nav>
        <button id="garage-btn" class="nav_btn active">🚗 Garage</button>
        <button id="winners-btn" class="nav_btn">🏆 Winners</button>
      </nav>

    </header>
    <section class="controls">
      <div class="car_form">
        <h3>✏️ Create/Update Car</h3>
        <div class="form_group">
          <input type="text" id="car-name" placeholder="Enter car name" class="form-input" />
          <input type="color" id="car-color" value="#3c0909" class="form-color" />
        </div>
        <div class="form-buttons">
          <button id="create-btn" class="btn btn-primary">Create</button>
          <button id="create-random-btn" class="btn btn-primary">Create random</button>
          <button id="update-btn" class="btn btn-secondary">Update</button>
        </div>
      </div>
      
      <div class="race_controls">
        <h3>🏁 Race Controls</h3>
        <div class="race-buttons">
          <button id="race-btn" class="btn btn-success">Start Race</button>
          <button id="reset-btn" class="btn btn-warning">Reset Race</button>
          <button id="generate-btn" class="btn btn-info">Generate 100 Cars</button>
          <button id="deleteAll-btn" class="btn btn-del">Delete all cars</button>
        </div>
      </div>
    </section>

    <main id="main-content">

    </main>

  `;

  app?.append(container);
}

export function createGarageUI(): void {
  const main = document.getElementById('main-content');

  const garageSection = document.createElement('section');
  garageSection.classList.add('garage_section');
  garageSection.id = 'garage';

  garageSection.innerHTML = `
      <h2 class="garageTitle">🚗 Garage <span id="CarInGarage"></span></h2>
       <div class="pagination">
          <button id="prev-page" class="pagination-btn" >
            ◀ Previous
          </button>
          <span class="page-info">Page: 1 / 1</span>
          <button id="next-page" class="pagination-btn" >
            Next ▶
          </button>
        </div>
      <div class="garage-container">
        
      </div>

  `;
  main?.append(garageSection);
}

export function createCarItemUI(car: CarWithStats): HTMLDivElement {
  const carItem = document.createElement('div');
  carItem.className = 'car-item';
  carItem.id = `car-${car.id}`;

  carItem.innerHTML = `
    <div class="car-header">
      <div class="car-info">
        <span class="car-name">${car.name}</span>
        <span class="car-id">ID:${car.id}</span>
      </div>
      <div class="car-actions">
        <button class="btn btn-sm btn-delete" data-car-id="${car.id}">&#128465</button>
      </div>
    </div>
    
    <div class="car-track">
      
      
      <div class="car-on-track">
        <div class="car-image-container" id="car-image-${car.id}">
          ${generateCarImage(car.color, 45)}
        </div>
         <div class="track-end" id="track-id=${car.id}" >&#127919;</div>
      </div>
      
     
    </div>
    
    <div class="car-controls">
      <button class="btn btn-sm btn-start" data="start" data-car-id="${car.id}" 'disabled'}>
        &#127937;
      </button>
    </div>
  `;

  return carItem;
}

export function createWinnersUI(): HTMLDivElement {
  const main = document.getElementById('main-content');
  const winnersSection = document.createElement('div');
  winnersSection.className = 'winners-section';

  winnersSection.innerHTML = `
    <section id="winners" class="winners hidden">
      <h2>🏆 Winners</h2>
      <div class="winners-table-container">
       <button id="sort-time" class="btn btn-primary">Sort time</button>
        <button id="sort-id" class="btn btn-primary">Sort id</button>
        <button id="delete-winners" class="btn btn-primary">Delete all winners</button>
        <table class="winners-table">
          <thead>
            <tr class="table_head">
              <th>#</th>
              <th>Car</th>
              <th>Name</th>
              <th class="sortable" data-sort="wins">Wins</th>
              <th class="sortable" data-sort="time">Best Time</th>
            </tr>
          </thead>
          <tbody id="winners-body">
            <tr>

            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
  main?.append(winnersSection);
  return winnersSection;
}
