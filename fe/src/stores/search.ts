import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore('search', () => {
    const word = ref<string>('');
    const type = ref<string>('Category');

    return {word, type};
})