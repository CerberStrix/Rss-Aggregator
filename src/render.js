export default (path, value, i18nInstance) => {
if (path === 'rssForm.valid') {
    const textElement = document.querySelector('.text-muted');
    if (textElement.nextElementSibling) {
        textElement.nextElementSibling.remove();
        }
    const rssElement = document.querySelector('#rss-link');
    rssElement.classList.remove('is-invalid');
    const containerForFeedBack = document.querySelector('[data-container="rss-link"]')
    const attentionTextElement = document.createElement('p');
    attentionTextElement.classList.add('text-danger');
    switch (value) {
        case 'link already has':
            rssElement.classList.add('is-invalid');
            attentionTextElement.textContent = i18nInstance.t('already_added_link');
            containerForFeedBack.append(attentionTextElement)
            return
        case 'correct link':
            if (textElement.nextElementSibling) {
                textElement.nextElementSibling.remove();
            }
            
            return
        case 'invalid link':
            rssElement.classList.add('is-invalid');
            attentionTextElement.textContent = i18nInstance.t('invalid_link');
            containerForFeedBack.append(attentionTextElement)
            return
        }
    }
}