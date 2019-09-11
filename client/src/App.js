import React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import StripeContainer from "./components/StripeContainer.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <StripeProvider apiKey="pk_test_SFjNkoCrAaUAj06qsauiODGI00M3Cbr4I6">
        <Elements>
          <StripeContainer />
        </Elements>
      </StripeProvider>
    </div>
  );
}

export default App;
