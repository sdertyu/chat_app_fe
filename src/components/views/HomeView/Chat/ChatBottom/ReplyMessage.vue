<script setup lang="ts">
import type { IConversation } from "@/types";

import { inject } from "vue";

import { getConversationIndex } from "@/utils";
import useStore from "@/stores/store";

import { XCircleIcon } from "@heroicons/vue/24/outline";
import IconButton from "@/components/ui/inputs/IconButton.vue";
import SlideTransition from "@/components/ui/transitions/SlideTransition.vue";
import MessagePreview from "@/components/views/HomeView/Chat/MessagePreview.vue";

const store = useStore();

const activeConversation = <IConversation>inject("activeConversation");

// (event) removes the reply message from top of the text message textarea
const handleRemoveReplyMessage = () => {
    if (activeConversation) {
        // get the active conversation index in the state store
        let activeConversationIndex = getConversationIndex(activeConversation.id);

        if (
            store.conversations &&
            activeConversationIndex !== undefined &&
            activeConversationIndex !== null
        ) {
            // update the conversation in the state store
            store.conversations[activeConversationIndex].replyMessage = undefined;
        }
    }
};
</script>

<template>
    <SlideTransition animation="shelf-up">
        <div class="absolute bottom-0 w-full px-5 py-2 bg-white dark:bg-gray-800 flex items-center justify-between transition-all duration-200"
            v-if="activeConversation?.replyMessage">
            <!--selected message overview-->
            <MessagePreview :message="activeConversation?.replyMessage" />

            <!--close selected Message-->
            <IconButton @click="handleRemoveReplyMessage" class="ic-btn-ghost-primary w-7 h-7" title="remove reply"
                aria-label="remove reply">
                <XCircleIcon class="w-5 h-5" />
            </IconButton>
        </div>
    </SlideTransition>
</template>
