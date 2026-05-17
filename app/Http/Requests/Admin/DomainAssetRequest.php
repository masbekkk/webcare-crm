<?php

namespace App\Http\Requests\Admin;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class DomainAssetRequest extends FormRequest
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
            'domain_name' => ['required', 'string', 'max:180'],
            'registrar' => ['nullable', 'string', 'max:150'],
            'registered_at' => ['nullable', 'date'],
            'expired_at' => ['nullable', 'date'],
            'auto_renew' => ['sometimes', 'boolean'],
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
