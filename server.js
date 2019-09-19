require("dotenv").config();
const express = require("express");
const stripeLoader = require("stripe");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(helmet());

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/order/process")) {
        req.rawBody = buf.toString();
      }
      if (req.originalUrl.startsWith("/customer/create")) {
        req.rawBody = buf.toString();
      }
    }
  })
);
app.use(cors());

const stripe = new stripeLoader(process.env.STRIPE);

app.post("/newItem", async (req, res) => {
  let newSKU = await stripe.skus.create({
    product: "prod_FnKkiA6TeEBCTN",
    attributes: { size: "Medium", gender: "Unisex" },
    price: 1500,
    currency: "usd",
    inventory: { type: "finite", quantity: 500 },
    attributes: {
      name: "new item"
    }
  });
});

app.post("/order", async (req, res) => {
  const order = req.body.order;
  const source = req.body.source;

  try {
    const stripeOrder = await stripe.orders.create(order);

    const response = await stripe.orders.pay(stripeOrder.id, { source });
    return res.send(response);
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
});

app.post("/order/process", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = await stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.sendStatus(500);
  }
  return res.sendStatus(200);
});

app.post("/customer/create/new", async (req, res) => {
  const source = req.body.source;
  const customer = await stripe.customers.create({
    email: "jenny.rosen@example.com",
    source: source
  });
  console.log(customer);
});

// webhook
app.post("/customer/create", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = await stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.WEBHOOK_SECRET_CUSTOMER
    );
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
  return res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
