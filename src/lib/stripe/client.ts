import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_PUBLISHABLE } from '$env/static/public';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
    return stripePromise ??= loadStripe(PUBLIC_STRIPE_PUBLISHABLE);
}; 