import axios from "axios";

export default (state) => {
    const feed = state.rssForm.feeds[0]
    fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed)}`)
    .then(response => {
        if (response.ok) return response.json()
        throw new Error('Network response was not ok.')
      })
      .then((data) => {
          console.log(data.contents)
          let xmlString = data.contents;
          return xmlString
      })
      .then((xmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'text/xml');
        const titleEl = doc.querySelector('title');
        console.log(titleEl.textContent)
      })
     
     
   
};

//const xml = data.text()
 //       const parser = new DOMParser();
   //     const doc = parser.parseFromString(data, 'application/xml');
      //  console.log(xml)//