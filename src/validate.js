import * as yup from 'yup';

export default (link, state) => {
    const feedsNames = state.feeds.map(({ feedLink }) => feedLink)
    console.log(feedsNames)
    const schema = yup.string().url().notOneOf(feedsNames).required();
        return schema.validate(link, { abortEarly: false })
        .then(() => '').catch((e) => {
            if (e.message === 'this must be a valid URL') {
              return 'invalidUrl';
            }
            return 'duplicateUrl';
          });
};