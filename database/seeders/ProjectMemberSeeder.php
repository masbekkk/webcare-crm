<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ProjectMemberSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->members() as $projectSlug => $members) {
            $project = Project::query()->where('slug', $projectSlug)->firstOrFail();

            foreach ($members as $member) {
                $user = User::query()->where('email', $member['email'])->firstOrFail();

                ProjectMember::updateOrCreate(
                    [
                        'project_id' => $project->id,
                        'user_id' => $user->id,
                    ],
                    [
                        'role' => $member['role'],
                        'assigned_at' => Carbon::parse($project->start_date)->addDay()->setTime(9, 0),
                    ],
                );
            }
        }
    }

    /**
     * @return array<string, array<int, array<string, string>>>
     */
    private function members(): array
    {
        return [
            'kopi-senja-company-profile' => [
                ['email' => 'rani@webcare.test', 'role' => 'Project Manager'],
                ['email' => 'dimas@webcare.test', 'role' => 'Fullstack Developer'],
                ['email' => 'portal@kopisenja.test', 'role' => 'Client Reviewer'],
            ],
            'alika-fashion-ecommerce' => [
                ['email' => 'rani@webcare.test', 'role' => 'Project Manager'],
                ['email' => 'dimas@webcare.test', 'role' => 'Lead Developer'],
                ['email' => 'sinta@webcare.test', 'role' => 'QA Support'],
                ['email' => 'portal@alikafashion.test', 'role' => 'Client Product Owner'],
            ],
            'medika-pratama-booking-system' => [
                ['email' => 'rani@webcare.test', 'role' => 'Project Manager'],
                ['email' => 'dimas@webcare.test', 'role' => 'Backend Developer'],
                ['email' => 'sinta@webcare.test', 'role' => 'UAT Coordinator'],
                ['email' => 'portal@medikapratama.test', 'role' => 'Clinic Admin Reviewer'],
            ],
        ];
    }
}
