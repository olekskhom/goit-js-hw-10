// Імпорт модулів та бібліотек
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

// Оголошення об'єкта, який містить посилання на DOM-елементи
const elements = {
  breedSelect: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

// Розгортання об'єкта elements на окремі змінні для зручності використання
const { breedSelect, catInfo, loader, error } = elements;

// Приховання деяких елементів на початку
breedSelect.classList.add('is-hidden');
error.classList.add('is-hidden');
catInfo.classList.add('is-hidden');

// Отримання і відображення списку порід котів
fetchBreeds()
  .then(({ data }) => {
    let breedsArray = [];
    data.forEach(cat => {
      breedSelect.classList.remove('is-hidden');
      loader.classList.add('is-hidden');
      error.classList.add('is-hidden');
      breedsArray.push({ value: cat.id, text: cat.name });
    });
    new SlimSelect({
      select: breedSelect,
      data: breedsArray,
      settings: {
        allowDeselect: true,
      },
    });
  })
  .catch(errorHandler);

// Додання обробника події "change" до вибору породи кота
breedSelect.addEventListener('change', catHandler);

// Функція-обробник події "change" для вибору породи кота
function catHandler(e) {
  loader.classList.remove('is-hidden');
  catInfo.classList.add('is-hidden');

  const breedId = e.currentTarget.value;  // отримання обраного значення породи

  // Отримання і відображення інформації про кота обраної породи
  fetchCatByBreed(breedId)
    .then(({ data }) => {
      loader.classList.add('is-hidden');
      catInfo.classList.remove('is-hidden');

      const { url, breeds } = data[0];  // отримання URL зображення кота та інформації про породу
      renderCatInfo(url, breeds);  // відображення інформації про кота
    })
    .catch(errorHandler);
}

// Функція для відображення інформації про кота
function renderCatInfo(url, breeds) {
  catInfo.innerHTML = `<img src="${url}" alt="${breeds[0].name}" width="400">
    <div class="wrapper-text"><h1 class="">${breeds[0].name} (${breeds[0].country_code})</h1>
    <p class="">${breeds[0].description}</p></div>`;
}

// Функція для обробки помилок
function errorHandler(err) {
  loader.classList.add('is-hidden');
  error.classList.remove('is-hidden');
  catInfo.classList.add('is-hidden');

  // Виведення сповіщення про помилку за допомогою Notiflix
  Notiflix.Notify.failure(`${error.textContent}`, {
    position: 'center-center',
  });
}
