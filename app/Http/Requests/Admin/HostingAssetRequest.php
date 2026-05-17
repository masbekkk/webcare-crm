<?php

namespace App\Http\Requests\Admin;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class HostingAssetRequest extends FormRequest
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
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'provider' => ['required', 'string', 'max:150'],
            'service_name' => ['nullable', 'string', 'max:150'],
            'panel_url' => ['nullable', 'url', 'max:255'],
            'server_ip' => ['nullable', 'string', 'max:100'],
            'start_date' => ['nullable', 'date'],
            'expired_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $projectId = $this->integer('project_id');

                if (! $projectId) {
                    return;
                }

                $projectBelongsToClient = Project::query()
                    ->whereKey($projectId)
                    ->where('client_id', $this->integer('client_id'))
                    ->exists();

                if (! $projectBelongsToClient) {
                    $validator->errors()->add('project_id', 'The selected project must belong to the selected client.');
                }
            },
        ];
    }
}
