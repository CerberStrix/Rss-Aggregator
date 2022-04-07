export default (rss, xmlString) => {
    const parser = new DOMParser();
    const data = parser.parseFromString(xmlString, 'text/xml');
    if (data.querySelector('parsererror') === null) {
        const feedTitle = data.querySelector('title').textContent;
        const feedDescription = data.querySelector('description').textContent;
        const items = data.querySelectorAll('item')
        const postsArray = Array.from(items)
        const posts = postsArray.map((post) => {
            const title = post.querySelector('title').textContent;
            const description = post.querySelector('description').textContent;
            const link = post.querySelector('link').textContent;
            return {
                title,
                description,
                link
            }
        })
        return {
            feedTitle,
            feedDescription,
            feedLink: rss,
            posts,
        };
    } else {
        throw new Error('Parsing Error')
    }
};


