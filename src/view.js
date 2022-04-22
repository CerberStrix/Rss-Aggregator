const feedsRender = (state) => {
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

const formRender = (value, selectors, i18nInstance) => {
  const elements = selectors;
  elements.inputElement.classList.remove('is-invalid');
  elements.notificationElement.classList.add('text-danger');
  elements.inputElement.classList.add('is-invalid');

  switch (value) {
    case 'successLoad':
      elements.notificationElement.classList.remove('text-danger');
      elements.notificationElement.classList.add('text-success');
      elements.inputElement.classList.remove('is-invalid');
      elements.notificationElement.textContent = i18nInstance.t(value);
      break;
    case 'duplicateUrl':
      elements.notificationElement.textContent = i18nInstance.t(value);
      break;
    case 'invalidUrl':
      elements.notificationElement.textContent = i18nInstance.t(value);
      break;
    case 'parsingError':
      elements.notificationElement.textContent = i18nInstance.t(value);
      break;
    case 'netWorkError':
      elements.notificationElement.textContent = i18nInstance.t(value);
      break;
    case 'emptyUrl':
      elements.notificationElement.textContent = i18nInstance.t(value);
      break;
    default:
      break;
  }
};

const renderModal = (title, link, description) => {
  const modal = document.querySelector('#exampleModal');
  const modalTitle = modal.querySelector('#exampleModalLabel');
  const modalDiscription = modal.querySelector('.modal-body');
  const button = modal.querySelector('.btn-primary');
  button.href = link;
  modalTitle.textContent = title;
  modalDiscription.textContent = description;
};

const postsRender = (state, i18nInstance, watchedState) => {
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

const UIRender = (state) => {
  const anchors = document.querySelectorAll('a');
  anchors.forEach((anchor) => {
    if (state.uiState.shownPosts.includes(anchor.dataset.id)) {
      anchor.classList.remove('fw-bold');
      anchor.classList.add('fw-normal');
      anchor.classList.add('link-secondary');
    } else {
      anchor.classList.remove('fw-normal');
      anchor.classList.add('fw-bold');
      anchor.classList.remove('link-secondary');
    }
  });
};

export {
  formRender, postsRender, feedsRender, renderModal, UIRender,
};
