export default (state) => {
  const feedElement = document.querySelector('[data-container="feeds"]');
  const postsElement = document.querySelector('[data-container="posts"]');

  feedElement.innerHTML = '';
  postsElement.innerHTML = '';

  const feedCard = document.createElement('div');
  feedCard.classList.add('card-body');
  const feedTittle = document.createElement('h2');
  feedTittle.textContent = 'Фиды';
  feedCard.append(feedTittle);
  feedElement.append(feedCard);

  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group');
  ulElement.classList.add('border-0');
  ulElement.classList.add('rounded-0');
  state.feeds.map(({ feedTitle, feedDescription }) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item');
    const itemTitle = document.createElement('h6');
    itemTitle.textContent = feedTitle;
    const itemDescription = document.createElement('p');
    itemDescription.classList.add('small');
    itemDescription.classList.add('text-black-50');
    itemDescription.textContent = feedDescription;
    liElement.append(itemTitle);
    liElement.append(itemDescription);
    ulElement.append(liElement);
  });
  feedElement.append(ulElement);

  const postCard = document.createElement('div');
  postCard.classList.add('card-body');
  const postTittle = document.createElement('h2');
  postTittle.textContent = 'Посты';
  postCard.append(postTittle);
  postsElement.append(postCard);

  const postUlElement = document.createElement('ul');
  postUlElement.classList.add('list-group');
  postUlElement.classList.add('border-0');
  postUlElement.classList.add('rounded-0');
  const posts = state.feeds
    .map(({ posts }) => posts).flat()
    .map(({ description, link, title }) => {
      const liElement = document.createElement('li');
      liElement.classList.add('list-group-item');
      const itemTitle = document.createElement('a');
      itemTitle.classList.add('fw-bold');
      itemTitle.setAttribute('href', link);
      itemTitle.textContent = title;
      liElement.append(itemTitle);
      postUlElement.append(liElement);
    });

  postsElement.append(postUlElement);
};
