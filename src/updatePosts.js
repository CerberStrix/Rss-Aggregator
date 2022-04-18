import getResponse from './getResponse.js';
import rssParser from './rssParser.js';
import getPosts from './getPosts.js';

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
    .catch(() => setTimeout(updatePosts, 5000, state, watchedState));
};

export default updatePosts;
