import Stripe from 'stripe';
import { STRIPE_SECRET } from '$env/static/private';

if (!STRIPE_SECRET) {
    throw new Error('STRIPE_SECRET environment variable is required');
}

export const stripe = new Stripe(STRIPE_SECRET, {
    apiVersion: '2025-05-28.basil',
    typescript: true,
});
