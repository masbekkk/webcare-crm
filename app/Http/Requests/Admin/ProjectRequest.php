<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
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
        $projectId = $this->route('project')?->id;

        return [
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'name' => ['required', 'string', 'max:180'],
            'slug' => ['required', 'string', 'max:200', Rule::unique('projects', 'slug')->ignore($projectId)],
            'description' => ['nullable', 'string'],
            'project_type' => ['required', 'string', 'max:100'],
            'contract_value' => ['required', 'numeric', 'min:0'],
            'payment_model' => ['required', Rule::in(['one_time', 'subscription', 'custom'])],
            'status' => ['required', Rule::in(['draft', 'planning', 'development', 'testing', 'live', 'maintenance', 'paused', 'completed', 'cancelled'])],
            'start_date' => ['nullable', 'date'],
            'target_finish_date' => ['nullable', 'date'],
            'live_date' => ['nullable', 'date'],
            'tech_stack' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],

            'links' => ['sometimes', 'array'],
            'links.*.type' => ['required', Rule::in(['production', 'staging', 'repository', 'admin_panel', 'api', 'database_panel', 'hosting_panel', 'figma', 'documentation', 'other'])],
            'links.*.label' => ['required', 'string', 'max:150'],
            'links.*.url' => ['required', 'url', 'max:255'],
            'links.*.username' => ['nullable', 'string', 'max:150'],
            'links.*.notes' => ['nullable', 'string'],
            'links.*.is_primary' => ['sometimes', 'boolean'],
            'links.*.is_active' => ['sometimes', 'boolean'],

            'members' => ['sometimes', 'array'],
            'members.*.user_id' => ['required', 'integer', 'exists:users,id', 'distinct'],
            'members.*.role' => ['nullable', 'string', 'max:100'],
            'members.*.assigned_at' => ['nullable', 'date'],

            'payment_timelines' => ['sometimes', 'array'],
            'payment_timelines.*.type' => ['required', Rule::in(['dp', 'installment', 'final_payment', 'monthly_subscription', 'yearly_subscription', 'trial', 'maintenance_fee', 'domain_fee', 'hosting_fee', 'server_fee', 'revision_fee', 'feature_addition_fee', 'custom'])],
            'payment_timelines.*.title' => ['required', 'string', 'max:180'],
            'payment_timelines.*.description' => ['nullable', 'string'],
            'payment_timelines.*.sequence_order' => ['required', 'integer', 'min:1'],
            'payment_timelines.*.percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'payment_timelines.*.planned_amount' => ['required', 'numeric', 'min:0'],
            'payment_timelines.*.paid_amount' => ['required', 'numeric', 'min:0'],
            'payment_timelines.*.due_date' => ['nullable', 'date'],
            'payment_timelines.*.paid_at' => ['nullable', 'date'],
            'payment_timelines.*.billing_period_start' => ['nullable', 'date'],
            'payment_timelines.*.billing_period_end' => ['nullable', 'date'],
            'payment_timelines.*.status' => ['required', Rule::in(['planned', 'waiting', 'partially_paid', 'paid', 'overdue', 'cancelled'])],
            'payment_timelines.*.payment_method' => ['nullable', Rule::in(['bank_transfer', 'cash', 'e_wallet', 'payment_gateway', 'other'])],
            'payment_timelines.*.reference_number' => ['nullable', 'string', 'max:150'],
            'payment_timelines.*.proof_file' => ['nullable', 'string', 'max:255'],
            'payment_timelines.*.reminder_days_before' => ['nullable', 'integer', 'min:0'],
            'payment_timelines.*.is_additional_charge' => ['sometimes', 'boolean'],
            'payment_timelines.*.admin_notes' => ['nullable', 'string'],
            'payment_timelines.*.client_notes' => ['nullable', 'string'],
        ];
    }
}
