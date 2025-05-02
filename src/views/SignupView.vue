<template>
    <div class="d-flex align-items-center justify-content-center" style="height: 100vh;">

        <div class="card p-4 shadow-lg bg-white rounded-md" style="width: 50%">
            <h2 class="text-center">Đăng ký</h2>
            <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" :validateOnValueUpdate="false"
                :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
                <div class="mb-3">
                    <InputText name="username" type="text" placeholder="Email" fluid />
                    <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.username.error.message }}
                    </Message>
                </div>
                <div class="mb-3">
                    <InputText name="password" type="password" placeholder="Mật khẩu" fluid
                        :formControl="{ validateOnValueUpdate: true }" />
                    <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.password.error.message }}
                    </Message>
                </div>
                <div class="mb-3">
                    <InputText name="phone" type="number" placeholder="Số điện thoại" fluid
                        :formControl="{ validateOnValueUpdate: true }" />
                    <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.phone.error.message }}
                    </Message>
                </div>
                <div class="mb-3">
                    <InputText name="lastName" type="text" placeholder="Họ" fluid
                        :formControl="{ validateOnValueUpdate: true }" />
                    <Message v-if="$form.lastName?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.lastName.error.message }}
                    </Message>
                </div>
                <div class="mb-3">
                    <InputText name="middleName" type="text" placeholder="Tên đệm" fluid
                        :formControl="{ validateOnValueUpdate: true }" />
                    <Message v-if="$form.middleName?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.middleName.error.message }}
                    </Message>
                </div>
                <div class="mb-3">
                    <InputText name="lastName" type="text" placeholder="Tên" fluid
                        :formControl="{ validateOnValueUpdate: true }" />
                    <Message v-if="$form.lastName?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.lastName.error.message }}
                    </Message>
                </div>
                <FileUpload name="avatar" url="/api/upload" @upload="onAdvancedUpload($event)" 
                    accept="image/*" :maxFileSize="1000000">
                    <template #empty>
                        <span>Drag and drop files to here to upload.</span>
                    </template>
                </FileUpload>

                <div class="d-flex justify-content-center"><Button type="submit" class="px-5" severity="primary"
                        label="Submit" /></div>

            </Form>
            <p class="text-center mt-3">Chưa có tài khoản, <router-link to="/login">Đăng nhập</router-link></p>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import FileUpload from 'primevue/fileupload';

interface FormValues {
    username: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    middleName: string;
    avatar: File | null;
}

interface FormErrors {
    [key: string]: { message: string }[];
}

interface ResolverResult {
    errors: FormErrors;
}

interface SubmitEvent {
    valid: boolean;
    values?: FormValues;
}

const toast = useToast();

const initialValues = ref<FormValues>({
    username: '',
    password: '',
    phone: '',
    firstName: '',
    lastName: '',
    middleName: '',
    avatar: null
});
const resolver = (e: { values: Record<string, any> }): ResolverResult => {
    const values = e.values as FormValues;
    const errors: FormErrors = {};

    if (!values.username) {
        errors.username = [{ message: 'Username is required.' }];
    }

    if (!values.password) {
        errors.password = [{ message: 'Password is required.' }];
    }

    return {
        errors
    };
};


const onFormSubmit = (event: { valid: boolean; values?: Record<string, any> }) => {
    if (event.valid) {
        const values = event.values as FormValues;

        toast.add({
            severity: 'success',
            summary: 'Form is submitted.',
            life: 3000
        });

        console.log('Form values:', values);
    }
};

const onAdvancedUpload = (event: { files: File | File[] }) => {
    const files = event.files as File[];
    initialValues.value.avatar = files[0] || null; // Assuming you want to store the first file
};

</script>