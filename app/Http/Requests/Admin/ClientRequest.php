<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:180'],
            'display_name' => ['nullable', 'string', 'max:180'],
            'pic_name' => ['nullable', 'string', 'max:150'],
            'pic_position' => ['nullable', 'string', 'max:100'],
            'pic_email' => ['nullable', 'email', 'max:150'],
            'pic_phone' => ['nullable', 'string', 'max:30'],
            'pic_whatsapp' => ['nullable', 'string', 'max:30'],
            'company_email' => ['nullable', 'email', 'max:150'],
            'company_phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(['active', 'inactive', 'prospect', 'suspended'])],
            'notes' => ['nullable', 'string'],

            'users' => ['sometimes', 'array'],
            'users.*.id' => ['nullable', 'integer', 'exists:users,id'],
            'users.*.name' => ['required', 'string', 'max:150'],
            'users.*.email' => [
                'required',
                'email',
                'max:150',
                'distinct',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $index = str($attribute)->between('users.', '.email')->toString();
                    $userId = $this->input("users.$index.id");

                    $exists = User::query()
                        ->where('email', $value)
                        ->when($userId, fn ($query) => $query->whereKeyNot($userId))
                        ->exists();

                    if ($exists) {
                        $fail('The email has already been taken.');
                    }
                },
            ],
            'users.*.password' => ['nullable', 'string', 'min:8'],
            'users.*.phone' => ['nullable', 'string', 'max:30'],
            'users.*.is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                foreach ($this->input('users', []) as $index => $user) {
                    if (empty($user['id']) && empty($user['password'])) {
                        $validator->errors()->add(
                            "users.$index.password",
                            'The password field is required for new users.',
                        );
                    }
                }
            },
        ];
    }
}
