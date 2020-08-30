// from https://www.npmjs.com/package/nightmare

const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });

nightmare
  .goto("https://www.linode.com/docs")
  .insert(".ais-SearchBox-input", "ubuntu")
  .click(".ais-SearchBox-submit")
  .wait(".ais-Hits-list")
  .evaluate(function () {
    let searchResults = [];

    const results = document.querySelectorAll("a.c-search__result__link");
    results.forEach(function (result) {
      let row = {
        title: result.innerText,
        url: result.href
      };
      searchResults.push(row);
    });
    return searchResults;
  })
  .end()
  .then(function (result) {
    result.forEach(function (r) {
      console.log("Title: " + r.title);
      console.log("URL: " + r.url);
    });
  })
  .catch(function (e) {
    console.log(e);
  });
