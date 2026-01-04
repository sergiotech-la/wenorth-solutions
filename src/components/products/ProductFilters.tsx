import type { FunctionalComponent } from 'preact';
import CartIcon from '../cart/CartIcon';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortBy: 'title' | 'price-asc' | 'price-desc';
  onSortChange: (sort: 'title' | 'price-asc' | 'price-desc') => void;
  resultCount: number;
}

const ProductFilters: FunctionalComponent<Props> = ({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  resultCount,
}) => {
  return (
    <div class="bg-white rounded-lg border border-gray-100 p-4">
      <div class="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div class="flex-1">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onInput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div class="w-full lg:w-48">
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange((e.target as HTMLSelectElement).value || null)}
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div class="w-full lg:w-48">
          <select
            value={sortBy}
            onChange={(e) => onSortChange((e.target as HTMLSelectElement).value as any)}
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent bg-white"
          >
            <option value="title">Sort: A-Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Cart Icon */}
        <div class="flex items-center">
          <CartIcon />
        </div>
      </div>

      {/* Results Count */}
      <div class="mt-3 text-sm text-brand-slate">
        Showing {resultCount} {resultCount === 1 ? 'product' : 'products'}
      </div>
    </div>
  );
};

export default ProductFilters;
