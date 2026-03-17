<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Protocol;
use App\Models\Review;
use App\Services\TypesenseService;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function __construct(private TypesenseService $typesense) {}

    public function store(StoreReviewRequest $request): JsonResponse
    {
        $review = Review::create([
            ...$request->validated(),
            'user_id' => 1, // TODO: replace with auth()->id()
        ]);

        $protocol = Protocol::find($review->protocol_id);
        $protocol->recalculateRating();
        $this->typesense->indexProtocol($protocol->fresh());

        return response()->json([
            'status' => 'success',
            'message' => 'Review submitted.',
            'data' => $review->load('user'),
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
            'data' => $reviews,
        ]);
    }
}
