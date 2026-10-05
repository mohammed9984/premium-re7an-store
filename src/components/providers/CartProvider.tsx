"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/lib/types";

export type CartEntry = CartLine & {
  nameArabic: string;
  nameEnglish: string;
  image: string;
  unitPrice: number;
  currency: string;
  stock: number;
};

type CartContextValue = {
  entries: CartEntry[];
  isOpen: boolean;
  hydrated: boolean;
  count: number;
  subtotal: number;
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  add: (entry: Omit<CartEntry, "quantity">, quantity?: number) => void;
  remove: (slug: string, sizeMl: number) => void;
  setQuantity: (slug: string, sizeMl: number, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "re7an_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartEntry[];
        if (Array.isArray(parsed)) setEntries(parsed.filter((e) => e && e.slug));
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage full / blocked
    }
  }, [entries, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const add = useCallback((entry: Omit<CartEntry, "quantity">, quantity = 1) => {
    setEntries((current) => {
      const index = current.findIndex((e) => e.slug === entry.slug && e.sizeMl === entry.sizeMl);
      if (index >= 0) {
        const next = [...current];
        next[index] = {
          ...next[index],
          quantity: Math.min(20, next[index].quantity + quantity),
          unitPrice: entry.unitPrice,
        };
        return next;
      }
      return [...current, { ...entry, quantity: Math.min(20, Math.max(1, quantity)) }];
    });
    setLastAdded(`${entry.slug}-${entry.sizeMl}`);
    setIsOpen(true);
  }, []);

  const remove = useCallback((slug: string, sizeMl: number) => {
    setEntries((current) => current.filter((e) => !(e.slug === slug && e.sizeMl === sizeMl)));
  }, []);

  const setQuantity = useCallback((slug: string, sizeMl: number, quantity: number) => {
    setEntries((current) =>
      current.flatMap((e) => {
        if (e.slug !== slug || e.sizeMl !== sizeMl) return [e];
        if (quantity <= 0) return [];
        return [{ ...e, quantity: Math.min(20, quantity) }];
      }),
    );
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = entries.reduce((sum, e) => sum + e.quantity, 0);
    const subtotal = entries.reduce((sum, e) => sum + e.unitPrice * e.quantity, 0);
    return {
      entries,
      isOpen,
      hydrated,
      count,
      subtotal,
      lastAdded,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      remove,
      setQuantity,
      clear,
    };
  }, [entries, isOpen, hydrated, lastAdded, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
