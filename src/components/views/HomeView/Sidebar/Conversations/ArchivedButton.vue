<script setup lang="ts">
import { ArchiveBoxIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import useStore from "@/stores/store";

const props = defineProps<{
    open: boolean;
}>();

const store = useStore();
</script>

<template>
    <div>
        <button :aria-label="'toggle archived conversations'"
            class="group w-full h-23 px-5 py-6 mb-3 flex rounded focus:outline-none transition duration-300 ease-out"
            :class="props.open
                ? [
                    'bg-red-300',
                    'hover:bg-red-400',
                    'focus:bg-red-400',
                    'active:bg-red-400',
                    'dark:bg-red-400',
                    'dark:hover:bg-red-300',
                    'dark:focus:bg-red-300',
                    'dark:active:bg-red-300',
                ]
                : [
                    'focus:bg-indigo-50',
                    'dark:active:bg-gray-600',
                    'dark:focus:bg-gray-600',
                    'dark:hover:bg-gray-600',
                    ' hover:bg-indigo-50',
                    'active:bg-indigo-100',
                ]
                " tabindex="0">
            <!--archived icon-->
            <div class="mr-4" :class="{ hidden: props.open }">
                <div
                    class="w-7 h-7 flex justify-center items-center rounded-full bg-gray-50 dark:bg-gray-500 transition duration-500">
                    <ArchiveBoxIcon class="w-5 h-5 stroke-1 text-gray-500 dark:text-white transition duration-500" />
                </div>
            </div>

            <!--close archive button-->
            <div class="w-full h-full flex justify-center items-center" :class="{ hidden: !props.open }">
                <XMarkIcon class="w-5 h-5 mr-3 stroke-1" :class="props.open
                    ? [
                        'text-white',
                        'dark:text-white',
                        'group-hover:text-white',
                        'group-focus:text-white',
                    ]
                    : []
                    " />

                <p class="body-2 text-white dark:text-white group-hover:text-white group-focus:text-white">
                    Close Archive
                </p>
            </div>

            <div class="w-full flex flex-col" :class="{ hidden: props.open }">
                <div class="w-full">
                    <!--title-->
                    <div class="flex items-start">
                        <div class="grow mb-4 text-start">
                            <p class="heading-2 text-black/70 dark:text-white/70">
                                Archived Conversations
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <!--number of conversations -->
                    <p class="body-2 text-black/70 dark:text-white/70 flex justify-start items-center">
                        {{ store.archivedConversations.length }}
                        conversations
                    </p>
                </div>
            </div>
        </button>
    </div>
</template>
