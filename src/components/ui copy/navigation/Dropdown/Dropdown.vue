<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

import ScaleTransition from "@/components/ui/transitions/ScaleTransition.vue";

const props = defineProps<{
    show: boolean;
    handleClickOutside: any;
    preventClickOutside?: boolean;
    coordinates?: {
        left?: string;
        right?: string;
        top?: string;
        bottom?: string;
    };
    position: string[];
    closeDropdown: () => void;
}>();

// (event) close dropdown when typing esc button.
const handleCloseOnEscape = (event: KeyboardEvent) => {
    if (["Escape", "Esc"].includes(event.key)) {
        props.closeDropdown();
    }
};

onMounted(() => {
    // set the handleCloseOnEscape when mounting the component.
    document.addEventListener("keydown", handleCloseOnEscape);
});

onUnmounted(() => {
    // remove handleCloseOnEscape when unmounting the component.
    document.removeEventListener("keydown", handleCloseOnEscape);
});
</script>

<template>
    <div>
        <div v-if="props.show" class="fixed left-0 top-0 z-50 w-full h-full"></div>

        <ScaleTransition>
            <div :class="props.position" :style="props.coordinates" v-show="props.show"
                v-click-outside="props.handleClickOutside"
                class="absolute z-100 w-50 mt-2 rounded-sm bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-600 focus:outline-none"
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <div role="none">
                    <slot></slot>
                </div>
            </div>
        </ScaleTransition>
    </div>
</template>
