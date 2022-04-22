import onChange from 'on-change';
import i18next from 'i18next';
import controller from './controller.js';
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

  const selectors = {
    inputElement: document.querySelector('#url-input'),
    notificationElement: document.querySelector('[data-toggle="feedbackText"]'),
    feedContainer: document.querySelector('[data-container="feeds"]'),
    postsContainer: document.querySelector('[data-container="posts"]'),
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rssForm.state':
        formRender(value, selectors, i18nInstance);
        break;
      case 'feeds':
        feedsRender(state, selectors);
        break;
      case 'posts':
        postsRender(state, i18nInstance, watchedState, selectors);
        UIRender(state);
        break;
      case 'uiState.shownPosts':
        UIRender(state);
        break;
      default:
    }
  });

  controller(state, watchedState);
};

export default runApp;
