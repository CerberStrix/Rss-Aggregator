export default (state) => {
  const feedElement = document.querySelector('[data-container="feeds"]');
  feedElement.innerHTML = '';
  const feedCard = document.createElement('div');
  feedCard.classList.add('card-body');
  const feedTittle = document.createElement('h3');
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
    return true;
  });
  feedElement.append(ulElement);
};
