import { useState } from 'preact/hooks';

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    submenu: [
      { label: 'Safety Consulting', href: '/services/consulting' },
      { label: 'OSHA Training', href: '/services/training/osha' },
      { label: 'Food Safety Training', href: '/services/training/food-safety' },
    ],
  },
  { label: 'Products', href: '/products' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubmenu = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <div class="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <svg class="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg class="w-6 h-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            class="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div class="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl">
            <div class="flex justify-between items-center p-4 border-b">
              <span class="font-bold text-brand-charcoal">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav class="p-4 space-y-2">
              {navItems.map((item) =>
                item.submenu ? (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      class="flex items-center justify-between w-full py-2 text-brand-charcoal hover:text-brand-yellow transition-colors"
                    >
                      <span>{item.label}</span>
                      <svg
                        class={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.label) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedItems.includes(item.label) && (
                      <div class="pl-4 space-y-1">
                        <a
                          href={item.href}
                          class="block py-1 text-brand-slate hover:text-brand-yellow transition-colors"
                        >
                          All Services
                        </a>
                        {item.submenu.map((subitem) => (
                          <a
                            key={subitem.href}
                            href={subitem.href}
                            class="block py-1 text-brand-slate hover:text-brand-yellow transition-colors"
                          >
                            {subitem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    class="block py-2 text-brand-charcoal hover:text-brand-yellow transition-colors"
                  >
                    {item.label}
                  </a>
                )
              )}
            </nav>
            <div class="absolute bottom-0 left-0 right-0 p-4 border-t">
              <a
                href="/cart"
                class="flex items-center gap-2 py-2 text-brand-charcoal hover:text-brand-yellow transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>View Cart</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
