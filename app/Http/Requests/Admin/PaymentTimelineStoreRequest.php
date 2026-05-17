<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentTimelineStoreRequest extends FormRequest
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
            'project_id' => [
                'required',
                'integer',
                Rule::exists('projects', 'id')->where('client_id', $this->integer('client_id')),
            ],
            'type' => ['required', Rule::in(['dp', 'installment', 'final_payment', 'monthly_subscription', 'yearly_subscription', 'trial', 'maintenance_fee', 'domain_fee', 'hosting_fee', 'server_fee', 'revision_fee', 'feature_addition_fee', 'custom'])],
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'sequence_order' => ['required', 'integer', 'min:1'],
            'percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'planned_amount' => ['required', 'numeric', 'min:0'],
            'paid_amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'paid_at' => ['nullable', 'date'],
            'billing_period_start' => ['nullable', 'date'],
            'billing_period_end' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['planned', 'waiting', 'partially_paid', 'paid', 'overdue', 'cancelled'])],
            'payment_method' => ['nullable', Rule::in(['bank_transfer', 'cash', 'e_wallet', 'payment_gateway', 'other'])],
            'reference_number' => ['nullable', 'string', 'max:150'],
            'reminder_days_before' => ['nullable', 'integer', 'min:0'],
            'is_additional_charge' => ['sometimes', 'boolean'],
            'admin_notes' => ['nullable', 'string'],
            'client_notes' => ['nullable', 'string'],
        ];
    }
}
