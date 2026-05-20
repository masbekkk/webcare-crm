<?php

namespace App\Services;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, User $creator): Project
    {
        return DB::transaction(function () use ($data, $creator): Project {
            $project = Project::create([
                ...$this->projectAttributes($data),
                'created_by' => $creator->id,
            ]);

            $this->syncRelations($project, $data, $creator);

            return $project->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Project $project, array $data, User $updater): Project
    {
        return DB::transaction(function () use ($project, $data, $updater): Project {
            $project->update($this->projectAttributes($data));
            $this->syncRelations($project, $data, $updater);

            return $project->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function projectAttributes(array $data): array
    {
        return Arr::only($data, [
            'client_id',
            'name',
            'slug',
            'description',
            'project_type',
            'contract_value',
            'payment_model',
            'status',
            'start_date',
            'target_finish_date',
            'live_date',
            'tech_stack',
            'internal_notes',
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function syncRelations(Project $project, array $data, User $user): void
    {
        $project->links()->delete();
        $project->members()->delete();
        $project->paymentTimelines()->delete();

        foreach ($data['links'] ?? [] as $link) {
            $project->links()->create($link);
        }

        foreach ($data['members'] ?? [] as $member) {
            $project->members()->create($member);
        }

        foreach ($data['payment_timelines'] ?? [] as $timeline) {
            $plannedAmount = (float) ($timeline['planned_amount'] ?? 0);
            $paidAmount = (float) ($timeline['paid_amount'] ?? 0);

            $project->paymentTimelines()->create([
                ...$timeline,
                'client_id' => $project->client_id,
                'remaining_amount' => max($plannedAmount - $paidAmount, 0),
                'created_by' => $project->wasRecentlyCreated ? $user->id : ($timeline['created_by'] ?? $user->id),
                'updated_by' => $project->wasRecentlyCreated ? null : $user->id,
            ]);
        }
    }
}
