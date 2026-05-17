<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class WebsiteIncidentIndexRequest extends FormRequest
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
            'started_from' => ['nullable', 'date'],
            'started_to' => ['nullable', 'date'],
        ];
    }
}
