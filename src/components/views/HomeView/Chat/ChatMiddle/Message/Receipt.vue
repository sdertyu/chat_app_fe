<script setup lang="ts">
import { CheckIcon, ClockIcon } from "@heroicons/vue/24/outline";
import DoubleChecks from "@/components/views/HomeView/Chat/ChatMiddle/Message/DoubleChecks.vue";

const props = defineProps<{
    state: string;
}>();
</script>

<template>
    <ClockIcon v-if="props.state === 'waiting'" class="w-[.875rem] h-[.875rem] text-gray-300" />
    <CheckIcon v-else-if="props.state === 'sent'" class="w-[.875rem] h-[.875rem] text-gray-300" />
    <DoubleChecks v-else :state="props.state" />
</template>
