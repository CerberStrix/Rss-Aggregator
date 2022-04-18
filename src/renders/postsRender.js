const renderModal = (title, link, description) => {
  const modal = document.querySelector('#exampleModal');
  const modalTitle = modal.querySelector('#exampleModalLabel');
  const modalDiscription = modal.querySelector('.modal-body');
  const button = modal.querySelector('.btn-primary');
  button.href = link;
  modalTitle.textContent = title;
  modalDiscription.textContent = description;
};

export default (state, i18nInstance, watchedState) => {
  const postsElement = document.querySelector('[data-container="posts"]');
  postsElement.innerHTML = '';
  const postCard = document.createElement('div');
  postCard.classList.add('card-body');
  const postTittle = document.createElement('h3');
  postTittle.textContent = 'Посты';
  postCard.append(postTittle);
  postsElement.append(postCard);

  const postUlElement = document.createElement('ul');
  state.posts
    .map(({
      link, title, postId, description,
    }) => {
      const liElement = document.createElement('li');
      liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'border-0', 'border-end-0');
      const itemTitle = document.createElement('a');
      itemTitle.dataset.id = postId;
      itemTitle.setAttribute('href', link);
      itemTitle.setAttribute('target', '_blank');
      itemTitle.textContent = title;
      liElement.append(itemTitle);
      const buttonEl = document.createElement('button');
      buttonEl.setAttribute('type', 'button');
      buttonEl.dataset.id = postId;
      buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      buttonEl.dataset.bsToggle = 'modal';
      buttonEl.dataset.bsTarget = '#exampleModal';
      buttonEl.textContent = i18nInstance.t('view');
      liElement.append(buttonEl);
      postUlElement.append(liElement);

      itemTitle.addEventListener('click', (e) => {
        if (!state.uiState.shownPosts.includes(e.target.dataset.id)) {
          watchedState.uiState.shownPosts.push(e.target.dataset.id);
        }
      });

      buttonEl.addEventListener('click', (e) => {
        renderModal(title, link, description);
        if (!state.uiState.shownPosts.includes(e.target.dataset.id)) {
          watchedState.uiState.shownPosts.push(e.target.dataset.id);
        }
      });
      return true;
    });

  postsElement.append(postUlElement);
};
