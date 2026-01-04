import { CartProvider } from './CartProvider';
import CartIcon from './CartIcon';
import CartDrawer from './CartDrawer';

export default function HeaderCart() {
  return (
    <CartProvider>
      <CartIcon />
      <CartDrawer />
    </CartProvider>
  );
}
