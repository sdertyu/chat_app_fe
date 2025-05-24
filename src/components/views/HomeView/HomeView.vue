<script setup lang="ts">
import useStore from "@/stores/store";

import FadeTransition from "@/components/ui/transitions/FadeTransition.vue";
import Navigation from "@/components/views/HomeView/Navigation/Navigation.vue";
import Sidebar from "@/components/views/HomeView/Sidebar/Sidebar.vue";
import { getActiveConversationId } from "@/utils";
import { computed, onMounted } from "vue";

const activeConversationId = computed(() => {
    return getActiveConversationId();
});

const store = useStore();

onMounted(() => {

});


</script>

<template>
    <KeepAlive>
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
