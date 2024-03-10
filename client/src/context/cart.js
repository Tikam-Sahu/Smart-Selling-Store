//this is contex api page for global cart state handling 
import { useState, useContext, createContext, useEffect } from 'react';

const CartContext = createContext();

//object 
const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);


    useEffect(() => {
        let existingCartItems = localStorage.getItem('cart');
        if (existingCartItems) {
            setCart(JSON.parse(existingCartItems));
        }
    }, []);

    return (
        <CartContext.Provider value={[cart, setCart]}>
            {children}
        </CartContext.Provider>
    );
}

//custom hook 
const useCart = () => useContext(CartContext);
export { useCart, CartProvider };