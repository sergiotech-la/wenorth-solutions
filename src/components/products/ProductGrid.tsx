import { useState, useMemo } from 'preact/hooks';
import type { FunctionalComponent } from 'preact';
import { CartProvider } from '../cart/CartProvider';
import CartDrawer from '../cart/CartDrawer';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

interface Product {
  id: string;
  title: string;
  handle: string;
  productType: string;
  images: { src: string; alt: string }[];
  variants: { id: number; title: string; price: string; available: boolean }[];
}

interface Props {
  products: Product[];
  categories: string[];
}

const ProductGridInner: FunctionalComponent<Props> = ({ products, categories }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'price-asc' | 'price-desc'>('title');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.productType?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.productType === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      const priceA = parseFloat(a.variants[0]?.price || '0');
      const priceB = parseFloat(b.variants[0]?.price || '0');
      return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
    });

    return result;
  }, [products, search, selectedCategory, sortBy]);

  return (
    <>
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={filteredProducts.length}
      />

      {filteredProducts.length === 0 ? (
        <div class="text-center py-12 text-brand-slate">
          <p>No products found matching your criteria.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory(null); }}
            class="mt-4 text-brand-yellow hover:text-brand-gold font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <CartDrawer />
    </>
  );
};

// Wrap with CartProvider
const ProductGrid: FunctionalComponent<Props> = (props) => {
  return (
    <CartProvider>
      <ProductGridInner {...props} />
    </CartProvider>
  );
};

export default ProductGrid;
