import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js'
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
        feeds: []
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
        formRender(path, value, i18nInstance)
        contentRender(state)
    })

    const formElement = document.querySelector('.rss-form');
    const formEl = document.querySelector('#rss-link');
    formEl.focus();

    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rss = formData.get('rss')
        formElement.reset();

        validate(rss, state)
        .then((data) => {
            if (data !== '') {
                throw new Error(`${data}`)
            }
        })
        .then(() => {
            return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rss)}`)
        })
        .then((response) => {
            if (response.ok) return response.json()
            throw new Error('netWorkError')
        })
        .then((data) => {
            let xmlString = data.contents;
            return xmlString
          })
        .then((xmlString) => {
            console.log('Начинаем парсить')
            return rssParser(rss, xmlString)
        })
        .then((data) => {
            watchedState.rssForm.state = 'success';
            watchedState.feeds.push(data);
            console.log(state)
        })
        .catch((error) => {
            watchedState.rssForm.state = error.message;
            console.log('Поймали ошибку')
            console.log(state.rssForm)
        })
    })
};

export { runApp };