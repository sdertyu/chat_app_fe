<script setup lang="ts">
import { attachments } from "@/stores/defaults";

import Attachment from "@/components/shared/modals/AttachmentsModal/Attachment.vue";
import Button from "@/components/ui/inputs/Button.vue";
import LabeledTextInput from "@/components/ui/inputs/LabeledTextInput.vue";
import Modal from "@/components/ui/utils/Modal.vue";
import ScrollBox from "@/components/ui/utils/ScrollBox.vue";

const props = defineProps<{
    open: boolean;
    closeModal: () => void;
}>();
</script>

<template>
    <Modal :open="props.open" :close-modal="props.closeModal">
        <template v-slot:content>
            <div class="w-100 bg-white dark:bg-gray-800 rounded py-6">
                <!--attachments list-->
                <ScrollBox class="max-h-35 overflow-y-scroll">
                    <Attachment v-for="(attachment, index) in attachments" :attachment="attachment" :key="index" />
                </ScrollBox>

                <!--Caption input-->
                <div class="px-5 py-6">
                    <LabeledTextInput placeholder="Caption" type="text" />
                </div>

                <!--Action buttons-->
                <div class="flex w-full px-5">
                    <div class="grow flex justify-start">
                        <Button class="ghost-primary ghost-text"> Add </Button>
                    </div>

                    <Button class="ghost-primary ghost-text mr-4" @click="props.closeModal">
                        Cancel
                    </Button>

                    <Button class="contained-primary contained-text"> Send </Button>
                </div>
            </div>
        </template>
    </Modal>
</template>
