
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Product } from '@/store/slices/productsSlice';

interface CartItem extends Product {
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

const ShoppingCart = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}: ShoppingCartProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + deliveryFee - discountAmount;

  const applyPromoCode = () => {
    if (promoCode === 'STUDENT10') {
      setDiscount(10);
    } else if (promoCode === 'FIRST20') {
      setDiscount(20);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            Browse Products
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Shopping Cart ({items.length} items)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.seller.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{item.condition}</Badge>
                      <span className="text-sm text-gray-500">{item.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.price} each</p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" onClick={applyPromoCode}>
                  Apply
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Try: STUDENT10 or FIRST20
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={onCheckout}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Truck className="w-3 h-3" />
                  <span>Campus delivery</span>
                </div>
                <span>•</span>
                <span>Secure payment</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="font-medium">Free campus delivery</p>
                <p className="text-gray-600">On orders over $50</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShoppingCart;
