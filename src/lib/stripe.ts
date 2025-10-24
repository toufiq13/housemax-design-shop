import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export class StripeService {
  private stripe: Stripe | null = null;

  async initialize(): Promise<Stripe> {
    if (!this.stripe) {
      this.stripe = await stripePromise;
      if (!this.stripe) {
        throw new Error('Failed to initialize Stripe');
      }
    }
    return this.stripe;
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(
    clientSecret: string,
    paymentMethodId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const stripe = await this.initialize();
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          payment_method: paymentMethodId,
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return { success: false, error: 'Payment confirmation failed' };
    }
  }

  async createSetupIntent(customerId: string): Promise<string> {
    try {
      const response = await fetch('/api/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create setup intent');
      }

      const { client_secret } = await response.json();
      return client_secret;
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw error;
    }
  }

  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`/api/payment-methods/${customerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async createCustomer(email: string, name: string): Promise<string> {
    try {
      const response = await fetch('/api/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      const { customerId } = await response.json();
      return customerId;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async processRefund(paymentIntentId: string, amount?: number): Promise<boolean> {
    try {
      const response = await fetch('/api/process-refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId, amount }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const stripeService = new StripeService();
