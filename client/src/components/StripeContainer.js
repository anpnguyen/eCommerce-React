import React from 'react'
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements'
import './stripe.css'

const StripeContainer = () => {
    return (
        <div>
            <h1>this is my form component
                <form action="" className='container'>
                    <label htmlFor="">Name</label>
                    <input type="text"/>
                    <label htmlFor="">CC number</label>
                    <input type="text"/>
                   <CardElement/>

                   <button>Submit</button>
                </form>
            </h1>
        </div>
    )
}

export default injectStripe(StripeContainer)
