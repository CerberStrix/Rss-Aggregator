import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js';
import validate from './validate.js';
import rssParser from './rssParser.js';
import formRender from './renders/formRender.js';
import feedsRender from './renders/feedsRender.js';
import postsRender from './renders/postsRender.js';
import getResponse from './getResponse.js';
import getFeed from './getFeed.js';
import getPosts from './getPosts.js';
import updatePosts from './updatePosts.js';
import uiRender from './renders/uiRender.js';

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

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rssForm.state':
        formRender(value, i18nInstance);
        break;
      case 'feeds':
        feedsRender(state);
        break;
      case 'posts':
        console.log(state.posts);
        postsRender(state, i18nInstance, watchedState);
        uiRender(state);
        break;
      case 'uiState.shownPosts':
        uiRender(state);
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
      .then(() => getResponse(rss))
      .then((xmlString) => rssParser(xmlString))
      .then((document) => {
        console.log('Получили документ');
        const [feedId, feed] = getFeed(rss, document);
        watchedState.feeds.unshift(feed);
        const posts = getPosts(feedId, document);
        watchedState.posts.unshift(...posts);
        console.log(state);
      })
      .then(() => {
        console.log('Меняем стейт');
        watchedState.rssForm.state = 'successLoad';
        updatePosts(state, watchedState);
      })
      .catch((error) => {
        watchedState.rssForm.state = error.message;
        console.log(`Поймали ошибку ${error.message}`);
      });
  });
};

export default runApp;
