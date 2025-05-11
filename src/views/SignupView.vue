<template>
    <div class="d-flex align-items-center justify-content-center" style="height: 100vh;">
        <Toast />

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
                    <InputText name="firstName" type="text" placeholder="Tên" fluid
                        :formControl="{ validateOnValueUpdate: true }" />
                    <Message v-if="$form.firstName?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.firstName.error.message }}
                    </Message>
                </div>
                <input type="file" id="file" name="file" @change="onAdvancedUpload" class="hidden" accept="image/*" />
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
import axios from '@/plugins/axios_auth';

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


const onFormSubmit = (event: any) => {
    if (event.valid) {
        console.log(event);
        const formData = new FormData();
        const values = event.states;
        formData.append('email', values.username.value);
        formData.append('password', values.password.value);
        formData.append('phone', values.phone.value);
        formData.append('firstName', values.firstName.value);
        formData.append('lastName', values.lastName.value);
        formData.append('middleName', values.middleName.value);
        // formData.append('file', initialValues.value.avatar as File); // Cast to any to avoid type error

        if (initialValues.value.avatar) {
            formData.append('file', initialValues.value.avatar);
        }
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }


        axios.post('auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                if (response.status === 201) {
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Registration successful.' });
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Registration failed.' });
                }
            })
            .catch((error) => {
                console.error(error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Registration failed.' });
            });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields.' });
    }
};

const onAdvancedUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files?.[0];

    if (files) {
        initialValues.value.avatar = files;
    }
};

</script>