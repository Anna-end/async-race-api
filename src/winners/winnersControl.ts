import { updateWinnerState } from '../sate/appState';
import { createWinner, getCar, getWinners } from '../api';
import { generateCarImage } from '../utils';

export async function setWinners(id: number, timeData: string, wins: number) {
  try {
    const time = Number(timeData);
    updateWinnerState(0, 1);
    const winner = await createWinner({ id: id, wins: wins, time: time });

    console.log(winner);
  } catch {
    console.error('Error with winner');
  }
}

export async function getAllWinners() {
  try {
    const data = await getWinners({ _page: 1, _limit: 10 });
    console.log(data);
  } catch {
    console.error('error winners');
  }
}

export async function createTableWinners(
  page: number,
  limit: number,
  sort?: 'id' | 'wins' | 'time',
  order?: 'ASC' | 'DESC'
) {
  try {
    const data = await getWinners({ _page: page, _limit: limit, _sort: sort, _order: order });
    const tbody = document.getElementById('winners-body');

    if (!tbody) {
      console.error('Winners table body not found');
      return;
    }

    tbody.innerHTML = '';

    const winnersWithCars = await Promise.all(
      data.data.map(async (winner) => {
        const carData = await getCar(winner.id);
        return { winner, carData };
      })
    );

    winnersWithCars.forEach(({ winner, carData }) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${winner.id}</td>
        <td>${generateCarImage(carData.color)}</td>
        <td>${carData.name}</td>
        <td>${winner.wins}</td>
        <td>${winner.time}</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error creating winners table:', error);
  }
}
