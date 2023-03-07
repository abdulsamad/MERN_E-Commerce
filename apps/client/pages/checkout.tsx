import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { useCart } from '@store/index';
import CheckoutForm from '@components/user/payment/CheckoutForm';
import { capturePayment } from '@api/user';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout: NextPage = () => {
  const { amount } = useCart();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      const intent = await capturePayment(amount);
      return intent;
    };

    // Set client secret
    createPaymentIntent()
      .then(({ client_secret }) => setClientSecret(client_secret))
      .catch((err) => console.error(err));
  }, [amount]);

  const options: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
      labels: 'above',
    },
    clientSecret,
  };

  return (
    <div className="flex-1">
      <Head>
        <title>Shopper Ave - Checkout</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col p-2 md:flex-row lg:p-5">
        <section className="mx-auto px-8 lg:w-1/2">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm amount={amount} />
            </Elements>
          )}
        </section>
      </div>
    </div>
  );
};

export default Checkout;
