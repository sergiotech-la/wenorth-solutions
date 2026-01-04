export interface CartItem {
  variantId: number;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  quantity: number;
  image: string;
}

const CART_KEY = 'wenorth-cart';
const SHOPIFY_DOMAIN = 'bostonsafetyequipment.com';

// Referral configuration
const REFERRAL = {
  partner: 'wenorth',
  source: 'wenorth-equipment-catalog',
};

// ============================================
// Cart Storage Operations
// ============================================

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
  const cart = getCart();
  const existing = cart.find(i => i.variantId === item.variantId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }

  saveCart(cart);
}

export function updateQuantity(variantId: number, quantity: number): void {
  const cart = getCart();
  const index = cart.findIndex(i => i.variantId === variantId);

  if (index !== -1) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    saveCart(cart);
  }
}

export function removeFromCart(variantId: number): void {
  const cart = getCart().filter(i => i.variantId !== variantId);
  saveCart(cart);
}

export function clearCart(): void {
  saveCart([]);
}

// ============================================
// Cart Calculations
// ============================================

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ============================================
// Shopify Checkout URL with Referral Tracking
// ============================================

export function getCheckoutUrl(cart: CartItem[]): string {
  if (cart.length === 0) return '#';

  // Build line items string: VARIANT_ID:QTY,VARIANT_ID:QTY
  const lineItems = cart
    .map(item => `${item.variantId}:${item.quantity}`)
    .join(',');

  // Build tracking parameters
  const params = new URLSearchParams();

  // Cart attributes (visible in Shopify admin, hidden from customer with _ prefix)
  params.set('attributes[_referral-partner]', REFERRAL.partner);
  params.set('attributes[_referral-source]', REFERRAL.source);
  params.set('attributes[_referral-timestamp]', Date.now().toString());

  // UTM parameters for analytics
  params.set('utm_source', REFERRAL.partner);
  params.set('utm_medium', 'partner-catalog');
  params.set('utm_campaign', 'ppe-sales');

  return `https://${SHOPIFY_DOMAIN}/cart/${lineItems}?${params.toString()}`;
}

// ============================================
// Product URL Helper
// ============================================

export function getProductUrl(handle: string): string {
  return `https://${SHOPIFY_DOMAIN}/products/${handle}`;
}
