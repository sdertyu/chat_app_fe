<template>
    <div class="app-wrapper">
        <HeaderView />
        <SidebarView />

        <router-view></router-view>

        <FooterView />
        <!-- <LoadingView v-if="loadingStore.loading" class="loading" /> -->
    </div>
</template>

<script setup lang="ts">

import HeaderView from '@/components/layout/HeaderView.vue';
import FooterView from '@/components/layout/FooterView.vue';
import SidebarView from '@/components/layout/SidebarView.vue';
</script>