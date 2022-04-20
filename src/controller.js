import uniqueId from 'lodash/uniqueId.js';
import rssParser from './rssParser.js';
import validate from './validate.js';
import getResponse from './getResponse.js';

const getFeed = (rsslink, data) => {
  const feedId = uniqueId();
  const feedTitle = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const feedLink = rsslink;
  return [feedId, {
    feedId,
    feedLink,
    feedTitle,
    feedDescription,
  }];
};

const getPosts = (feedId, data) => {
  const items = data.querySelectorAll('item');
  const postsArray = Array.from(items);
  return postsArray.map((post) => {
    const postId = uniqueId();
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;
    return {
      feedId,
      postId,
      title,
      description,
      link,
    };
  });
};

function updateFeedData(link, id) {
  return new Promise((resolve, reject) => {
    getResponse(link).then((responseData) => resolve([id, responseData])).catch(() => reject(new Error(`Ошибка при запросе данных фида ${link}`)));
  });
}

const updatePosts = (state, watchedState) => {
  const allNewPosts = [];
  console.log('Запускаем обновление постов');
  const stateWatch = watchedState;

  const promises = state.feeds.map(({ feedLink, feedId }) => updateFeedData(feedLink, feedId));

  const promise = Promise.all(promises);
  promise.then((data) => {
    data.map((result) => {
      const [id, responseData] = result;
      const xmlStirng = rssParser(responseData);
      const updatedPosts = getPosts(id, xmlStirng);
      const existingPostsLink = state.posts
        .filter(({ feedId }) => feedId === id)
        .map(({ link }) => link);
      const newFeedsPosts = updatedPosts.filter(({ link }) => !existingPostsLink.includes(link));
      allNewPosts.push(...newFeedsPosts);
      return true;
    });
  })
    .then(() => {
      const oldPosts = state.posts;
      stateWatch.posts = [...allNewPosts, ...oldPosts];
      setTimeout(updatePosts, 5000, state, watchedState);
    })
    .catch(() => {
      stateWatch.rssForm.state = 'netWorkError';
      setTimeout(updatePosts, 5000, state, watchedState);
    });
};

export default (state, watchedState) => {
  const watched = watchedState;
  const formElement = document.querySelector('.rss-form');
  const formEl = document.querySelector('#rss-link');
  formEl.focus();

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rss = formData.get('url');
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
        watched.rssForm.state = 'successLoad';
        updatePosts(state, watchedState);
      })
      .catch((error) => {
        watched.rssForm.state = error.message;
        console.log(`Поймали ошибку ${error.message}`);
      });
  });
};