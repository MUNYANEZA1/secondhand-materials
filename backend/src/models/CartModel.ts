import mongoose, { Document, Schema } from 'mongoose';

// Interface for an item in the cart
export interface ICartItem extends Document {
  product: mongoose.Schema.Types.ObjectId; // Reference to Product model
  quantity: number;
  price: number; // Price of the product at the time of adding to cart
  name: string; // Name of the product
  image: string; // Main image of the product
}

// Interface for the Cart
export interface ICart extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to User model, unique
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for CartItem
// Note: This will be a sub-document, so it doesn't need its own model compilation.
const cartItemSchema = new Schema<ICartItem>(
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
      required: true, // Assuming product always has an image to show in cart
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true, // Price at the time of adding to cart
    },
  },
  {
    _id: false, // No separate _id for sub-documents unless needed
    // timestamps: true, // Timestamps for subdocuments are generally not needed unless specific tracking is required for item additions/updates within the cart items themselves
  }
);

// Schema for Cart
const cartSchema = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user has only one cart
    },
    items: [cartItemSchema], // Array of cart items
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt to the cart
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;
