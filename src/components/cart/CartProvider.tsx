import { createContext } from 'preact';
import { useContext, useState, useEffect, useCallback } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import {
  getCart,
  addToCart as addItem,
  updateQuantity as updateQty,
  removeFromCart as removeItem,
  clearCart as clear,
  getCartCount,
  getCartTotal,
  getCheckoutUrl,
  type CartItem
} from '../../lib/cart';

interface CartContextType {
  cart: CartItem[];
  count: number;
  total: number;
  checkoutUrl: string;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  removeFromCart: (variantId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ComponentChildren }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getCart());

    const handleUpdate = (e: CustomEvent<CartItem[]>) => {
      setCart(e.detail);
    };

    window.addEventListener('cart-updated', handleUpdate as EventListener);
    return () => window.removeEventListener('cart-updated', handleUpdate as EventListener);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  const value: CartContextType = {
    cart,
    count: getCartCount(cart),
    total: getCartTotal(cart),
    checkoutUrl: getCheckoutUrl(cart),
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart: (item, qty = 1) => {
      addItem(item, qty);
      setCart(getCart());
      openCart(); // Open cart drawer when item added
    },
    updateQuantity: (id, qty) => {
      updateQty(id, qty);
      setCart(getCart());
    },
    removeFromCart: (id) => {
      removeItem(id);
      setCart(getCart());
    },
    clearCart: () => {
      clear();
      setCart([]);
    },
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
