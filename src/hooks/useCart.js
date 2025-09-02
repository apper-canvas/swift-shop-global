import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CART_STORAGE_KEY = "swift-shop-cart";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

const addToCart = (product, customQuantity = 1) => {
    setCartItems(prevItems => {
      // Create unique item key including variants
      const itemKey = `${product.Id}-${product.selectedSize || 'default'}-${product.selectedColor || 'default'}`;
      const existingItem = prevItems.find(item => 
        item.productId === product.Id && 
        item.selectedSize === product.selectedSize &&
        item.selectedColor === product.selectedColor
      );
      
      if (existingItem) {
        toast.success(`Updated ${product.title} quantity in cart!`);
        return prevItems.map(item =>
          item.productId === product.Id && 
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + customQuantity }
            : item
        );
      } else {
        const variantText = product.selectedSize || product.selectedColor 
          ? ` (${[product.selectedSize, product.selectedColor].filter(Boolean).join(', ')})` 
          : '';
        toast.success(`${product.title}${variantText} added to cart!`);
        return [...prevItems, { 
          productId: product.Id,
          quantity: customQuantity,
          selectedSize: product.selectedSize,
          selectedColor: product.selectedColor,
          product: {
            ...product,
            // Remove variant properties from stored product to avoid confusion
            selectedSize: undefined,
            selectedColor: undefined,
            selectedQuantity: undefined
          }
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.productId === productId);
      if (item) {
        toast.success(`${item.product.title} removed from cart`);
      }
      return prevItems.filter(item => item.productId !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared!");
  };

  const getCartTotal = () => {
return cartItems.reduce((total, item) => total + (item.product.price_c * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    openCart,
    closeCart
  };
};