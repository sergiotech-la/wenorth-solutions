import type { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useCart } from '../cart/CartProvider';
import { getProductUrl } from '../../lib/cart';

interface Product {
  title: string;
  handle: string;
  productType: string;
  images: { src: string; alt: string }[];
  variants: { id: number; title: string; price: string; available: boolean }[];
}

const ProductCard: FunctionalComponent<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const variant = product.variants[0];
  const image = product.images[0];
  const isAvailable = variant?.available !== false;

  const handleAddToCart = () => {
    if (!variant || !isAvailable) return;

    setIsAdding(true);

    addToCart({
      variantId: variant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: variant.title,
      price: variant.price,
      image: image?.src || '',
    });

    // Reset button state after animation
    setTimeout(() => setIsAdding(false), 1000);
  };

  // Internal PDP URL
  const pdpUrl = `/products/${product.handle}`;

  return (
    <article class="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <a
        href={pdpUrl}
        class="block aspect-square bg-gray-50 overflow-hidden"
      >
        {image ? (
          <img
            src={image.src}
            alt={image.alt}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div class="w-full h-full flex items-center justify-center text-gray-300">
            <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </a>

      {/* Content */}
      <div class="p-4">
        {product.productType && (
          <span class="text-xs font-medium text-brand-yellow uppercase tracking-wide">
            {product.productType}
          </span>
        )}

        <h3 class="font-semibold text-brand-charcoal mt-1 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {variant?.price && (
          <p class="text-lg font-bold text-brand-charcoal mt-2">
            ${parseFloat(variant.price).toFixed(2)}
          </p>
        )}

        <div class="mt-4 space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            class={`w-full font-medium py-2 px-4 rounded transition-all ${
              !isAvailable
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isAdding
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-yellow hover:bg-brand-gold text-brand-charcoal'
            }`}
          >
            {!isAvailable ? 'Out of Stock' : isAdding ? 'Added!' : 'Add to Cart'}
          </button>

          <a
            href={pdpUrl}
            class="block w-full text-center text-brand-slate hover:text-brand-yellow text-sm py-1 transition-colors font-medium"
          >
            View Details &rarr;
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
