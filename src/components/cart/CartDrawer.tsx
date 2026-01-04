import { useCart } from './CartProvider';
import { useEffect, useState } from 'preact/hooks';

export default function CartDrawer() {
  const {
    cart,
    total,
    checkoutUrl,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart
  } = useCart();

  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure the DOM is updated before starting animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        class={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-out ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        class={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold text-brand-charcoal">Your Cart</h2>
          <button
            onClick={closeCart}
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div class="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div class={`text-center py-12 transition-opacity duration-300 delay-150 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
              <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="mt-4 text-brand-slate">Your cart is empty</p>
              <button
                onClick={closeCart}
                class="mt-4 text-brand-yellow hover:text-brand-gold font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul class="space-y-4">
              {cart.map((item, index) => (
                <li
                  key={item.variantId}
                  class={`flex gap-4 transition-all duration-300 ${
                    isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${index * 50 + 100}ms` }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productTitle}
                      class="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />
                  )}

                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-brand-charcoal text-sm truncate">
                      {item.productTitle}
                    </h3>
                    {item.variantTitle !== 'Default Title' && (
                      <p class="text-xs text-brand-slate">{item.variantTitle}</p>
                    )}
                    <p class="text-sm font-semibold text-brand-charcoal mt-1">
                      ${parseFloat(item.price).toFixed(2)}
                    </p>

                    <div class="flex items-center gap-2 mt-2">
                      <div class="flex items-center border border-gray-200 rounded">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          class="px-2 py-1 text-sm hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span class="px-2 py-1 text-sm border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          class="px-2 py-1 text-sm hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        class="text-xs text-brand-slate hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div
            class={`border-t p-4 space-y-4 transition-all duration-300 delay-200 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div class="flex justify-between text-lg font-semibold text-brand-charcoal">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <p class="text-xs text-brand-slate text-center">
              Shipping calculated at checkout
            </p>

            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="block w-full bg-brand-yellow hover:bg-brand-gold text-brand-charcoal font-semibold py-3 px-6 rounded-lg text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Checkout
            </a>

            <p class="text-xs text-brand-slate text-center">
              You'll complete your purchase on Boston Safety Equipment
            </p>
          </div>
        )}
      </div>
    </>
  );
}
