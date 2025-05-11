<template>
    <div class="chat-container">
        <!-- Sidebar Component -->
        <SidebarView :chats="chats" :selectedChatId="selectedChatId" :searchQuery="searchQuery"
            @update:searchQuery="searchQuery = $event" @select-chat="selectChat" />

        <!-- Main Chat Area -->
        <div class="main-chat">
            <!-- Header Component -->
            <HeaderView :currentChat="currentChat" />

            <div class="chat-messages" ref="messagesContainer">
                <div v-for="(message, index) in currentChat.messages" :key="index" class="message-container">
                    <div v-if="message.sender === 'system'" class="system-message">
                        <Avatar label="OS" shape="circle" size="small" />
                        <div class="message-bubble system">
                            {{ message.text }}
                        </div>
                    </div>
                    <div v-else class="user-message" :class="{ 'own-message': message.sender === 'self' }">
                        <Avatar v-if="message.sender !== 'self'" :image="message.avatar" shape="circle" />
                        <div class="message-bubble" :class="{ 'own': message.sender === 'self' }">
                            {{ message.text }}
                        </div>
                    </div>
                </div>
                <div class="chat-image-preview" v-if="currentChat.imagePreview">
                    <img :src="currentChat.imagePreview" alt="Dashboard preview" class="dashboard-preview" />
                </div>
            </div>

            <!-- Footer Component -->
            <FooterView v-model:newMessage="newMessage" @send-message="sendMessage" />
        </div>

        <!-- Profile Sidebar Component -->
        <SidebarProfile :settings="settings" :members="members" @update:settings="settings = $event" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import SidebarView from '@/components/layout/SidebarView.vue';
import HeaderView from '@/components/layout/HeaderView.vue';
import FooterView from '@/components/layout/FooterView.vue';
import SidebarProfile from '@/components/layout/SidebarProfile.vue';
import Avatar from 'primevue/avatar';

// Types
export interface Message {
    sender: 'self' | 'other' | 'system';
    text: string;
    avatar?: string;
}

export interface Chat {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: Message[];
    imagePreview?: string;
}

export interface Member {
    id: number;
    name: string;
    avatar: string;
}

export interface Settings {
    notifications: boolean;
    sound: boolean;
    saveDownloads: boolean;
}

// State
const searchQuery = ref('');
const selectedChatId = ref(1);
const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const settings = ref<Settings>({
    notifications: true,
    sound: false,
    saveDownloads: false
});

// Sample data
const chats = ref<Chat[]>([
    {
        id: 1,
        name: 'PrimeTek Team',
        avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
        lastMessage: "Let's implement PrimeVue. Elevatin...",
        lastMessageTime: '11:15',
        unreadCount: 0,
        messages: [
            { sender: 'system', text: "Awesome! What's the standout feature?" },
            {
                sender: 'other',
                avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
                text: "PrimeVue rocks! Simplifies UI dev with versatile components."
            },
            {
                sender: 'other',
                avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
                text: "Intriguing! Tell us more about its impact."
            },
            {
                sender: 'other',
                avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
                text: "It's design-neutral and compatible with Tailwind. Features accessible, high-grade components!"
            },
        ],
        // imagePreview: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-htel9z5kGfF2pD2zHJTV8zRXC3PI4z.png'
    },
    {
        id: 2,
        name: 'Cody Fisher',
        avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
        lastMessage: "Hey there! I've heard about...",
        lastMessageTime: '12:30',
        unreadCount: 8,
        messages: []
    },
    {
        id: 3,
        name: 'Jerome Bell',
        avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
        lastMessage: "PrimeVue's...",
        lastMessageTime: '11:15',
        unreadCount: 4,
        messages: []
    },
    {
        id: 4,
        name: 'Robert Fox',
        avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
        lastMessage: "Interesting! PrimeVue sounds...",
        lastMessageTime: '11:15',
        unreadCount: 0,
        messages: []
    },
    {
        id: 5,
        name: 'Esther Howard',
        avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
        lastMessage: "Quick one, team! Anyone...",
        lastMessageTime: '11:15',
        unreadCount: 9,
        messages: []
    }
]);

const members = ref<Member[]>([
    { id: 1, name: 'Robin Jonas', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' },
    { id: 2, name: 'Cameron Williamson', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' },
    { id: 3, name: 'Eleanor Pena', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' },
    { id: 4, name: 'Arlene McCoy', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' },
    { id: 5, name: 'Dianne Russell', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' }
]);

// Computed properties
const currentChat = computed((): Chat => {
    return chats.value.find(chat => chat.id === selectedChatId.value) || chats.value[0];
});

// Methods
const selectChat = (chatId: number): void => {
    selectedChatId.value = chatId;
    // Reset unread count when selecting a chat
    const chat = chats.value.find(c => c.id === chatId);
    if (chat) {
        chat.unreadCount = 0;
    }

    // Scroll to bottom of messages
    nextTick(() => {
        scrollToBottom();
    });
};

const sendMessage = (): void => {
    if (!newMessage.value.trim()) return;

    const chat = chats.value.find(c => c.id === selectedChatId.value);
    if (chat) {
        chat.messages.push({
            sender: 'self',
            text: newMessage.value
        });
        chat.lastMessage = newMessage.value;
        chat.lastMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        newMessage.value = '';

        // Simulate response after a delay
        setTimeout(() => {
            chat.messages.push({
                sender: 'other',
                avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
                text: "Thanks for your message! I'll get back to you soon."
            });
            scrollToBottom();
        }, 1000);
    }

    nextTick(() => {
        scrollToBottom();
    });
};

const scrollToBottom = (): void => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

// Lifecycle hooks
onMounted(() => {
    scrollToBottom();
});
</script>

<style scoped>
.chat-container {
    display: flex;
    height: 100vh;
    width: 100%;
    background-color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.main-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.message-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.system-message,
.user-message {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    max-width: 80%;
}

.own-message {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    background-color: #f0f0f0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-bubble.own {
    background-color: #6366f1;
    color: white;
}

.message-bubble.system {
    background-color: #f0f0f0;
}

.chat-image-preview {
    display: flex;
    justify-content: center;
    margin: 16px 0;
}

.dashboard-preview {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>