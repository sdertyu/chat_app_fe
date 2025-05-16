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
                            {{ message.content }}
                        </div>
                    </div>
                    <div v-else class="user-message" :class="{ 'own-message': message.sender === 'self' }">
                        <Avatar v-if="message.sender !== 'self'" :image="message.avatar" shape="circle" />
                        <div class="message-bubble" :class="{ 'own': message.sender === 'self' }">
                            {{ message.content }}
                        </div>
                        <div>
                            {{ message.readUser }}
                        </div>
                    </div>
                </div>
                <div class="chat-image-preview" v-if="currentChat.imagePreview">
                    <img :src="currentChat.imagePreview" alt="Dashboard preview" class="dashboard-preview" />
                </div>
            </div>

            {{ isTyping }}
            <div v-if="isTyping" class="typing-indicator">
                Ai đó đang nhập...
            </div>


            <!-- Footer Component -->
            <FooterView v-model:newMessage="newMessage" @send-message="sendMessage" @input="handleTyping" />
        </div>

        <!-- Profile Sidebar Component -->
        <SidebarProfile :settings="settings" :members="members" @update:settings="settings = $event" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue';
import SidebarView from '@/components/layout/SidebarView.vue';
import HeaderView from '@/components/layout/HeaderView.vue';
import FooterView from '@/components/layout/FooterView.vue';
import SidebarProfile from '@/components/layout/SidebarProfile.vue';
import Avatar from 'primevue/avatar';
import axios from '@/plugins/axios';
import socket from '@/plugins/socket';

// Types
export interface Message {
    id: number;
    sender: 'self' | 'other' | 'system';
    content: string;
    avatar?: string;
    readUser?: []
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
    members?: Member[];
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
const isTyping = ref(false);


// localStorage
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');

const settings = ref<Settings>({
    notifications: true,
    sound: false,
    saveDownloads: false
});

const handleTyping = (): void => {
    socket.emit('typing', {
        senderId: userId,
        conversationId: String(selectedChatId.value)
    });
};

// Sample data
const chats = ref<Chat[]>([]);
//     {
//         id: 1,
//         name: 'PrimeTek Team',
//         avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
//         lastMessage: "Let's implement PrimeVue. Elevatin...",
//         lastMessageTime: '11:15',
//         unreadCount: 0,
//         messages: [
//             { sender: 'system', content: "Awesome! What's the standout feature?" },
//             {
//                 sender: 'other',
//                 avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
//                 content: "PrimeVue rocks! Simplifies UI dev with versatile components."
//             },
//             {
//                 sender: 'other',
//                 avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
//                 content: "Intriguing! Tell us more about its impact."
//             },
//             {
//                 sender: 'other',
//                 avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
//                 content: "It's design-neutral and compatible with Tailwind. Features accessible, high-grade components!"
//             },
//         ],
//         // imagePreview: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-htel9z5kGfF2pD2zHJTV8zRXC3PI4z.png'
//     },
//     {
//         id: 2,
//         name: 'Cody Fisher',
//         avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
//         lastMessage: "Hey there! I've heard about...",
//         lastMessageTime: '12:30',
//         unreadCount: 8,
//         messages: []
//     },
//     {
//         id: 3,
//         name: 'Jerome Bell',
//         avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
//         lastMessage: "PrimeVue's...",
//         lastMessageTime: '11:15',
//         unreadCount: 4,
//         messages: []
//     },
//     {
//         id: 4,
//         name: 'Robert Fox',
//         avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
//         lastMessage: "Interesting! PrimeVue sounds...",
//         lastMessageTime: '11:15',
//         unreadCount: 0,
//         messages: []
//     },
//     {
//         id: 5,
//         name: 'Esther Howard',
//         avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
//         lastMessage: "Quick one, team! Anyone...",
//         lastMessageTime: '11:15',
//         unreadCount: 9,
//         messages: []
//     }
// ]);

const members = ref<Member[]>([
    // { id: 1, name: 'Robin Jonas', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' },
    // { id: 2, name: 'Cameron Williamson', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' },
    // { id: 3, name: 'Eleanor Pena', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' },
    // { id: 4, name: 'Arlene McCoy', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' },
    // { id: 5, name: 'Dianne Russell', avatar: 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg' }
]);

// Computed properties
const currentChat = computed((): Chat => {
    return chats.value.find(chat => chat.id === selectedChatId.value) || chats.value[0] || [];
});

watch(selectedChatId, (newId) => {
    if (socket.connected) {
        let lastMessageId = currentChat.value.messages.length > 0
            ? currentChat.value.messages[currentChat.value.messages.length - 1].id
            : null;
        socket.emit('join_room', { conversationId: String(newId), lastMessageId: Number(lastMessageId), senderId: Number(userId) });
    }
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

    socket.emit('sendMessage', {
        id: Number(null),
        senderId: userId,
        content: newMessage.value,
        conversationId: selectedChatId.value
    });

    nextTick(() => {
        newMessage.value = '';
        scrollToBottom();
    });
};

const scrollToBottom = (): void => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

const getListChat = async (): Promise<void> => {
    try {
        const response = await axios.get('/chat/conversations');
        if (response.status === 200) {
            chats.value = response.data.map((chat: any) => ({
                id: chat.id,
                name: chat.name,
                avatar: chat.avatar || 'https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg',
                lastMessage: chat.messages?.[chat.messages.length - 1]?.content || '',
                lastMessageTime: chat.messages?.[chat.messages.length - 1]?.createdAt
                    ? new Date(chat.messages[chat.messages.length - 1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : chat.createdAt
                        ? new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '',
                unreadCount: 0,
                messages: chat.messages.map((message: any) => ({
                    id: message.id,
                    sender: message.senderId == userId ? 'self' : 'other',
                    content: message.content,
                    avatar: "https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg",
                    readUser: chat.participants.map((user: any) => {
                        if (user.lastReadMessageId == message.id) {
                            return {
                                id: user.usersId,
                            };
                        }
                        return null; // hoặc undefined
                    })

                })),

            }));
        }
    } catch (error) {
        console.error('Error fetching chat list:', error);
        chats.value = [];
    }
    finally {
        // Scroll to bottom after fetching chats
        nextTick(() => {
            scrollToBottom();
        });
    }
};

// Lifecycle hooks
onMounted(() => {
    getListChat();
    // scrollToBottom();

    socket.on('connect', () => {
        socket.emit('join_room', { conversationId: String(selectedChatId.value) });
    });

    socket.on('receive_message', (message) => {
        const chat = chats.value.find(c => c.id == message.conversationId);
        if (chat) {
            chat.messages.push({
                id: message.id,
                sender: message.senderId == userId ? 'self' : 'other',
                content: message.content,
                avatar: ""

            });

            // Nếu là hội thoại hiện tại thì scroll xuống
            if (selectedChatId.value === message.conversationId) {
                nextTick(() => {
                    scrollToBottom();
                });
            }
        }
        console.log(message);
    });

    socket.on('typing2', (data) => {
        console.log("object");
        if (data.conversationId == selectedChatId.value && data.senderId != userId) {
            isTyping.value = true;

            setTimeout(() => {
                isTyping.value = false;
            }, 3000); // tự ẩn sau 3s
        }
    });

});

onBeforeUnmount(() => {
    socket.off('receive_message');
    socket.off('connect');
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