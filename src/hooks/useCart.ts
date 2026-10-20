import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '../store/cartStore';
import { getCart, saveCart } from '../store/cartStore';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(getCart());

  const sync = useCallback(() => {
    setItems(getCart());
    window.dispatchEvent(new Event('jaliteng:cart'));
  }, []);

  useEffect(() => {
    const handler = () => setItems(getCart());
    window.addEventListener('jaliteng:cart', handler);
    return () => window.removeEventListener('jaliteng:cart', handler);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    const cart = getCart();
    const existIdx = cart.findIndex(
      (c) => c.id === item.id &&
             JSON.stringify(c.selectedOptions) === JSON.stringify(item.selectedOptions) &&
             JSON.stringify(c.selectedVariant) === JSON.stringify(item.selectedVariant)
    );
    if (existIdx >= 0) {
      cart[existIdx].qty += item.qty;
    } else {
      cart.push(item);
    }
    saveCart(cart);
    sync();
  }, [sync]);

  const removeItem = useCallback((cartKey: string) => {
    const cart = getCart().filter((c) => c.cartKey !== cartKey);
    saveCart(cart);
    sync();
  }, [sync]);

  const updateQty = useCallback((cartKey: string, qty: number) => {
    const cart = getCart();
    const idx = cart.findIndex((c) => c.cartKey === cartKey);
    if (idx >= 0) {
      if (qty <= 0) cart.splice(idx, 1);
      else cart[idx].qty = qty;
    }
    saveCart(cart);
    sync();
  }, [sync]);

  const clearCart = useCallback(() => {
    saveCart([]);
    sync();
  }, [sync]);

  const totalItems = items.reduce((s, c) => s + c.qty, 0);
  const totalPrice = items.reduce((s, c) => s + c.unitPrice * c.qty, 0);

  return { items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice };
}
