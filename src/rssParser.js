export default (xmlString) => {
  console.log('начинаем парсить');
  const parser = new DOMParser();
  const data = parser.parseFromString(xmlString, 'text/xml');
  if (data.querySelector('parsererror') === null) {
    return data;
  }
  throw new Error('parsingError');
};
