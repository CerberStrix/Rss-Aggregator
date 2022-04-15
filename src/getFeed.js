import uniqueId from 'lodash/uniqueId.js';

export default (rsslink, data) => {
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
