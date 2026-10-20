const CART_KEY = 'jaliteng_cart_v1';

export type CartItem = {
  cartKey: string;
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  selectedOptions?: Record<string, string>;
  selectedVariant?: { label: string; price: number };
  selectedAddOns?: { label: string; priceAdd: number }[];
  note?: string;
};

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded, skip
  }
}

export function makeCartKey(
  id: string,
  options?: Record<string, string>,
  variant?: string
): string {
  return `${id}__${JSON.stringify(options || {})}__${variant || ''}`;
}

export function formatPrice(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`;
}
