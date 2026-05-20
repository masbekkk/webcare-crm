<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentTimelineIndexRequest extends FormRequest
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
            'type' => ['nullable', Rule::in(['dp', 'installment', 'final_payment', 'monthly_subscription', 'yearly_subscription', 'trial', 'maintenance_fee', 'domain_fee', 'hosting_fee', 'server_fee', 'revision_fee', 'feature_addition_fee', 'custom'])],
            'status' => ['nullable', Rule::in(['planned', 'waiting', 'partially_paid', 'paid', 'overdue', 'cancelled'])],
            'payment_method' => ['nullable', Rule::in(['bank_transfer', 'cash', 'e_wallet', 'payment_gateway', 'other'])],
            'due_from' => ['nullable', 'date'],
            'due_to' => ['nullable', 'date'],
            'paid_from' => ['nullable', 'date'],
            'paid_to' => ['nullable', 'date'],
            'billing_from' => ['nullable', 'date'],
            'billing_to' => ['nullable', 'date'],
            'is_additional_charge' => ['nullable', 'boolean'],
            'sort' => ['nullable', Rule::in(['client', 'due_date', 'planned_amount'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
        ];
    }
}
