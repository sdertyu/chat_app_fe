<template>
    <div class="d-flex align-items-center justify-content-center" style="height: 100vh;">
        <div class="card p-4 shadow-lg bg-white rounded-md" style="width: 50%">
            <h2 class="text-center">Đăng nhập</h2>
            <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" :validateOnValueUpdate="false"
                :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
                <div class="mb-3">
                    <InputText name="username" type="email" placeholder="Email" fluid />
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
                <div class="d-flex justify-content-center"><Button type="submit" class="px-5" severity="primary"
                        label="Submit" /></div>

            </Form>
            <p class="text-center mt-3">Chưa có tài khoản, <router-link to="/signup">Đăng ký</router-link></p>
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
import axios_auth from '@/plugins/axios_auth';
import router from '@/router';

interface FormValues {
    username: string;
    password: string;
}

interface FormErrors {
    [key: string]: { message: string }[];
}

interface ResolverResult {
    errors: FormErrors;
}

const toast = useToast();

const initialValues = ref<FormValues>({
    username: '',
    password: ''
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


const onFormSubmit = async (event: any) => {
    if (event.valid) {
        const formData = new FormData();
        formData.append('email', event.states.username.value);
        formData.append('password', event.states.password.value);
        try {
            const login = await axios_auth.post('auth/login', formData)
            if (login.status === 201) {
                console.log(login.data.user);
                localStorage.setItem('userId', login.data.user.id);
                localStorage.setItem('userName', login.data.user.lastName);
                router.push('/');
            }
        } catch (error: any) {
            console.log(error.response);
            console.log(error.response.data.message);
            if (error.response) {
                const errorMessage = error.response.data.message || 'Đăng nhập thất bại';
                toast.add({ severity: 'error', summary: 'Lỗi', detail: errorMessage, life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã xảy ra lỗi không xác định', life: 3000 });
            }
        }

    }
};

</script>

<style scoped>
.p-toast {
    z-index: 9999 !important;
}
</style>