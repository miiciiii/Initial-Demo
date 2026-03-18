<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request): JsonResponse
    {
        $comment = Comment::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Comment created.',
            'data' => $comment->load('user'),
        ], 201);
    }

    public function byThread(int $threadId): JsonResponse
    {
        $comments = Comment::with('user', 'votes', 'replies')
            ->whereNull('parent_id')
            ->where('thread_id', $threadId)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $comments,
        ]);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        $comment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Comment deleted.',
        ]);
    }
}
