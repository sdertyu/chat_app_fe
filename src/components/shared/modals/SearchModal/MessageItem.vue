<script setup lang="ts">
import type { IMessage } from "@/types";

import { getFullName } from "@/utils";

const props = defineProps<{
    message: IMessage;
}>();
</script>

<template>
    <button
        class="w-full p-5 flex outline-none hover:bg-indigo-100 focus:bg-indigo-100 active:bg-indigo-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600 duration-200">
        <!--profile image-->
        <div class="mr-4">
            <div :style="{ backgroundImage: `url(${props.message.sender.avatar})` }"
                class="w-7 h-7 rounded-full bg-cover bg-center"></div>
        </div>

        <!--name and message-->
        <div class="grow">
            <div class="flex flex-col items-start">
                <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
                    {{ getFullName(props.message.sender) }}
                </p>

                <p class="body-2 text-black/70 dark:text-white/70">Wow really cool</p>
            </div>
        </div>

        <!--message date-->
        <div>
            <p class="body-4 text-black/70 dark:text-white/70">1/5/2019</p>
        </div>
    </button>
</template>
