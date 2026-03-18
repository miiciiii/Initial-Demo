<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProtocolRequest;
use App\Http\Requests\UpdateProtocolRequest;
use App\Models\Protocol;
use App\Services\TypesenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProtocolController extends Controller
{
    public function __construct(private TypesenseService $typesense) {}

    public function index(Request $request): JsonResponse
    {
        $query = Protocol::with('user')
            ->withCount('reviews', 'threads')
            ->withSum('votes', 'value');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('tags')) {
            $tags = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
            foreach ($tags as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        }

        $sort = $request->get('sort', 'recent');
        match ($sort) {
            'reviewed' => $query->orderByDesc('reviews_count'),
            'upvoted'  => $query->orderByDesc(
                \DB::table('votes')
                    ->selectRaw('COALESCE(SUM(value), 0)')
                    ->whereColumn('votable_id', 'protocols.id')
                    ->where('votable_type', 'App\\Models\\Protocol')
            ),
            default    => $query->latest(),
        };

        $protocols = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'status' => 'success',
            'data'   => $protocols,
        ]);
    }

    public function show(Protocol $protocol): JsonResponse
    {
        $protocol->load('user', 'threads.user', 'reviews.user', 'votes');
        $protocol->loadCount('reviews', 'threads');

        return response()->json([
            'status' => 'success',
            'data'   => array_merge($protocol->toArray(), [
                'vote_score' => (int) $protocol->votes->sum('value'),
                'user_vote'  => auth()->check()
                    ? optional($protocol->votes->firstWhere('user_id', auth()->id()))->value
                    : null,
            ]),
        ]);
    }

    public function store(StoreProtocolRequest $request): JsonResponse
    {
        $protocol = Protocol::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        $this->typesense->indexProtocol($protocol);

        return response()->json([
            'status'  => 'success',
            'message' => 'Protocol created.',
            'data'    => $protocol->load('user'),
        ], 201);
    }

    public function update(UpdateProtocolRequest $request, Protocol $protocol): JsonResponse
    {
        $protocol->update($request->validated());
        $this->typesense->indexProtocol($protocol->fresh());

        return response()->json([
            'status'  => 'success',
            'message' => 'Protocol updated.',
            'data'    => $protocol->fresh()->load('user'),
        ]);
    }

    public function destroy(Protocol $protocol): JsonResponse
    {
        $this->typesense->deleteProtocol($protocol->id);
        $protocol->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Protocol deleted.',
        ]);
    }
}
