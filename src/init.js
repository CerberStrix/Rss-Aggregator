import onChange from 'on-change';
import i18next from 'i18next';
import init from './controller.js';
import ru from './locales/ru.js';

import {
  formRender, postsRender, feedsRender, UIRender,
} from './view.js';

const runApp = () => {
  const defaultLanguage = 'ru';
  const state = {
    lng: defaultLanguage,
    rssForm: {
      state: null,
    },
    feeds: [],
    posts: [],
    uiState: {
      shownPosts: [],
    },
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: state.lng,
    debug: false,
    resources: {
      ru,
    },
  });

  const rssInputElement = document.getElementById('url-input');

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rssForm.state':
        formRender(value, i18nInstance, rssInputElement);
        break;
      case 'feeds':
        feedsRender(state);
        break;
      case 'posts':
        postsRender(state, i18nInstance, watchedState);
        UIRender(state);
        break;
      case 'uiState.shownPosts':
        UIRender(state);
        break;
      default:
    }
  });

  init(state, watchedState);
};

export default runApp;
