import { defineStore } from "pinia";
import { ref } from 'vue'
import { getShoppingCartOfme } from "../api/cartAPI";
import type { Cart } from "../api/cartAPI";
export const useCartStore = defineStore('cart',  () => {
    const quantityCart = ref<Number>(0);
    const carts = ref<Cart[]>([]);

    const fetchCart = async () => {
        const res = await getShoppingCartOfme();
        carts.value = res;
        quantityCart.value = res.length;
    };

    return {
        carts,
        quantityCart,
        fetchCart
    };
})