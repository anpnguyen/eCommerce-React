import React, { useState } from "react";
import axios from "axios";

import { CardElement, injectStripe } from "react-stripe-elements";
import "./stripe.css";

const StripeContainer = props => {
  const { stripe } = props;
  const [cart, setCart] = useState([
    { item: "T-Shirt", sku: "sku_FnJ7E5EEavmbWd", quantity: 0 },
    { item: "e-Book", sku: "sku_FmxE14XcellRYv", quantity: 0 }
  ]);

  const axiosHeader = {
    "Content-Type": "application/json"
  };

  const handleCartChange = e => {
    e.preventDefault();

    let updated = cart.find(cartItem => cartItem.item === e.target.name);
    updated.quantity += parseInt(e.target.value);
    setCart([...cart, updated]);
  };

  const handleCartSubmit = async e => {
    e.preventDefault();

    // this token allows you to store the suers name that is linked to the cc, but not the cc number itseld
    const { token } = await stripe.createToken();

    const order = {
      currency: "aud",
      items: [
        { type: "sku", parent: cart[0].sku, quantity: cart[0].quantity },
        { type: "sku", parent: cart[1].sku, quantity: cart[1].quantity }
      ],

      email: "aa@aa.com",

      shipping: {
        name: "an",
        address: {
          line1: "Test line1",
          city: "My City",
          postal_code: "90210",
          state: "CA"
        }
      }
    };

    try {
      const response = await axios.post(
        "/order",
        JSON.stringify({
          order: order,
          source: token.id
        }),
        { headers: axiosHeader }
      );

      alert(
        `Your order of ${response.data.amount} was successfully processed `
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>this is my form component</h1>
      <div>
        <h3>this is where the items will go</h3>

        <div className="">
          <button name="T-Shirt" value={-1} onClick={handleCartChange}>
            -
          </button>
          {cart[0].item}
          {cart[0].quantity}
          $10
          <button name="T-Shirt" value={1} onClick={handleCartChange}>
            +
          </button>
        </div>

        <div className="">
          <button name="e-Book" value={-1} onClick={handleCartChange}>
            -
          </button>
          {cart[1].item}
          {cart[1].quantity}
          $15
          <button name="e-Book" value={1} onClick={handleCartChange}>
            +
          </button>
        </div>
      </div>
      <form action="" className="container" onSubmit={handleCartSubmit}>
        <CardElement />

        <button>Submit</button>
      </form>
    </div>
  );
};

export default injectStripe(StripeContainer);
