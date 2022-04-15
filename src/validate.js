import * as yup from 'yup';

export default (link, state) => {
  const feedsLinks = state.feeds.map(({ feedLink }) => feedLink);
  console.log(feedsLinks);
  const schema = yup.string().url().notOneOf(feedsLinks).required();
  return schema.validate(link, { abortEarly: false })
    .then(() => '').catch((e) => {
      if (e.message === 'this must be a valid URL') {
        throw new Error('invalidUrl');
      }
      throw new Error('duplicateUrl');
    });
};
