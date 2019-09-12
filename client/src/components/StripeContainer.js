import React, { useState } from "react";
import axios from 'axios'
import qs from 'query-string-object'

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

  const prices = {
    apple: 150,
    orange: 250
  };

  const axiosHeader = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Bearer rk_test_xxxxxxxxxxxxxxxxxxxxxxxx`
  };

  const handleCartChange = e => {
    e.preventDefault();
    let updated = cart.find(cartItem => cartItem.item === e.target.name);
    console.log(updated);
    updated.quantity += parseInt(e.target.value);
    setCart([...cart, updated]);
  };

  const handleCartSubmit = async e => {
    e.preventDefault();

    const { token } = await stripe.createToken();
    // {name:'An', email:"aa@aa.com"}
    console.log(token);

    const totalPrice = 500;

    const response = await axios.post('/charge', qs.stringify({
        source: token.id,
        amount: totalPrice,
        currency: 'usd'
      }), 
      {headers:axiosHeader

      }
      )
    
      console.log(response)
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
