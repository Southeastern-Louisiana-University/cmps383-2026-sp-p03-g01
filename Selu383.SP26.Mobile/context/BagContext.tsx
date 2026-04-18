import { router } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { addItem, checkout, getBag, removeItem, updateItem } from "../api/bag";

type BagItemDto = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

type BagDto = {
  id: number;
  items: BagItemDto[];
  subtotal: number;
};

type BagContextType = {
  bag: BagDto | null;
  loading: boolean;
  add: (itemId: number, qty?: number) => Promise<void>;
  update: (itemId: number, qty: number) => Promise<void>;
  remove: (itemId: number) => Promise<void>;
  clear: () => Promise<void>;
  doCheckout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const BagContext = createContext<BagContextType | null>(null);

export function BagProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagDto | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      setLoading(true);
      const data = await getBag();

      if (!data) {
        setBag({ id: 0, items: [], subtotal: 0 });
        return;
      }

      const normalized: BagDto = {
        id: data.id ?? data.Id ?? 0,
        subtotal: data.subtotal ?? data.Subtotal ?? 0,
        items: (data.items ?? data.Items ?? []).map((i: any) => ({
          id: i.id ?? i.Id ?? i.itemId ?? i.ItemId,
          name: i.name ?? i.Name ?? "Unknown",
          price: i.price ?? i.Price ?? 0,
          quantity: i.quantity ?? i.Quantity ?? 1,
          lineTotal: i.lineTotal ?? i.LineTotal ?? 0,
        })),
      };

      setBag(normalized);
    } catch (error) {
      console.error("Bag Context Refresh Error:", error);
      setBag({ id: 0, items: [], subtotal: 0 });
    } finally {
      setLoading(false);
    }
  }

  async function add(itemId: number, qty: number = 1) {
    await addItem(itemId, qty);
    await refresh();
  }

  async function update(itemId: number, qty: number) {
    await updateItem(itemId, qty);
    await refresh();
  }

  async function remove(itemId: number) {
    await removeItem(itemId);
    await refresh();
  }

  async function clear() {
    if (bag?.items) {
      for (const item of bag.items) {
        await removeItem(item.id);
      }
    }
    await refresh();
  }

  async function doCheckout() {
    await checkout();
    await refresh();
    router.push("/checkoutcomplete");
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <BagContext.Provider
      value={{
        bag,
        loading,
        add,
        update,
        remove,
        clear,
        doCheckout,
        refresh,
      }}
    >
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) {
    throw new Error("useBag must be used inside a BagProvider");
  }
  return ctx;
}
