<script setup lang="ts">
import { computed, ref } from "vue";

import SlideTransition from "@/components/ui/transitions/SlideTransition.vue";
import PasswordSection from "@/components/views/AccessView/RegisterForm/PasswordSection.vue";
import PersonalSection from "@/components/views/AccessView/RegisterForm/PersonalSection.vue";
import { RouterLink } from "vue-router";

defineEmits(["activeSectionChange"]);

// determines what form section to use.
const activeSectionName = ref("personal-section");

// determines what direction the slide animation should use.
const animation = ref("slide-left");

// get the active section component from the section name
const ActiveSection = computed((): any => {
    if (activeSectionName.value === "personal-section") {
        return PersonalSection;
    } else if (activeSectionName.value === "password-section") {
        return PasswordSection;
    }
});

// (event) to move between modal pages
const changeActiveSection = (event: {
    sectionName: string;
    animationName: string;
}) => {
    animation.value = event.animationName;
    activeSectionName.value = event.sectionName;
};
</script>

<template>
    <div class="p-5 md:basis-1/2 xs:basis-full flex flex-col justify-center items-center">
        <div class="w-full md:px-[26%] xs:px-[10%]">
            <!--header-->
            <div class="mb-6 flex flex-col">
                <img src="@/assets/vectors/logo-gradient.svg" class="w-5.5 h-4.5 mb-5 opacity-70" />
                <p class="heading-2 text-black/70 dark:text-white/70 mb-4">
                    Get started with Avian
                </p>
                <p class="body-3 text-black/75 dark:text-white/70 font-light">
                    Sign in to start using messaging!
                </p>
            </div>

            <!--form section-->
            <SlideTransition :animation="animation">
                <component @active-section-change="changeActiveSection" :is="ActiveSection" />
            </SlideTransition>

            <!--bottom text-->
            <div class="flex justify-center">
                <p class="body-2 text-black/70 dark:text-white/70">
                    Already have an account?
                    <RouterLink to="/access/sign-in/" class="text-indigo-400 opacity-100">
                        Sign in
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>
