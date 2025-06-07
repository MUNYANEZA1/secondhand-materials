import mongoose, { Document, Schema } from 'mongoose';

// Interface for an item within an order
export interface IOrderItem extends Document {
  product: mongoose.Schema.Types.ObjectId; // Reference to Product model
  name: string; // Name of the product at time of order
  quantity: number;
  price: number; // Price of the product at time of order
  image: string; // Main image of the product at time of order
}

// Interface for the Order
export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to User model
  items: IOrderItem[];
  shippingAddress: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethod: string; // e.g., 'Stripe', 'PayPal', 'COD'
  itemsPrice: number; // Total price of items
  shippingPrice: number;
  taxPrice: number; // For future use
  totalPrice: number; // Final price after discounts, shipping, tax
  promoCodeApplied?: string;
  discountAmount: number;
  status: 'PendingPayment' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for OrderItem (sub-document)
const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // No separate _id for sub-documents
);

// Schema for Order
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0, // Can be calculated later if needed
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    promoCodeApplied: {
      type: String,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PendingPayment', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'PendingPayment',
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
