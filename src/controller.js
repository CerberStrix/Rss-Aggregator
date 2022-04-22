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
      setTimeout(updatePosts, 5000, state, watchedState);
    });
};

const blockingInterface = (selectors) => {
  const elements = selectors;
  elements.submitButton.disabled = true;
  elements.inputElement.setAttribute('readonly', 'true');
};

const unblockingInterface = (selectors) => {
  const elements = selectors;
  elements.submitButton.disabled = false;
  elements.inputElement.removeAttribute('readonly');
};
export default (state, watchedState, selectors) => {
  const elements = selectors;
  const watched = watchedState;
  elements.inputElement.focus();

  elements.formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target);
    const formData = new FormData(e.target);
    const rss = formData.get('url');

    blockingInterface(selectors);

    validate(rss, state)
      .then(() => getResponse(rss))
      .then((xmlString) => rssParser(xmlString))
      .then((document) => {
        const [feedId, feed] = getFeed(rss, document);
        watched.feeds.unshift(feed);
        const posts = getPosts(feedId, document);
        watched.posts.unshift(...posts);
      })
      .then(() => {
        elements.inputElement.value = '';
        elements.inputElement.focus();
        unblockingInterface(selectors);
        watched.rssForm.state = 'successLoad';
        updatePosts(state, watched);
      })
      .catch((error) => {
        unblockingInterface(selectors);
        elements.inputElement.focus();
        watched.rssForm.state = error.message;
      });
  });
};
