<script setup lang="ts">
import GreenChecks from "@/assets/vectors/green_checks.svg";
import GrayChecks from "@/assets/vectors/gray_checks.svg";

const props = defineProps<{
    state: string;
}>();
</script>

<template>
    <img v-if="props.state === 'delivered'" :src="GrayChecks" class="w-[.875rem] h-[.875rem]" />
    <img v-else-if="props.state === 'read'" :src="GreenChecks" class="w-[.875rem] h-[.875rem]" />
</template>
