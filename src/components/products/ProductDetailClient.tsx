import { useState } from 'preact/hooks';
import type { FunctionalComponent } from 'preact';
import { CartProvider } from '../cart/CartProvider';
import CartDrawer from '../cart/CartDrawer';
import ProductDetail from './ProductDetail';

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

const ProductDetailClient: FunctionalComponent<Props> = ({ product }) => {
  return (
    <CartProvider>
      <ProductDetail product={product} />
      <CartDrawer />
    </CartProvider>
  );
};

export default ProductDetailClient;
