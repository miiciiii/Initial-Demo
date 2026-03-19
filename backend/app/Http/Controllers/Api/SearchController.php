<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TypesenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(private TypesenseService $typesense) {}

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:1',
            'tags' => 'nullable|string',
            'sort' => 'nullable|string|in:recent,upvoted',
            'type' => 'nullable|string|in:protocols,threads',
        ]);

        $results = $this->typesense->search(
            query: $request->q,
            tags: $request->tags ? explode(',', $request->tags) : [],
            sort: $request->get('sort', 'recent'),
            type: $request->get('type'),
        );

        return response()->json([
            'status' => 'success',
            'data' => $results,
        ]);
    }
}
