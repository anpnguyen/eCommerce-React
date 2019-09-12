require("dotenv").config();
const express = require("express");
const stripeLoader = require('stripe');
const helmet = require('helmet')
const app = express();
const cors = require("cors");
const path = require("path");

// connectDB();
app.use(helmet())
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/order/process')) {
      req.rawBody = buf.toString()
    }
    if (req.originalUrl.startsWith('/customer/create')) {
      req.rawBody = buf.toString()
    }
  }
}))
app.use(cors())

// {
//   origin: [/http:\/\/localhost:\d+$/],
//   allowedHeaders: ['Content-Type'],
//   credentials: true
// }

// const stripe = configureStripe(process.env.STRIPE);
const stripe = new stripeLoader(process.env.STRIPE);

// const charge = (token, amt) =>{
//   return stripe.charges.create({
//     source: token,
//     amount :amt,
//     currency: 'usd',
//     description: "this is a description",
//   })
// }

app.post('/order', async (req, res) => {
  // console.log(req.body)
  const order = req.body.order
  const source = req.body.source
  // console.log(source)
  try {
    const customer = await stripe.customers.create({
      email: 'jenny.rosen@example.com',
      source: source,
    })
    // console.log(customer)
    // const stripeOrder = await stripe.orders.create(order)
    // console.log(`Order created: ${stripeOrder.id}`)
    // console.log(stripeOrder)
    // await stripe.orders.pay(stripeOrder.id, {source})
  } catch (err) {
    console.log(err)
    // Handle stripe errors here: No such coupon, sku, ect
    // console.log(`Order error: ${err}`)
    return res.sendStatus(404)
  }
  return res.sendStatus(200)
})

app.post('/order/process', async (req, res) => {
  // console.log(req.header)
  // console.log(req.rawBody)
  const sig = req.headers['stripe-signature']
  // console.log('calling')
  try {
    const event = await stripe.webhooks.constructEvent(req.rawBody, sig, process.env.WEBHOOK_SECRET)
    // console.log(`Processing Order : ${event.data.object.id}`)
    // Process payed order here
  } catch (err) {
    // console.log(err)
    return res.sendStatus(500)
  }
  return res.sendStatus(200)
})
app.post('/customer/create', async (req, res) => {
  
  const sig = req.headers['stripe-signature']
  
  try {
    const event = await stripe.webhooks.constructEvent(req.rawBody, sig, process.env.WEBHOOK_SECRET_CUSTOMER)
    // console.log(`Processing Order : ${event.data.object.id}`)
    // Process payed order here
    console.log('created customer')
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
  return res.sendStatus(200)
})




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
