export default (rss) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rss)}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    console.log('Ошибка с запросом');
    throw new Error('netWorkError');
  })
  .then((data) => {
    console.log('Запрос прошел');
    const xmlString = data.contents;
    return xmlString;
  });
