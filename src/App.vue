<template>
    <div :class="{ dark: store.settings.darkMode }" v-if="!store.delayLoading">
        <div class="bg-white dark:bg-gray-800 transition-colors duration-500" :style="{ height: height }">
            <router-view v-slot="{ Component }">
                <FadeTransition>
                    <component :is="Component" />
                </FadeTransition>
            </router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IUser } from "@/types";
import { ref, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";

import useStore from "@/stores/store";
import { fetchData } from "@/stores/defaults";

import FadeTransition from "@/components/ui/transitions/FadeTransition.vue";
// import type { IConversation } from "@/types";

const store = useStore();
const da = ref(false);
const localUser = JSON.parse(localStorage.getItem("userData") || "");


const user: Ref<IUser> = ref({
    id: Number(localUser.id),
    firstName: localUser.firstName || "null",
    lastName: localUser.lastName || "null",
    email: localUser.email || "null",
    avatar: "null",
    token: "null",
    lastSeen: new Date(),
    contacts: [{
        id: 9,
        firstName: "string",
        lastName: "string",
        avatar: "string",
        email: "string",
        lastSeen: new Date(),
    },]
});

// update localStorage with state changes
store.$subscribe((_mutation, state) => {
    localStorage.setItem("chat", JSON.stringify(state));
});

// here we load the data from the server.
onMounted(async () => {
    store.status = "loading";
    // store.delayLoading = false;
    // console.log(store.delayLoading);

    // const request = await fetchData();
    await store.fetchConversations();
    console.log(store.conversations);

    store.$patch({
        status: "success",
        user: user.value,
        // conversations: request.data.conversations,
        // notifications: request.data.notifications,
        // archivedConversations: request.data.archivedConversations,
    });

    store.delayLoading = false;
    // console.log(store.delayLoading);
});

// the app height
const height = ref(`${window.innerHeight}px`);

// change the app height to the window hight.
const resizeWindow = () => {
    height.value = `${window.innerHeight}px`;
};

// and add the resize event when the component mounts.
onMounted(() => {
    window.addEventListener("resize", resizeWindow);
});

// remove the event when un-mounting the component.
onUnmounted(() => {
    window.removeEventListener("resize", resizeWindow);
});
</script>
