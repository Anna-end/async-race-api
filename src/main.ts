const API_BASE_URL = 'http://127.0.0.1:3000';
const GARAGE_URL = `${API_BASE_URL}/garage`;
async function createCar(name: string, color: string) {
  try {
    const response = await fetch(GARAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        color: color,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const newCar = await response.json();
    console.log('Создана новая машина:', newCar);
    return newCar;
  } catch (error) {
    console.error('Ошибка при создании машины:', error);
    return null;
  }
}
createCar('BMW', 'red');
