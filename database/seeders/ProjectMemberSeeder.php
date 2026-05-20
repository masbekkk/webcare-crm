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
            'shayda-production-website' => [
                ['email' => 'rani@webcare.test', 'role' => 'Project Manager'],
                ['email' => 'dimas@webcare.test', 'role' => 'Fullstack Developer'],
                ['email' => 'portal@shayda.webcareproject.my.id', 'role' => 'Client Reviewer'],
            ],
            'anemi-production-website' => [
                ['email' => 'rani@webcare.test', 'role' => 'Project Manager'],
                ['email' => 'dimas@webcare.test', 'role' => 'Lead Developer'],
                ['email' => 'sinta@webcare.test', 'role' => 'QA Support'],
                ['email' => 'portal@anemi.webcareproject.my.id', 'role' => 'Client Product Owner'],
            ],
            'webcare-intern-portal' => [
                ['email' => 'rani@webcare.test', 'role' => 'Project Manager'],
                ['email' => 'dimas@webcare.test', 'role' => 'Backend Developer'],
                ['email' => 'sinta@webcare.test', 'role' => 'UAT Coordinator'],
                ['email' => 'portal@intern.webcareproject.my.id', 'role' => 'Internal Reviewer'],
            ],
        ];
    }
}
