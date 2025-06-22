<script setup lang="ts">
import useStore from "@/stores/store";

import FadeTransition from "@/components/ui/transitions/FadeTransition.vue";
import Navigation from "@/components/views/HomeView/Navigation/Navigation.vue";
import Sidebar from "@/components/views/HomeView/Sidebar/Sidebar.vue";
import { getActiveConversationId } from "@/utils";
import { computed, onMounted, provide, ref, type Ref } from "vue";
import type { IUser } from "@/types";
import { getSocket, connectSocket } from '@/plugins/socket'

const activeConversationId = computed(() => {
  return getActiveConversationId();
});

const socket = connectSocket();
provide('socket', socket);
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

const store = useStore();

const join_user_room = () => {
  // const socket = getSocket();
  if (socket) {
    socket.on("connect", () => {
      socket.emit("joinUserRoom", { userId: (user.value.id) });
    });
  }
}

onMounted(async () => {
  await store.fetchConversations();

  // console.log(store.conversations);

  // store.$patch({
  //     status: "success",
  //     user: user.value,
  //     // conversations: request.data.conversations,
  //     // notifications: request.data.notifications,
  //     // archivedConversations: request.data.archivedConversations,
  // });
  store.status = "success";
  store.user = user.value;

  store.delayLoading = false;
  join_user_room();
});


</script>

<template>
  <KeepAlive v-if="!store.delayLoading">
    <div class="xs:relative md:static h-full flex xs:flex-col md:flex-row overflow-hidden">
      <!--navigation-bar-->
      <Navigation class="xs:order-1 md:order-none" />
      <!--sidebar-->
      <Sidebar class="xs:grow-1 md:grow-0 xs:overflow-y-scroll md:overflow-visible scrollbar-hidden" />
      <!--chat-->
      <div id="mainContent"
        class="xs:absolute xs:z-10 md:static grow h-full xs:w-full md:w-fit scrollbar-hidden bg-white dark:bg-gray-800 transition-all duration-500"
        :class="activeConversationId
          ? ['xs:-left-[0rem]', 'xs:static']
          : ['xs:left-250']
          " role="region">
        <router-view v-slot="{ Component }">
          <FadeTransition name="fade" mode="out-in">
            <component :is="Component" :key="activeConversationId" />
          </FadeTransition>
        </router-view>
      </div>
    </div>
  </KeepAlive>
</template>
