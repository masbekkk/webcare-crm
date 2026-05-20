<?php

namespace App\Http\Requests\Admin;

use App\Models\ProjectLink;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class WebsiteMonitorRequest extends FormRequest
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
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'project_link_id' => ['nullable', 'integer', 'exists:project_links,id'],
            'name' => ['required', 'string', 'max:150'],
            'url' => ['required', 'url', 'max:255'],
            'method' => ['required', Rule::in(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'])],
            'expected_status_code' => ['required', 'integer', 'min:100', 'max:599'],
            'timeout_seconds' => ['required', 'integer', 'min:1', 'max:120'],
            'check_interval_seconds' => ['required', 'integer', 'min:30', 'max:86400'],
            'is_active' => ['sometimes', 'boolean'],
            'current_status' => ['required', Rule::in(['unknown', 'up', 'down', 'degraded'])],
            'last_status_code' => ['nullable', 'integer', 'min:100', 'max:599'],
            'last_response_time_ms' => ['nullable', 'integer', 'min:0'],
            'last_checked_at' => ['nullable', 'date'],
            'last_down_at' => ['nullable', 'date'],
            'last_recovered_at' => ['nullable', 'date'],
            'consecutive_failures' => ['required', 'integer', 'min:0'],
            'consecutive_successes' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $projectLinkId = $this->integer('project_link_id');

                if (! $projectLinkId) {
                    return;
                }

                $belongsToProject = ProjectLink::query()
                    ->whereKey($projectLinkId)
                    ->where('project_id', $this->integer('project_id'))
                    ->exists();

                if (! $belongsToProject) {
                    $validator->errors()->add('project_link_id', 'The selected project link must belong to the selected project.');
                }
            },
        ];
    }
}
