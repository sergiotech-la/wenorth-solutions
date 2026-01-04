import { useCart } from './CartProvider';

export default function CartPage() {
  const {
    cart,
    total,
    count,
    checkoutUrl,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  if (cart.length === 0) {
    return (
      <div class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="mt-4 text-xl font-semibold text-brand-charcoal">Your cart is empty</h2>
        <p class="mt-2 text-brand-slate">Browse our safety equipment catalog to get started.</p>
        <a
          href="/products"
          class="mt-6 inline-block bg-brand-yellow hover:bg-brand-gold text-brand-charcoal font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div class="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div class="lg:col-span-2">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-brand-charcoal">
            Your Cart ({count} {count === 1 ? 'item' : 'items'})
          </h1>
          <button
            onClick={clearCart}
            class="text-sm text-brand-slate hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div class="space-y-4">
          {cart.map(item => (
            <div
              key={item.variantId}
              class="flex gap-4 bg-white p-4 rounded-lg border border-gray-100"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.productTitle}
                  class="w-24 h-24 object-cover rounded-lg bg-gray-100"
                />
              ) : (
                <div class="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              <div class="flex-1">
                <h3 class="font-semibold text-brand-charcoal">{item.productTitle}</h3>
                {item.variantTitle !== 'Default Title' && (
                  <p class="text-sm text-brand-slate">{item.variantTitle}</p>
                )}
                <p class="text-brand-charcoal font-medium mt-1">
                  ${parseFloat(item.price).toFixed(2)} each
                </p>
              </div>

              <div class="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.variantId)}
                  class="text-gray-400 hover:text-red-600 transition-colors p-1"
                  aria-label="Remove item"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div class="flex items-center border border-gray-200 rounded">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    class="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span class="px-3 py-1 border-x border-gray-200 min-w-[40px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    class="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                <p class="font-semibold text-brand-charcoal">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div class="lg:col-span-1">
        <div class="bg-gray-50 rounded-lg p-6 sticky top-24">
          <h2 class="text-lg font-semibold text-brand-charcoal mb-4">Order Summary</h2>

          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-brand-slate">
              <span>Subtotal ({count} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-brand-slate text-sm">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div class="flex justify-between text-brand-slate text-sm">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4 mb-6">
            <div class="flex justify-between text-xl font-bold text-brand-charcoal">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full bg-brand-yellow hover:bg-brand-gold text-brand-charcoal font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            Proceed to Checkout
          </a>

          <p class="text-xs text-brand-slate text-center mt-4">
            You'll be redirected to Boston Safety Equipment's secure checkout to complete your purchase.
          </p>

          <a
            href="/products"
            class="block text-center text-sm text-brand-yellow hover:text-brand-gold font-medium mt-4"
          >
            &larr; Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
