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
            ->withSum('reviews', 'rating');

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
            'rated'    => $query->orderByDesc('rating'),
            'upvoted'  => $query->orderByDesc(
                \DB::table('votes')
                    ->selectRaw('COALESCE(SUM(value), 0)')
                    ->join('threads', 'threads.id', '=', 'votes.votable_id')
                    ->whereColumn('threads.protocol_id', 'protocols.id')
                    ->where('votes.votable_type', 'App\\Models\\Thread')
            ),
            default    => $query->latest(),
        };

        $protocols = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'status' => 'success',
            'data' => $protocols,
        ]);
    }

    public function show(Protocol $protocol): JsonResponse
    {
        $protocol->load('user', 'threads.user', 'reviews.user');
        $protocol->loadCount('reviews', 'threads');

        return response()->json([
            'status' => 'success',
            'data' => $protocol,
        ]);
    }

    public function store(StoreProtocolRequest $request): JsonResponse
    {
        $protocol = Protocol::create([
            ...$request->validated(),
            'user_id' => 1, // TODO: replace with auth()->id() when auth is added
        ]);

        $this->typesense->indexProtocol($protocol);

        return response()->json([
            'status' => 'success',
            'message' => 'Protocol created.',
            'data' => $protocol->load('user'),
        ], 201);
    }

    public function update(UpdateProtocolRequest $request, Protocol $protocol): JsonResponse
    {
        $protocol->update($request->validated());
        $this->typesense->indexProtocol($protocol->fresh());

        return response()->json([
            'status' => 'success',
            'message' => 'Protocol updated.',
            'data' => $protocol->fresh()->load('user'),
        ]);
    }

    public function destroy(Protocol $protocol): JsonResponse
    {
        $this->typesense->deleteProtocol($protocol->id);
        $protocol->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Protocol deleted.',
        ], 200);
    }
}
