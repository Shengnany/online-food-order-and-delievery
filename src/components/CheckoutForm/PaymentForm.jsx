import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Review from './Review';


const CheckoutForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout,timeout }) => {

  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
    // const paymentMethodResponse = await stripe.createPaymentMethod({ type: 'card', cardElement });

  
    if (error) {
      alert(error.message);
    } else {
      console.log(paymentMethod)
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
        shipping: { name: 'International', street: shippingData.address1, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };
      // customer.email: The Email field is required when customer.id is not present.
      // index.js:1 shipping.street: The Shipping street address field is required.
      // index.js:1 shipping.town_city: The Shipping town/city field is required.
      // index.js:1 payment.gateway: The selected payment.gateway is invalid.
      onCaptureCheckout(checkoutToken.id, orderData);
      timeout()
      nextStep();
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <CardElement />
      <br /> <br />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={backStep}>Back</Button>
        <Button type="submit" variant="contained" disabled={!stripe} color="primary">
          {/* Pay {checkoutToken.live.subtotal.formatted_with_symbol} */}
          Pay
        </Button>
      </div>
    </form>
  );
};



const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout,timeout }) => {

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
      <Elements stripe={stripePromise}>
        <CheckoutForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />
      </Elements>
    </>
  );
};

export default PaymentForm;
