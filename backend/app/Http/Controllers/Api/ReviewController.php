<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request): JsonResponse
    {
        $review = Review::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Review submitted.',
            'data'    => $review->load('user'),
        ], 201);
    }

    public function byProtocol(int $protocolId): JsonResponse
    {
        $reviews = Review::with('user')
            ->where('protocol_id', $protocolId)
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data'   => $reviews,
        ]);
    }
}
