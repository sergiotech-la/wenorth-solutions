import { useState, useEffect, useRef } from 'preact/hooks';
import type { FunctionalComponent } from 'preact';
import { useCart } from '../cart/CartProvider';
import { getProductUrl } from '../../lib/cart';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css';

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  productType: string;
  vendor: string;
  tags: string[];
  images: { src: string; alt: string }[];
  variants: { id: number; title: string; price: string; available: boolean; sku: string | null }[];
}

interface Props {
  product: Product;
}

const ProductDetail: FunctionalComponent<Props> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderInstanceRef = useRef<any>(null);

  const selectedVariant = product.variants[selectedVariantIndex];
  const isAvailable = selectedVariant?.available !== false;
  const hasMultipleVariants = product.variants.length > 1 && product.variants[0].title !== 'Default Title';
  const hasMultipleImages = product.images.length > 1;

  useEffect(() => {
    if (sliderRef.current && product.images.length > 0) {
      sliderInstanceRef.current = new KeenSlider(sliderRef.current, {
        initial: 0,
        slideChanged(slider) {
          setCurrentSlide(slider.track.details.rel);
        },
        loop: product.images.length > 1,
      });
    }

    return () => {
      if (sliderInstanceRef.current) {
        sliderInstanceRef.current.destroy();
      }
    };
  }, [product.images.length]);

  const goToSlide = (index: number) => {
    if (sliderInstanceRef.current) {
      sliderInstanceRef.current.moveToIdx(index);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) return;

    setIsAdding(true);

    addToCart({
      variantId: selectedVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      image: product.images[0]?.src || '',
    }, quantity);

    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
      {/* Image Gallery */}
      <div class="space-y-4">
        {/* Main Image Slider */}
        <div class="relative">
          <div
            ref={sliderRef}
            class="keen-slider aspect-square bg-white rounded-xl lg:rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
          >
            {product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div key={index} class="keen-slider__slide flex items-center justify-center p-4">
                  <img
                    src={image.src}
                    alt={image.alt || product.title}
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
              ))
            ) : (
              <div class="keen-slider__slide flex items-center justify-center text-gray-300">
                <svg class="w-20 h-20 lg:w-24 lg:h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={() => sliderInstanceRef.current?.prev()}
                class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-brand-charcoal transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => sliderInstanceRef.current?.next()}
                class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-brand-charcoal transition-all hover:scale-110"
                aria-label="Next image"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Slide Indicator Dots (Mobile) */}
          {hasMultipleImages && (
            <div class="flex lg:hidden justify-center gap-2 mt-3">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  class={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index
                      ? 'bg-brand-yellow w-4'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery (Desktop) */}
        {hasMultipleImages && (
          <div class="hidden lg:flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                class={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  currentSlide === index
                    ? 'border-brand-yellow shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt || product.title}
                  class="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div class="space-y-5 lg:space-y-6">
        {/* Category & Vendor */}
        <div class="flex flex-wrap gap-2">
          {product.productType && (
            <span class="inline-block bg-brand-yellow/10 text-brand-yellow text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
              {product.productType}
            </span>
          )}
          {product.vendor && (
            <span class="inline-block bg-gray-100 text-brand-slate text-xs font-medium px-3 py-1 rounded-full">
              {product.vendor}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-charcoal leading-tight">
          {product.title}
        </h1>

        {/* Price */}
        <div class="flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold text-brand-charcoal">
            ${parseFloat(selectedVariant?.price || '0').toFixed(2)}
          </span>
          {!isAvailable && (
            <span class="text-sm text-red-500 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Variant Selector */}
        {hasMultipleVariants && (
          <div class="space-y-2">
            <label class="block text-sm font-medium text-brand-charcoal">
              Select Option
            </label>
            <div class="flex flex-wrap gap-2">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(index)}
                  disabled={!variant.available}
                  class={`px-3 sm:px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    index === selectedVariantIndex
                      ? 'border-brand-yellow bg-brand-yellow/10 text-brand-charcoal'
                      : variant.available
                        ? 'border-gray-200 text-brand-slate hover:border-gray-300'
                        : 'border-gray-100 text-gray-400 cursor-not-allowed line-through'
                  }`}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div class="space-y-2">
          <label class="block text-sm font-medium text-brand-charcoal">
            Quantity
          </label>
          <div class="flex items-center">
            <div class="inline-flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                class="px-3 sm:px-4 py-2 text-lg hover:bg-gray-100 transition-colors rounded-l-lg"
              >
                -
              </button>
              <span class="px-3 sm:px-4 py-2 border-x border-gray-200 min-w-[50px] sm:min-w-[60px] text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                class="px-3 sm:px-4 py-2 text-lg hover:bg-gray-100 transition-colors rounded-r-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div class="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            class={`w-full font-semibold py-3 sm:py-4 px-6 rounded-lg transition-all duration-300 text-base sm:text-lg ${
              !isAvailable
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isAdding
                  ? 'bg-green-500 text-white scale-[1.02]'
                  : 'bg-brand-yellow hover:bg-brand-gold text-brand-charcoal hover:scale-[1.02]'
            }`}
          >
            {!isAvailable ? 'Out of Stock' : isAdding ? 'Added to Cart!' : 'Add to Cart'}
          </button>
          <a
            href={getProductUrl(product.handle)}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 w-full px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-lg text-brand-slate hover:border-brand-yellow hover:text-brand-charcoal transition-all duration-200 text-sm sm:text-base"
          >
            <span>View on Partner Site</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* SKU */}
        {selectedVariant?.sku && (
          <p class="text-sm text-brand-slate">
            SKU: <span class="font-mono">{selectedVariant.sku}</span>
          </p>
        )}

        {/* Description */}
        {product.description && (
          <div class="border-t border-gray-200 pt-5 lg:pt-6 space-y-3 lg:space-y-4">
            <h2 class="text-base lg:text-lg font-semibold text-brand-charcoal">Description</h2>
            <div
              class="prose prose-sm max-w-none text-brand-slate"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Partner Notice */}
        <div class="bg-brand-charcoal/5 rounded-lg p-4">
          <p class="text-xs sm:text-sm text-brand-slate">
            <svg class="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            This product is fulfilled by our partner, <strong>Boston Safety Equipment</strong>. You'll complete your purchase on their secure checkout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
