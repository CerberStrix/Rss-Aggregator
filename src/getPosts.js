import uniqueId from 'lodash/uniqueId.js';

export default (feedId, data) => {
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
