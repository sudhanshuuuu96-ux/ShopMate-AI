import { FunctionDeclaration, SchemaType } from '@google/generative-ai';

export const agentTools: FunctionDeclaration[] = [
  {
    name: 'search_products',
    description: 'Searches the store catalog for products based on customer query, category, maximum budget/price, or tags.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description: 'The search keywords, e.g. "gaming headphones", "mechanical keyboard", "wireless", "rgb"',
        },
        category: {
          type: SchemaType.STRING,
          description: 'Optional category filter: "audio", "gaming", "keyboards", "accessories", "peripherals"',
        },
        maxPrice: {
          type: SchemaType.NUMBER,
          description: 'Optional maximum price in INR (e.g. 3000 for "under ₹3000")',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product_details',
    description: 'Retrieves full details, features, specifications, and compatible upsells for a specific product ID.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        productId: {
          type: SchemaType.STRING,
          description: 'The unique product ID (e.g. "hp-razer-v2x", "acc-rgb-stand")',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'check_inventory',
    description: 'Checks live warehouse stock and remaining inventory for a product ID.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        productId: {
          type: SchemaType.STRING,
          description: 'The product ID to check inventory for',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'add_to_cart',
    description: 'Adds an authentic product to the customer shopping cart. Prices are strictly computed by the server.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        productId: {
          type: SchemaType.STRING,
          description: 'The product ID to add to the cart',
        },
        quantity: {
          type: SchemaType.NUMBER,
          description: 'Number of units to add (default 1)',
        },
        isUpsell: {
          type: SchemaType.BOOLEAN,
          description: 'Set to true if this item was added as a result of an AI upsell or cross-sell recommendation',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'remove_from_cart',
    description: 'Removes an item from the customer cart.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        productId: {
          type: SchemaType.STRING,
          description: 'The product ID to remove from the cart',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'get_cart',
    description: 'Retrieves the customer current cart items, quantities, subtotal, and total amount.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
  {
    name: 'calculate_total',
    description: 'Calculates the final payable amount including discounts, taxes, and shipping.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        promoCode: {
          type: SchemaType.STRING,
          description: 'Optional coupon code or discount code',
        },
      },
    },
  },
  {
    name: 'create_payment_order',
    description: 'CRITICAL: Generates a Razorpay Test Mode checkout order after validating server prices. MUST ONLY BE CALLED AFTER THE CUSTOMER HAS EXPLICITLY CONFIRMED THEY WANT TO PROCEED TO PAYMENT.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        customerConfirmed: {
          type: SchemaType.BOOLEAN,
          description: 'Must be true if the customer has explicitly stated they are ready to pay / buy',
        },
      },
      required: ['customerConfirmed'],
    },
  },
  {
    name: 'get_payment_status',
    description: 'Checks the fulfillment and verification status of a Razorpay payment order.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        razorpayOrderId: {
          type: SchemaType.STRING,
          description: 'The Razorpay Order ID to query',
        },
      },
      required: ['razorpayOrderId'],
    },
  },
];
