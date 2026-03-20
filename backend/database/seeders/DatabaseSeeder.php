<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Protocol;
use App\Models\Review;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create 10 users
        $users = User::factory(10)->create();

        // Create 12 protocols
        $protocols = Protocol::factory(12)->recycle($users)->create();

        // Create 10 threads spread across protocols
        $threads = Thread::factory(10)->recycle($users)->recycle($protocols)->create();

        // Create ~4 comments per thread (mix of top-level and replies)
        $threads->each(function (Thread $thread) use ($users) {
            $topComments = Comment::factory(3)
                ->recycle($users)
                ->create(['thread_id' => $thread->id, 'parent_id' => null]);

            // Add replies to each top-level comment
            $topComments->each(function (Comment $comment) use ($users, $thread) {
                Comment::factory(2)
                    ->recycle($users)
                    ->create([
                        'thread_id' => $thread->id,
                        'parent_id' => $comment->id,
                    ]);
            });
        });

        // Create 2–4 reviews per protocol
        $protocols->each(function (Protocol $protocol) use ($users) {
            $reviewers = $users->random(rand(2, 4));
            foreach ($reviewers as $user) {
                Review::factory()->create([
                    'protocol_id' => $protocol->id,
                    'user_id'     => $user->id,
                ]);
            }
        });

        // Create votes on protocols
        $protocols->each(function (Protocol $protocol) use ($users) {
            $voters = $users->random(rand(3, 7));
            foreach ($voters as $user) {
                Vote::create([
                    'user_id'      => $user->id,
                    'votable_id'   => $protocol->id,
                    'votable_type' => 'App\\Models\\Protocol',
                    'value'        => fake()->randomElement([1, -1]),
                ]);
            }
        });

        // Create votes on threads
        $threads->each(function (Thread $thread) use ($users) {
            $voters = $users->random(rand(2, 6));
            foreach ($voters as $user) {
                Vote::create([
                    'user_id'      => $user->id,
                    'votable_id'   => $thread->id,
                    'votable_type' => 'App\\Models\\Thread',
                    'value'        => fake()->randomElement([1, -1]),
                ]);
            }
        });

        // Create votes on comments (top-level only to keep seeder light)
        Comment::whereNull('parent_id')->get()->each(function (Comment $comment) use ($users) {
            $voters = $users->random(rand(1, 4));
            foreach ($voters as $user) {
                Vote::create([
                    'user_id'      => $user->id,
                    'votable_id'   => $comment->id,
                    'votable_type' => 'App\\Models\\Comment',
                    'value'        => fake()->randomElement([1, -1]),
                ]);
            }
        });
    }
}
