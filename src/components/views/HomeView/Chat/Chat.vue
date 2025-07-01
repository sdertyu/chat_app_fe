<script setup lang="ts">
import type { Ref } from "vue";

import useStore from "@/stores/store";
import {
  computed,
  onMounted,
  provide,
  ref,
  nextTick,
  onBeforeUnmount,
  inject,
} from "vue";

import { getActiveConversationId } from "@/utils";

import NoChatSelected from "@/components/states/empty-states/NoChatSelected.vue";
import Spinner from "@/components/states/loading-states/Spinner.vue";
import ChatBottom from "@/components/views/HomeView/Chat/ChatBottom/ChatBottom.vue";
import ChatMiddle from "@/components/views/HomeView/Chat/ChatMiddle/ChatMiddle.vue";
import ChatTop from "@/components/views/HomeView/Chat/ChatTop/ChatTop.vue";
import ChatTyping from "@/components/views/HomeView/Chat/ChatMiddle/ChatTyping.vue";

import {
  getSocket,
  readMessage,
  receive_readMessage,
  receiveMessage,
} from "@/plugins/socket";
import axios from "@/plugins/axios";
import type { IReadMessage, ISendMessage } from "@/types";
import type { Socket } from "socket.io-client";
import { conversations } from "@/stores/defaults";
import CheckboxGroup from "primevue/checkboxgroup";

// Tạo ref cho ChatMiddle component
const chatMiddleRef = ref();

const store = useStore();

const socket = inject<Socket>("socket") || null;

// search the selected conversation using activeConversationId.
const activeConversation = computed(() => {
  let activeConversation = store.conversations.find(
    (conversation) => conversation.id === getActiveConversationId()
  );

  if (activeConversation) {
    return activeConversation;
  } else {
    return store.archivedConversations.find(
      (conversation) => conversation.id === getActiveConversationId()
    );
  }
});

const activeConversationId = getActiveConversationId();

const readMess = computed<IReadMessage>(() => {
  const conversation = activeConversation.value
  const lastMsg = conversation?.messages?.[conversation.messages.length - 1]

  return {
    conversationId: String(activeConversationId),
    lastMessageId: lastMsg?.id || 0,
    userId: store.user?.id || 0,
  }
})


// provide the active conversation to all children.
provide("activeConversation", activeConversation.value);

// determines whether select mode is enabled.
const selectMode = ref(false);

// determines whether all the messages are selected or not.
const selectAll = ref(false);

// holds the selected conversations.
const selectedMessages: Ref<number[]> = ref([]);

// (event) add message to select messages.
const handleSelectMessage = (messageId: number) => {
  selectedMessages.value.push(messageId);

  if (
    activeConversation.value &&
    selectedMessages.value.length === activeConversation.value.messages.length
  ) {
    selectAll.value = true;
  }

  if (!selectMode.value) {
    selectMode.value = true;
  }
};

// (event) remove message from select messages.
const handleDeselectMessage = (messageId: number) => {
  selectAll.value = false;
  selectedMessages.value = selectedMessages.value.filter((item) => item !== messageId);

  if (activeConversation.value && selectedMessages.value.length === 0) {
    selectMode.value = false;
  }
};

// (event) select all messages.
const handleSelectAll = () => {
  if (activeConversation.value) {
    const messages = activeConversation.value.messages.map((message) => message.id);
    selectedMessages.value = messages;
    selectAll.value = true;
  }
};

// (event) remove the selected messages.
const handleDeselectAll = () => {
  selectAll.value = false;
  selectedMessages.value = [];
};

// (event handle close Select)
const handleCloseSelect = () => {
  selectMode.value = false;
  selectAll.value = false;
  selectedMessages.value = [];
};

const join_room = () => {
  const socket = getSocket();
  if (socket && activeConversationId) {
    socket.emit("join_room", { conversationId: String(activeConversationId) });
  }
};

const scrollToBottom = () => {
  if (chatMiddleRef.value && chatMiddleRef.value.scrollToBottom) {
    chatMiddleRef.value.scrollToBottom();
  }
};

