const nightmare = require("nightmare")(); // returns a nightmare object

// skips "node" and skips "parser.js" and grabs any args after
const args = process.argv.slice(2) // slicing the process.argv array
const url = args[0]
const minPrice = args[1]

checkPrice();

// setup function for checking price
async function checkPrice() {
  console.log("I ran");
  const priceString = await nightmare
    .goto(url) // goes to a URL and downloads the page
    .wait("#priceblock_ourprice") // waits until some element is rendered on the page (this makes it be able to work with React so it can wait till HTML is created)
    .evaluate(() => document.getElementById("priceblock_ourprice").innerText) // now we run some code on the loaded document. It takes a function which allows you to write JS as if you were on the front end of that app
    .end();

  const priceNumber = parseFloat(priceString.replace("$", ""));
  console.log(priceNumber);
  if (priceNumber < minPrice) {
    console.log("It is cheap ", priceString);
  } else {
    console.log("It is not cheap ", priceString);
  }
}



