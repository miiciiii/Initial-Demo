<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreThreadRequest;
use App\Http\Requests\UpdateThreadRequest;
use App\Models\Thread;
use App\Services\TypesenseService;
use Illuminate\Http\JsonResponse;

class ThreadController extends Controller
{
    public function __construct(private TypesenseService $typesense) {}

    public function show(Thread $thread): JsonResponse
    {
        $thread->load('user', 'protocol', 'votes');
        $thread->loadCount('comments');

        return response()->json([
            'status' => 'success',
            'data' => array_merge($thread->toArray(), [
                'vote_score' => (int) $thread->votes->sum('value'),
                'user_vote'  => auth()->check()
                    ? optional($thread->votes->firstWhere('user_id', auth()->id()))->value
                    : null,
            ]),
        ]);
    }

    public function store(StoreThreadRequest $request): JsonResponse
    {
        $thread = Thread::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        $this->typesense->indexThread($thread);

        return response()->json([
            'status' => 'success',
            'message' => 'Thread created.',
            'data' => $thread->load('user', 'protocol'),
        ], 201);
    }

    public function update(UpdateThreadRequest $request, Thread $thread): JsonResponse
    {
        $thread->update($request->validated());
        $this->typesense->indexThread($thread->fresh());

        return response()->json([
            'status' => 'success',
            'message' => 'Thread updated.',
            'data' => $thread->fresh()->load('user', 'protocol'),
        ]);
    }

    public function destroy(Thread $thread): JsonResponse
    {
        $this->typesense->deleteThread($thread->id);
        $thread->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Thread deleted.',
        ]);
    }
}
