import { createSlice } from '@reduxjs/toolkit';

const getInitialCartItems = () => {
    try {
        const items = localStorage.getItem('cartItems');
        if (!items) return [];
        const parsed = JSON.parse(items);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
};

const initialState = {
    cartItems: getInitialCartItems(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action) {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart(state) {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
        saveShippingAddress(state, action) {
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
        },
        savePaymentMethod(state, action) {
            state.paymentMethod = action.payload;
            localStorage.setItem('paymentMethod', action.payload);
        },
    },
});

export const { addToCart, removeFromCart, clearCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;

export default cartSlice.reducer;
