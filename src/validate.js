import * as yup from 'yup';

export default (link, state) => {
  const feedsLinks = state.feeds.map(({ feedLink }) => feedLink);
  console.log(feedsLinks);
  const schema = yup.string().url().notOneOf(feedsLinks).required();
  return schema.validate(link, { abortEarly: false })
    .then(() => '').catch((e) => {
      console.log(e.message);
      switch (e.message) {
        case 'this is a required field':
          throw new Error('emptyUrl');
        case 'this must be a valid URL':
          throw new Error('invalidUrl');
        default:
          throw new Error('duplicateUrl');
      }
    });
};
