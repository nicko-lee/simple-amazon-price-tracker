require("dotenv").config() // load in .env file
const sgMail = require("@sendgrid/mail") 
sgMail.setApiKey(process.env.SENDGRID_API_KEY) // set API key so when we send email API key is attached

const nightmare = require("nightmare")(); // returns a nightmare object

// skips "node" and skips "parser.js" and grabs any args after
const args = process.argv.slice(2) // slicing the process.argv array
const url = args[0]
const minPrice = args[1]

checkPrice();

// setup function for checking price
async function checkPrice() {
  // ensure all our code tries. If it ever fails it will go into the catch section
  try {
    console.log("checkPrice() called");
    const priceString = await nightmare
      .goto(url) // goes to a URL and downloads the page
      .wait("#priceblock_ourprice") // waits until some element is rendered on the page (this makes it be able to work with React so it can wait till HTML is created)
      .evaluate(() => document.getElementById("priceblock_ourprice").innerText) // now we run some code on the loaded document. It takes a function which allows you to write JS as if you were on the front end of that app
      .end();
  
    const priceNumber = parseFloat(priceString.replace("$", ""));
    console.log(priceNumber);
    if (priceNumber < minPrice) {
      // send a special message that will enable you to view the website from the email
      // await so nothing weird happens. Like our code exits before our email is sent. It ensures the email
      // will always be sent
      await sendEmail(
        "Price is low", 
        `The price on ${url} has dropped below our ${minPrice}`
      )
      console.log("It is cheap ", priceString);
    }
  } catch (e) { 
      await sendEmail("Amazon Price Checker Error", e.message)
      // throw so if we check the logs when the app is running, we will see the error show up in console
      throw e 
  }
}

// create a function that will actually send our email
function sendEmail(subject, body) {
  // this object will contain all the required email fields
  const email = {
    to: process.env.EMAIL,
    from: process.env.EMAIL,
    subject: subject,
    text: body,
    html: body
  }

  // reason this is returned is because it returns a promise. It's async so we need to ensure we await that inside our code
  return sgMail.send(email) // actually send the email
}
