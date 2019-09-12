require("dotenv").config();
const express = require("express");
const stripeLoader = require('stripe');
const helmet = require('helmet')
const app = express();
const cors = require("cors");
const path = require("path");

// connectDB();
app.use(helmet())
app.use(express.json({ extended: false }));
app.use(cors())

// {
//   origin: [/http:\/\/localhost:\d+$/],
//   allowedHeaders: ['Content-Type'],
//   credentials: true
// }

// const stripe = configureStripe(process.env.STRIPE);
const stripe = new stripeLoader(process.env.STRIPE);

const charge = (token, amt) =>{
  return stripe.charges.create({
    source: token,
    amount :amt,
    currency: 'usd',
    description: "this is a description",
  })
}

app.post('/charge', async (req, res) => {

  console.log(req.body)
  try {
    let response = await charge(req.body.source.id, req.body.amount)
    console.log(response)
  
  } catch (err) {
    // Handle stripe errors here: No such coupon, sku, ect
    console.log(`Order error: ${err}`)
    return res.sendStatus(404)
  }
  return res.sendStatus(200)
})






const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
