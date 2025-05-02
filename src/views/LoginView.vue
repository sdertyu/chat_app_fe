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
import Toast from 'primevue/toast';
import axios from 'axios';

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

interface SubmitEvent {
    valid: boolean;
    values: FormValues;
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


const onFormSubmit = (event: any) => {
    if (event.valid) {
        const formData = new FormData();
        formData.append('email', event.states.username.value);
        formData.append('password', event.states.password.value);
        axios.post('http://localhost:3000/auth/login', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status === 201) {
                    console.log(response.data.access_token);
                    console.log(response.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
};

</script>