import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      AsyncStorage.clear();
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const productsAsync = await AsyncStorage.getItem('@Marketplace:products');

      if (productsAsync) {
        setProducts(JSON.parse(productsAsync));
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function saveProducts(): Promise<void> {
      await AsyncStorage.setItem(
        '@Marketplace:products',
        JSON.stringify(products),
      );
    }

    saveProducts();
  }, [products]);

  const addToCart = useCallback(
    async (product: Product) => {
      // TODO ADD A NEW ITEM TO THE CART

      const findProduct = products.find(
        isProduct => isProduct.id === product.id,
      );

      if (findProduct) {
        const addQuantityToProduct = products.map(isProduct =>
          isProduct.id === product.id
            ? { ...isProduct, quantity: isProduct.quantity + 1 }
            : isProduct,
        );

        setProducts(addQuantityToProduct);

        return;
      }

      setProducts([...products, { ...product, quantity: 1 }]);
    },
    [products],
  );

  const increment = useCallback(
    id => {
      const findProduct = products.find(isProduct => isProduct.id === id);

      if (!findProduct) {
        return;
      }

      const addQuantityToProducts = products.map(isProduct =>
        isProduct.id === id
          ? { ...isProduct, quantity: isProduct.quantity + 1 }
          : isProduct,
      );

      setProducts(addQuantityToProducts);
    },
    [products],
  );

  const decrement = useCallback(
    id => {
      const findProduct = products.find(isProduct => isProduct.id === id);

      if (!findProduct) {
        return;
      }

      if (findProduct && findProduct?.quantity <= 1) {
        return;
      }

      const decrementQuantityToProducts = products.map(isProduct =>
        isProduct.id === id
          ? { ...isProduct, quantity: isProduct.quantity - 1 }
          : isProduct,
      );

      setProducts(decrementQuantityToProducts);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
