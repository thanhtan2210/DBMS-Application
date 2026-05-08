import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCartItems, addItemToCart, updateCartItemQuantity, removeItemFromCart, selectCartItem } from "@/modules/admin/services/cart-service";
import { useAuthStore } from "@/store/useAuthStore";

interface CartItem {
  cartItemId: number; 
  variant: {
    variantId: number;
    variantName: string;
    product?: {
      productName: string;
    }
  };
  quantity: number;
  unitPrice: number;
  selectedFlag: boolean;
}

interface CartContextType {
  cart: CartItem[];
  refreshCart: () => void;
  addToCart: (variantId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  selectItem: (itemId: number, selected: boolean) => Promise<void>;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuthStore();
  
  // Mapping email sang customerId cho mục đích demo
  const customerIdMap: Record<string, number> = {
    'alice@email.com': 2,
    'bob@email.com': 3,
    'carol@email.com': 4
  };
  const customerId = user ? (customerIdMap[user.email] || 2) : 2;

  const refreshCart = async () => {
    try {
      const response: any = await getCartItems();
      // Bóc tách dữ liệu linh hoạt (array thẳng hoặc bọc trong data)
      const data = response?.data || response;
      const cartItems = Array.isArray(data) ? data : [];
      const sortedCartItems = [...cartItems].sort((a, b) => a.cartItemId - b.cartItemId);
      setCart(sortedCartItems);
    } catch (e: any) {
      setCart([]);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (variantId: number, quantity: number) => {
    try {
      await addItemToCart({ variantId, quantity });
      await refreshCart();
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await removeItemFromCart(itemId);
      await refreshCart();
    } catch (error) {
      console.error("Lỗi khi xóa khỏi giỏ hàng:", error);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateCartItemQuantity(itemId, Math.max(1, quantity));
      await refreshCart();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const selectItem = async (itemId: number, selected: boolean) => {
    try {
      await selectCartItem(itemId, selected);
      await refreshCart();
    } catch (error) {
      console.error("Lỗi khi chọn sản phẩm:", error);
    }
  };

  const totalItems = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item.quantity || 0), 0) : 0;

  return (
    <CartContext.Provider value={{ cart, refreshCart, addToCart, removeFromCart, updateQuantity, selectItem, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
