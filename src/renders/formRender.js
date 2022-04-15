export default (value, i18nInstance) => {
  if (document.querySelector('[data-toggle="feedbackText"]')) {
    document.querySelector('[data-toggle="feedbackText"]').remove();
  }

  const rssInputElement = document.querySelector('#rss-link');
  rssInputElement.classList.remove('is-invalid');

  const containerForFeedBack = document.querySelector('[data-container="rss-link"]');
  const progressNotification = document.createElement('p');
  progressNotification.dataset.toggle = 'feedbackText';

  switch (value) {
    case 'successLoad':
      console.log('Отработал положительный сценарий');
      progressNotification.classList.remove('text-danger');
      progressNotification.classList.add('text-success');
      progressNotification.textContent = i18nInstance.t(value);
      containerForFeedBack.append(progressNotification);
      break;
    case 'duplicateUrl':
      progressNotification.classList.add('text-danger');
      rssInputElement.classList.add('is-invalid');
      progressNotification.textContent = i18nInstance.t(value);
      containerForFeedBack.append(progressNotification);
      break;
    case 'invalidUrl':
      progressNotification.classList.add('text-danger');
      rssInputElement.classList.add('is-invalid');
      progressNotification.textContent = i18nInstance.t(value);
      containerForFeedBack.append(progressNotification);
      break;
    case 'parsingError':
      progressNotification.classList.add('text-danger');
      rssInputElement.classList.add('is-invalid');
      progressNotification.textContent = i18nInstance.t(value);
      containerForFeedBack.append(progressNotification);
      break;
    case 'netWorkError':
      progressNotification.classList.add('text-danger');
      rssInputElement.classList.add('is-invalid');
      progressNotification.textContent = i18nInstance.t(value);
      containerForFeedBack.append(progressNotification);
      break;
    default:
      console.log(`Sorry, we are out of ${value}.`);
  }
};
