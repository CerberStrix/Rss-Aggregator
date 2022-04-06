import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js'
import render from './render.js';
import feedsRender from './feedsRender.js';


const runApp = () => {
    const defaultLanguage = 'ru';
    const state = {
        lng: defaultLanguage,
        rssForm: {
            valid: true,
            feeds: [],
            error: null,
        }
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
        render(path, value, i18nInstance);
        feedsRender(state);
    })

    const formElement = document.querySelector('.rss-form');
    const formEl = document.querySelector('#rss-link');
    formEl.focus();

    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rss = formData.get('rss')
        formElement.reset();
        const schema = yup.string().required().url();
        const validatePromise = schema.isValid(rss)
        validatePromise
        .then((data) => {
            if (data === true) {
                if (watchedState.rssForm.feeds.includes(rss)) {
                    watchedState.rssForm.valid = 'link already has';
                    
                } else {
                    state.rssForm.feeds.push(rss)
                    watchedState.rssForm.valid = 'correct link';
                }
            } else {
                watchedState.rssForm.valid = 'invalid link';
                
            }
        })
    })
};

export { runApp };