import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js';
import validate from './validate.js';
import rssParser from './rssParser.js';
import formRender from './formRender.js';
import contentRender from './contentRender.js';

const runApp = () => {
  const defaultLanguage = 'ru';
  const state = {
    lng: defaultLanguage,
    rssForm: {
      state: null,
    },
    feeds: [],
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: state.lng,
    debug: false,
    resources: {
      ru,
    },
  });

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rssForm.state':
        formRender(value, i18nInstance);
        break;
      case 'feeds':
        contentRender(state);
        break;
      default:
    }
  });

  const formElement = document.querySelector('.rss-form');
  const formEl = document.querySelector('#rss-link');
  formEl.focus();

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rss = formData.get('rss');
    formElement.reset();
    formEl.focus();
    validate(rss, state)
      .then((data) => {
        if (data !== '') {
          throw new Error(`${data}`);
        }
      })
      .then(() => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rss)}`))
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('netWorkError');
      })
      .then((data) => {
        console.log('Запрос прошел');
        const xmlString = data.contents;
        console.log(data.contents);
        return xmlString;
      })
      .then((xmlString) => {
        console.log('Начинаем парсить');
        return rssParser(rss, xmlString);
      })
      .then((data) => {
        console.log('Меняем стейт');
        watchedState.rssForm.state = 'successLoad';
        watchedState.feeds.push(data);
      })
      .catch((error) => {
        watchedState.rssForm.state = error.message;
        console.log(`Поймали ошибку ${error.message}`);
      });
  });
};

export default runApp;
