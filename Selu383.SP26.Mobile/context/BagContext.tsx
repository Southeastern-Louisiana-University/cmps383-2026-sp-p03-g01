import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { addItem, checkout, getBag, removeItem, updateItem } from "../api/bag";

type BagItemDto = {
  itemId: number;
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
  doCheckout: () => Promise<void>;
};

const BagContext = createContext<BagContextType | null>(null);

export function BagProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagDto | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const data = await getBag();
    setBag(data);
    setLoading(false);
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

  async function doCheckout() {
    await checkout();
    await refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <BagContext.Provider
      value={{ bag, loading, add, update, remove, doCheckout }}
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