const receiveMessageClient = async (message: ISendMessage) => {
  // if (socket) {
  //       socket.on('receive_message', async (message) => {
  // console.log('chat');
  const chat = store.conversations.find((c) => c.id == Number(message.conversationId));
  if (chat) {
    const sender = chat.contacts.find((c) => c.id === message.senderId);
    if (sender && message.id !== null && message.createdAt !== null) {
      chat.messages.push({
        id: message.id,
        type: "text",
        content: message.content,
        date: message.createdAt.toLocaleString(),
        sender: {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
          avatar: sender.avatar,
          email: sender.email,
          lastSeen: new Date(),
          lastReadMessageId: message.id,
        },
        state: "unread",
      });
      // if (chat.unread) chat.unread += 1;

      // if (chat.id === activeConversationId && activeConversation.value) {
      //   activeConversation.value.messages.push({
      //     id: message.id,
      //     type: "text",
      //     content: message.content,
      //     date: message.createdAt.toLocaleString(),
      //     sender: {
      //       id: sender.id,
      //       firstName: sender.firstName,
      //       lastName: sender.lastName,
      //       avatar: sender.avatar,
      //       email: sender.email,
      //       lastSeen: new Date(),
      //       lastReadMessageId: message.id,
      //     },
      //     state: "unread",
      //   });
      // }

      store.isTyping = false;
      nextTick(() => {
        scrollToBottom();
      });
    } else {
      try {
        const newChat = await axios.get(`/chat/conversations/${message.conversationId}`);
        if (newChat.status === 200) {
          const chatData = newChat.data;
          store.addConversation(chatData);
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    }
    // })
  }
};

const handleReceiveReadMessage = (data: IReadMessage) => {
  let conversation = store.conversations.find(
    (c) => c.id === Number(data.conversationId)
  );
  // if (!conversation) {
  //   conversation = store.archivedConversations.find(
  //     (c) => c.id === Number(data.conversationId)
  //   );
  // }
  // console.log(data.lastMessageId);
  if (conversation) {
    // conversation.messages.forEach((message) => {
    //   if (message.id <= data.lastMessageId && message.sender.id !== data.userId) {
    //     message.state = "read";
    //   }
    // });
    conversation.contacts.forEach((contact) => {
      if (contact.id === data.userId) {
        contact.lastReadMessageId = data.lastMessageId;
      }
    });
  } else {
    console.warn("Conversation not found for read message:", data);
  }
};

const handleVisibleTab = () => {
  if (document.visibilityState === "visible") {
    console.log("ok");
  }
};

const handleWindowFocus = () => {
  console.log("window");
  if (readMess.value.conversationId && readMess.value.lastMessageId) {
    // readMess.userId = store.user?.id || 0;
    console.log(readMess.value.lastMessageId);
    readMessage(readMess.value);
  }
};

onMounted(() => {
  join_room();
  receiveMessage(receiveMessageClient);
  receive_readMessage(handleReceiveReadMessage);
  // document.addEventListener("visibilitychange", handleVisibleTab);
  window.addEventListener("focus", handleWindowFocus);
});

onBeforeUnmount(() => {
  const socket = getSocket();
  if (socket) {
    socket.off("receive_message");
  }
});
</script>

<template>
  <Spinner v-if="store.status === 'loading' || store.delayLoading" />

  <div v-else-if="getActiveConversationId() && activeConversation" class="h-full flex flex-col scrollbar-hidden">
    <ChatTop :select-all="selectAll" :select-mode="selectMode" :handle-select-all="handleSelectAll"
      :handle-deselect-all="handleDeselectAll" :handle-close-select="handleCloseSelect" />
    <ChatMiddle ref="chatMiddleRef" :selected-messages="selectedMessages" :handle-select-message="handleSelectMessage"
      :handle-deselect-message="handleDeselectMessage" />
    <ChatTyping v-if="store.isTyping" />

    <ChatBottom />
  </div>

  <NoChatSelected v-else />
</template>
