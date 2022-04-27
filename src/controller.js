import uniqueId from 'lodash/uniqueId.js';
import getParse from './rssParser.js';
import validate from './validate.js';
import getResponse from './getResponse.js';

const updateFeed = (link, state, watchedState) => {
  const watched = watchedState;
  return getResponse(link)
    .then((data) => getParse(data))
    .then(({ feedTitle, feedDescription, posts }) => {
      const newfeedId = uniqueId();
      const feedsLinks = state.feeds.map(({ feedLink }) => feedLink);
      if (!feedsLinks.includes(link)) {
        watched.feeds.unshift({
          feedId: newfeedId, feedLink: link, feedTitle, feedDescription,
        });
      }
      const currentFeedId = state.feeds
        .filter(({ feedLink }) => feedLink === link)
        .map(({ feedId }) => feedId)
        .pop();
      const oldPosts = state.posts
        .filter(({ feedId }) => feedId === currentFeedId)
        .map(({ postlink }) => postlink);
      const newPosts = posts
        .filter(({ postlink }) => !oldPosts.includes(postlink))
        .map(({ title, description, postlink }) => {
          const newPostId = uniqueId();
          return {
            feedId: currentFeedId, postId: newPostId, title, description, postlink,
          };
        });
      watched.posts.unshift(...newPosts);
      setTimeout(updateFeed, 5000, link, state, watchedState);
    });
};

export default (state, watchedState, selectors) => {
  const elements = selectors;
  const watched = watchedState;
  elements.inputElement.focus();

  elements.formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rss = formData.get('url');

    watched.rssForm.inputStatus = 'blocked';

    validate(rss, state)
      .then(() => updateFeed(rss, state, watchedState))
      .then(() => {
        watched.rssForm.inputStatus = 'unblocked';
        watched.rssForm.state = 'successLoad';
        watched.rssForm.errors = null;
      })
      .catch((error) => {
        watched.rssForm.inputStatus = 'unblocked';
        watched.rssForm.state = 'unsuccessfulLoad';
        watched.rssForm.errors = error.message;
      });
  });
};
