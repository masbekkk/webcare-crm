<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class WebsiteCheckLogIndexRequest extends FormRequest
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
            'search' => ['nullable', 'string', 'max:180'],
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'monitor_id' => ['nullable', 'integer', 'exists:website_monitors,id'],
            'status' => ['nullable', 'string', 'max:80'],
            'is_success' => ['nullable', 'boolean'],
            'checked_from' => ['nullable', 'date'],
            'checked_to' => ['nullable', 'date'],
        ];
    }
}
