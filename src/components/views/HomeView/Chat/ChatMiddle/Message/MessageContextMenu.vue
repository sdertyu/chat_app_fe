<script setup lang="ts">
import type { IConversation, IMessage } from "@/types";
import { inject } from "vue";

import useStore from "@/stores/store";
import { getConversationIndex } from "@/utils";

import {
    ArrowUturnLeftIcon,
    BookmarkSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClipboardDocumentIcon,
} from "@heroicons/vue/24/outline";
import Dropdown from "@/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@/components/ui/navigation/Dropdown/DropdownLink.vue";

const props = defineProps<{
    message: IMessage;
    show: boolean;
    left: number;
    top: number;
    selected: boolean;
    handleCloseContextMenu: () => void;
    handleSelectMessage: (messageId: number) => void;
    handleDeselectMessage: (messageId: number) => void;
}>();

const store = useStore();

const activeConversation = <IConversation>inject("activeConversation");

// (event) pin message to conversation
const handlePinMessage = () => {
    props.handleCloseContextMenu();

    if (activeConversation) {
        // get the active conversation index in the state store
        let activeConversationIndex = getConversationIndex(activeConversation.id);

        if (
            store.conversations &&
            activeConversationIndex !== undefined &&
            activeConversationIndex !== null
        ) {
            // update the conversation in the state store
            store.conversations[activeConversationIndex].pinnedMessage =
                props.message;
            store.conversations[activeConversationIndex].pinnedMessageHidden = false;
        }
    }
};

// (event) select the reply message.
const handleReplyToMessage = () => {
    props.handleCloseContextMenu();

    if (activeConversation) {
        // get the active conversation index in the state store
        let activeConversationIndex = getConversationIndex(activeConversation.id);

        if (
            store.conversations &&
            activeConversationIndex !== undefined &&
            activeConversationIndex !== null
        ) {
            // update the conversation in the state store
            store.conversations[activeConversationIndex].replyMessage = props.message;
        }
    }
};
</script>

<template>
    <!--custom context menu-->
    <Dropdown :close-dropdown="handleCloseContextMenu" :handle-click-outside="handleCloseContextMenu" :show="show"
        :coordinates="{
            left: props.left + 'px',
            top: props.top + 'px',
        }" :position="['top-0']">
        <button class="dropdown-link dropdown-link-primary" role="menuitem" aria-label="reply to this message"
            @click="handleReplyToMessage">
            <ArrowUturnLeftIcon class="h-5 w-5 mr-3" />
            Reply
        </button>

        <button class="dropdown-link dropdown-link-primary" role="menuitem" aria-label="copy this message"
            @click="handleCloseContextMenu">
            <ClipboardDocumentIcon class="h-5 w-5 mr-3" />
            Copy
        </button>

        <button class="dropdown-link dropdown-link-primary" role="menuitem" aria-label="pin this message"
            @click="handlePinMessage">
            <BookmarkSquareIcon class="h-5 w-5 mr-3" />
            Pin
        </button>

        <button v-if="props.selected" class="dropdown-link dropdown-link-primary" role="menuitem"
            aria-label="deselect this message" @click="
                () => {
                    handleCloseContextMenu();
                    props.handleDeselectMessage(props.message.id);
                }
            ">
            <XCircleIcon class="h-5 w-5 mr-3" />
            Deselect
        </button>

        <button v-else class="dropdown-link dropdown-link-primary" role="menuitem" aria-label="select this message"
            @click="
                () => {
                    handleCloseContextMenu();
                    props.handleSelectMessage(props.message.id);
                }
            ">
            <CheckCircleIcon class="h-5 w-5 mr-3" />
            Select
        </button>

        <button class="dropdown-link dropdown-link-danger" role="menuitem" aria-label="delete this message"
            @click="handleCloseContextMenu">
            <TrashIcon class="h-5 w-5 mr-3" />
            Delete Message
        </button>
    </Dropdown>
</template>
