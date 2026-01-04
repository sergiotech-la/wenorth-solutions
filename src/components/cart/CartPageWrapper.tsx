import { CartProvider } from './CartProvider';
import CartPage from './CartPage';

export default function CartPageWrapper() {
  return (
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
}
