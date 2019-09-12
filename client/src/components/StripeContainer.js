import React, { useState } from "react";
import axios from "axios";

import {
  CardElement,
  injectStripe,
  ReactStripeElements
} from "react-stripe-elements";
import "./stripe.css";

const StripeContainer = props => {
  const { stripe } = props;
  const [cart, setCart] = useState([{ item: "bananna", quantity: 0 }]);
  const [loading, isLoading] = useState(false);

  const [user, setUser] = useState({ name: "", email: "", address: "" });

  const prices = {
    apple: 150,
    orange: 250
  };

  const sku = {
    tshirt: "sku_FnJ7E5EEavmbWd",
    ebook: "sku_FmxE14XcellRYv"
  };

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
    // {name:'An', email:"aa@aa.com"}
    console.log(token);

    const totalPrice = 500;

    const order = {
      currency: "aud",
      items: [
        { type: "sku", parent: "sku_FnJ7E5EEavmbWd", quantity: 2 },
        { type: "sku", parent: "sku_Fmy60bnUBvxkrD", quantity: 5 }
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
      // selected_shipping_method: 'flat_fee',
      // shipping_methods: [
      //   {
      //     id: "flat_fee",
      //     amount: 0,
      //     currency: "aud",
      //     delivery_estimate: null,
      //     description: "Free shipping"
      //   }
      // ]
    };

    const response = await axios.post(
      "/order",
      JSON.stringify({
        order: order,
        source: token.id
      }),
      { headers: axiosHeader }
    );

    console.log(response);
  };

  return (
    <div>
      <h1>
        this is my form component
        <div>
          <h3>this is where the items will go</h3>
          <button name="bananna" value={-1} onClick={handleCartChange}>
            -
          </button>
          <button>{cart[0].item}</button>
          <button>{cart[0].quantity}</button>
          <button name="bananna" value={1} onClick={handleCartChange}>
            +
          </button>
        </div>
        <form action="" className="container" onSubmit={handleCartSubmit}>
          {/* <label htmlFor="">Name</label>
          <input type="text" /> */}
          {/* <label htmlFor="">CC number</label>
          <input type="text" /> */}
          <CardElement />

          <button>Submit</button>
        </form>
      </h1>
    </div>
  );
};

export default injectStripe(StripeContainer);
