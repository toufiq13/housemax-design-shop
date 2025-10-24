// ExchangeRate API service for currency conversion
export interface ExchangeRate {
  [currency: string]: number;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: number;
}

export class ExchangeRateService {
  private apiKey: string;
  private baseUrl = 'https://v6.exchangerate-api.com/v6';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}/${this.apiKey}${endpoint}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`ExchangeRate API error: ${response.status}`);
    }

    return await response.json();
  }

  async getLatestRates(baseCurrency: string = 'USD'): Promise<ExchangeRate> {
    try {
      const data = await this.makeRequest(`/latest/${baseCurrency}`);
      return data.conversion_rates;
    } catch (error) {
      console.error('Error fetching latest rates:', error);
      throw error;
    }
  }

  async convertCurrency(
    from: string,
    to: string,
    amount: number
  ): Promise<ConversionResult> {
    try {
      const data = await this.makeRequest(`/pair/${from}/${to}/${amount}`);
      
      return {
        from: data.base_code,
        to: data.target_code,
        amount: data.amount,
        convertedAmount: data.conversion_result,
        rate: data.conversion_rate,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  }

  async getHistoricalRates(
    date: string,
    baseCurrency: string = 'USD'
  ): Promise<ExchangeRate> {
    try {
      const data = await this.makeRequest(`/history/${baseCurrency}/${date}`);
      return data.conversion_rates;
    } catch (error) {
      console.error('Error fetching historical rates:', error);
      throw error;
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const data = await this.makeRequest('/codes');
      return data.supported_codes.map((code: [string, string]) => code[0]);
    } catch (error) {
      console.error('Error fetching supported currencies:', error);
      return ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']; // Fallback currencies
    }
  }

  // Common currencies for e-commerce
  getCommonCurrencies(): CurrencyInfo[] {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
      { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
      { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
      { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
      { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    ];
  }

  // Format currency for display
  formatCurrency(amount: number, currency: string, locale: string = 'en-US'): string {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback formatting
      const symbols: { [key: string]: string } = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        CAD: 'C$',
        AUD: 'A$',
      };
      
      const symbol = symbols[currency] || currency;
      return `${symbol}${amount.toFixed(2)}`;
    }
  }

  // Get user's preferred currency from browser
  getUserCurrency(): string {
    try {
      const locale = navigator.language || 'en-US';
      const currency = new Intl.NumberFormat(locale).resolvedOptions().currency;
      return currency || 'USD';
    } catch (error) {
      return 'USD';
    }
  }

  // Cache for exchange rates
  private cache: { [key: string]: { rates: ExchangeRate; timestamp: number } } = {};
  private cacheTimeout = 3600000; // 1 hour

  async getCachedRates(baseCurrency: string = 'USD'): Promise<ExchangeRate> {
    const cacheKey = `rates_${baseCurrency}`;
    const cached = this.cache[cacheKey];
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.rates;
    }

    const rates = await this.getLatestRates(baseCurrency);
    this.cache[cacheKey] = {
      rates,
      timestamp: Date.now(),
    };

    return rates;
  }
}

// Create a singleton instance
export const exchangeRateService = new ExchangeRateService(import.meta.env.VITE_EXCHANGERATE_API_KEY || '');
