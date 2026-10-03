import { computed, signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  addLine,
  applyCode,
  cartStorageKey,
  clearCode,
  computeTotals,
  emptyCart,
  parseStoredCart,
  removeLine,
  resolveLines,
  serializeCart,
  setQuantity,
} from '../lib/cart';
import type { CartLine, CartState } from '../lib/cart';
import { readStorage, removeStorage, writeStorage } from '../lib/storage';

export const cart = signal<CartState>(emptyCart);

export const cartReady = signal(false);

export const drawerOpen = signal(false);

export const cartNotice = signal('');

export const cartTotals = computed(() => computeTotals(cart.value));

export const cartLines = computed(() => resolveLines(cart.value));

let listening = false;

const commit = (next: CartState): void => {
  cart.value = next;
  writeStorage('local', cartStorageKey, serializeCart(next));
};

export const initCart = (): void => {
  if (!cartReady.value) {
    cart.value = parseStoredCart(readStorage('local', cartStorageKey));
    cartReady.value = true;
  }
  if (!listening) {
    listening = true;
    window.addEventListener('storage', event => {
      if (event.key === cartStorageKey) cart.value = parseStoredCart(event.newValue);
    });
  }
};

export const useCartInit = (): void => {
  useEffect(() => {
    initCart();
  }, []);
};

export const addToCart = (line: CartLine): void => {
  initCart();
  commit(addLine(cart.value, line));
};

export const changeQuantity = (key: string, quantity: number): void =>
  commit(setQuantity(cart.value, key, quantity));

export const removeFromCart = (key: string): void => commit(removeLine(cart.value, key));

export const submitCode = (input: string): boolean => {
  const next = applyCode(cart.value, input);
  if (next === cart.value) return false;
  commit(next);
  return true;
};

export const dropCode = (): void => commit(clearCode(cart.value));

export const replaceCart = (next: CartState): void => commit(next);

export const emptyTheCart = (): void => {
  cart.value = emptyCart;
  removeStorage('local', cartStorageKey);
};
