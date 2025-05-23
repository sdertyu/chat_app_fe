<script setup lang="ts">
import type { IAttachment, IMessage } from "@/types";
import type { Ref } from "vue";

import { computed, ref } from "vue";

import { ArrowDownTrayIcon } from "@heroicons/vue/24/outline";
import { PlayIcon } from "@heroicons/vue/24/solid";
import Carousel from "@/components/ui/data-display/Carousel/Carousel.vue";

const props = defineProps<{
    message: IMessage;
    self?: boolean;
}>();

const openCarousel: Ref<boolean> = ref(false);

const selectedAttachmentId: Ref<number | undefined> = ref();

// open the carousel with the selected index
const openCarouselWithAttachment = (attachmentId: number) => {
    selectedAttachmentId.value = attachmentId;
    openCarousel.value = true;
};

// close the carousel
const closeCarousel = () => {
    openCarousel.value = false;
};

// check if the message contains images or videos
const containsMedia = computed(() => {
    if (props.message.attachments) {
        for (let attachment of props.message.attachments) {
            if (["image", "video"].includes(attachment.type)) return true;
        }
    }
    return false;
});

// number of videos attached to this message.
const numberOfMedia = computed(() => {
    let counter = 0;

    if (props.message.attachments) {
        for (let attachment of props.message.attachments) {
            if (["video", "image"].includes(attachment.type)) {
                counter += 1;
            }
        }
    }

    return counter;
});

// test is the attachment is the second media item.
const isNumber = (
    attachment: IAttachment,
    number: number,
    largerThan?: boolean,
) => {
    let counter = 0;
    let caseCorrect = false;

    if (props.message.attachments) {
        for (let item of props.message.attachments) {
            if (["video", "image"].includes(item.type)) {
                counter += 1;

                if (largerThan) {
                    if (item.id === attachment.id && counter > number) {
                        caseCorrect = true;
                    }
                } else {
                    if (item.id === attachment.id && counter === number) {
                        caseCorrect = true;
                    }
                }
            }
        }
    }

    return caseCorrect;
};
</script>

<template>
    <div>
        <div class="flex">
            <div v-for="(attachment, index) in message.attachments" :key="index" class="mr-2 flex items-end"
                :class="{ 'mt-4': containsMedia }">
                <!--image-->
                <button v-if="attachment.type === 'image'" @click="openCarouselWithAttachment(attachment.id)"
                    class="outline-none" :aria-label="numberOfMedia > 2
                            ? (props.message.attachments as []).length -
                            1 +
                            ' more attachments'
                            : attachment.name
                        ">
                    <div v-if="!isNumber(attachment, 2, true)" :style="{ backgroundImage: `url(${attachment.url})` }"
                        class="rounded bg-cover bg-center" :class="numberOfMedia === 1
                                ? ['w-50', 'h-50']
                                : [
                                    'md:w-27.5',
                                    'md:h-25',
                                    'xs:w-25',
                                    'xs:h-23.75',
                                ]
                            ">
                        <!--first image-->
                        <div v-if="isNumber(attachment, 1)"
                            class="w-full h-full flex justify-center items-center rounded bg-black/20 hover:bg-black/10 transition duration-200">
                        </div>

                        <!--more images overlay-->
                        <div v-if="isNumber(attachment, 2) && numberOfMedia > 2"
                            class="w-full h-full flex items-center justify-center rounded bg-black/40 text-white hover:bg-black/10 transition duration-200">
                            {{ (props.message.attachments as []).length - 1 }}+
                        </div>
                    </div>
                </button>

                <!--video-->
                <button v-if="attachment.type === 'video'" @click="openCarouselWithAttachment(attachment.id)"
                    class="overflow-hidden outline-none" :aria-label="numberOfMedia > 2
                            ? (props.message.attachments as []).length -
                            1 +
                            ' more attachments'
                            : attachment.name
                        ">
                    <div v-if="!isNumber(attachment, 2, true)"
                        :style="{ backgroundImage: `url(${attachment.thumbnail})` }" class="rounded bg-cover bg-center"
                        :class="numberOfMedia === 1
                                ? ['w-50', 'h-50']
                                : [
                                    'md:w-27.5',
                                    'md:h-25',
                                    'xs:w-25',
                                    'xs:h-23.75',
                                ]
                            ">
                        <!--first video-->
                        <div v-if="isNumber(attachment, 1)"
                            class="w-full h-full flex justify-center items-center rounded bg-black/20 hover:bg-black/10 transition duration-200">
                            <span class="p-3 rounded-full bg-white/40 transition-all duration-200">
                                <PlayIcon class="w-5 h-5 text-white" />
                            </span>
                        </div>

                        <!--second video-->
                        <div v-else-if="isNumber(attachment, 2) && numberOfMedia < 3"
                            class="w-full h-full flex justify-center items-center rounded bg-black/20 hover:bg-black/10 transition duration-200">
                            <span class="p-3 rounded-full bg-white/40 transition-all duration-200">
                                <PlayIcon class="w-5 h-5 text-white" />
                            </span>
                        </div>

                        <!--more videos overlay-->
                        <div v-else-if="isNumber(attachment, 2) && numberOfMedia > 2"
                            class="w-full h-full flex items-center justify-center rounded bg-black/40 text-white hover:bg-black/10 transition duration-200">
                            {{ (props.message.attachments as []).length - 1 }}+
                        </div>
                    </div>
                </button>

                <!--file-->
                <div v-if="attachment.type === 'file' && !containsMedia">
                    <div class="flex">
                        <!--download button / icons-->
                        <button c
                            class="w-8 h-8 mr-4 flex justify-center rounded-full outline-none items-center duration-200"
                            :class="props.self
                                    ? ['bg-indigo-300']
                                    : [
                                        'bg-indigo-50',
                                        'hover:bg-indigo-100',
                                        'active:bg-indigo-200',
                                        'dark:bg-gray-400',
                                        'dark:hover:bg-gray-300',
                                        'dark:focus:bg-gray-300',
                                        'dark:active:bg-gray-200',
                                    ]
                                ">
                            <ArrowDownTrayIcon class="stroke-2 h-5 w-5" :class="props.self
                                    ? ['text-white']
                                    : ['text-blue-500', 'dark:text-gray-50']
                                " />
                        </button>

                        <div class="flex flex-col justify-center">
                            <p class="heading-2 mb-3" :class="props.self
                                    ? ['text-black opacity-50 dark:text-white dark:opacity-70 ']
                                    : [
                                        'text-black',
                                        'opacity-50',
                                        'dark:text-white',
                                        'dark:opacity-70',
                                    ]
                                ">
                                {{ attachment.name }}
                            </p>

                            <p class="body-2" :class="props.self
                                    ? ['text-black opacity-60 dark:text-white dark:opacity-70']
                                    : [
                                        'text-black',
                                        'opacity-50',
                                        'dark:text-white',
                                        'dark:opacity-70',
                                    ]
                                ">
                                {{ attachment.size }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!--carousel modal-->
            <Carousel :open="openCarousel" :starting-id="selectedAttachmentId as number"
                :close-carousel="closeCarousel" />
        </div>
    </div>
</template>
