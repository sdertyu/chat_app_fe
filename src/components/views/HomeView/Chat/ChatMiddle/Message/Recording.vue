<script setup lang="ts">
import type { IRecording } from "@/types";
import type { Ref } from "vue";

import { ref, onMounted, onUnmounted } from "vue";

import { PauseIcon, PlayIcon } from "@heroicons/vue/24/outline";
import WaveSurfer from "wavesurfer.js";
import Spinner from "@/components/ui/utils/Spinner.vue";

const props = defineProps<{
    recording: IRecording;
    self?: boolean;
}>();

const wavesurfer: Ref<any> = ref(null);
const playing = ref(false);
const loading = ref(true);

// (event) turns the audio on/off
const handleTogglePlay = () => {
    if (wavesurfer.value) {
        if (playing.value) {
            playing.value = false;
            wavesurfer.value.pause();
        } else {
            playing.value = true;
            wavesurfer.value.play();
        }
    }
};

// when mounted load the audio
onMounted(() => {
    const waveform: HTMLElement | null = document.querySelector(
        "#waveform-" + props.recording.id,
    );

    if (waveform) {
        wavesurfer.value = WaveSurfer.create({
            container: waveform,
            waveColor: "rgb(209 213 219)",
            progressColor: "rgb(165 180 252)",
            cursorColor: "transparent",
            barWidth: 1,
            barRadius: 1,
            cursorWidth: 1,
            height: 30,
            barGap: 4,
        });

        // load the audio
        wavesurfer.value.load(props.recording.src);

        wavesurfer.value.on("ready", function () {
            loading.value = false;
        });
    }
});

// when the component is unmounted stop thr audio
onUnmounted(() => {
    wavesurfer.value.pause();
});
</script>

<template>
    <!--loading indicator-->
    <div class="flex items-center outline-none" tabindex="0" aria-label="audio message">
        <div v-if="loading"
            class="p-4 mr-4 flex justify-center items-center rounded-[.75rem] outline-none transition-all duration-200 bg-indigo-300 active:bg-indigo-400">
            <Spinner />
        </div>

        <!--play/pause button-->
        <button v-else @click="handleTogglePlay"
            class="p-4 mr-4 flex justify-center items-center rounded-[.75rem] outline-none transition-all duration-200 bg-indigo-300 active:bg-indigo-400"
            :aria-label="playing ? 'pause' : 'play'">
            <PauseIcon v-if="playing" class="w-5 h-5 text-white" />
            <PlayIcon v-else class="w-5 h-5 text-white" />
        </button>

        <!--audio waveform-->
        <div class="w-full mr-4 relative flex items-center">
            <div :id="'waveform-' + props.recording.id" class="w-37.5"></div>
            <div class="absolute border animate-pulse w-37.5 border-gray-300" v-show="loading"></div>
        </div>

        <p class="body-1 text-black dark:text-white opacity-40 dark:opacity-70" tabindex="0" aria-label="11 seconds">
            00:11
        </p>
    </div>
</template>
