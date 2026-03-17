<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoteRequest;
use App\Models\Vote;
use App\Services\TypesenseService;
use Illuminate\Http\JsonResponse;

class VoteController extends Controller
{
    public function __construct(private TypesenseService $typesense) {}

    public function store(StoreVoteRequest $request): JsonResponse
    {
        $userId = 1; // TODO: replace with auth()->id()
        $morphMap = ['thread' => 'App\\Models\\Thread', 'comment' => 'App\\Models\\Comment'];
        $votableType = $morphMap[$request->votable_type];

        $existing = Vote::where([
            'user_id' => $userId,
            'votable_id' => $request->votable_id,
            'votable_type' => $votableType,
        ])->first();

        if ($existing) {
            if ($existing->value === $request->value) {
                $existing->delete();
                $message = 'Vote removed.';
            } else {
                $existing->update(['value' => $request->value]);
                $message = 'Vote updated.';
            }
        } else {
            Vote::create([
                'user_id' => $userId,
                'votable_id' => $request->votable_id,
                'votable_type' => $votableType,
                'value' => $request->value,
            ]);
            $message = 'Vote cast.';
        }

        $score = Vote::where([
            'votable_id' => $request->votable_id,
            'votable_type' => $votableType,
        ])->sum('value');

        if ($request->votable_type === 'thread') {
            $thread = \App\Models\Thread::find($request->votable_id);
            if ($thread) $this->typesense->indexThread($thread);
        }

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => ['score' => $score],
        ]);
    }
}
