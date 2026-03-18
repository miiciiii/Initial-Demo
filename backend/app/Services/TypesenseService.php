<?php

namespace App\Services;

use Typesense\Client;
use App\Models\Protocol;
use App\Models\Thread;

class TypesenseService
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'api_key' => config('typesense.api_key'),
            'nodes'   => [[
                'host'     => config('typesense.host'),
                'port'     => config('typesense.port'),
                'protocol' => config('typesense.protocol'),
            ]],
            'connection_timeout_seconds' => 2,
        ]);
    }

    public function ensureCollections(): void
    {
        $this->ensureProtocolsCollection();
        $this->ensureThreadsCollection();
    }

    private function ensureProtocolsCollection(): void
    {
        try {
            $this->client->collections['protocols']->retrieve();
        } catch (\Exception) {
            $this->client->collections->create([
                'name'   => 'protocols',
                'fields' => [
                    ['name' => 'id',         'type' => 'string'],
                    ['name' => 'title',      'type' => 'string'],
                    ['name' => 'tags',       'type' => 'string[]', 'facet' => true],
                    ['name' => 'votes',      'type' => 'int32'],
                    ['name' => 'created_at', 'type' => 'int64'],
                ],
                'default_sorting_field' => 'created_at',
            ]);
        }
    }

    private function ensureThreadsCollection(): void
    {
        try {
            $this->client->collections['threads']->retrieve();
        } catch (\Exception) {
            $this->client->collections->create([
                'name'   => 'threads',
                'fields' => [
                    ['name' => 'id',         'type' => 'string'],
                    ['name' => 'title',      'type' => 'string'],
                    ['name' => 'body',       'type' => 'string'],
                    ['name' => 'tags',       'type' => 'string[]', 'facet' => true],
                    ['name' => 'votes',      'type' => 'int32'],
                    ['name' => 'created_at', 'type' => 'int64'],
                ],
                'default_sorting_field' => 'created_at',
            ]);
        }
    }

    public function indexProtocol(Protocol $protocol): void
    {
        try {
            $voteScore = $protocol->votes()->sum('value');

            $this->client->collections['protocols']->documents->upsert([
                'id'         => (string) $protocol->id,
                'title'      => $protocol->title,
                'tags'       => $protocol->tags ?? [],
                'votes'      => (int) $voteScore,
                'created_at' => $protocol->created_at->timestamp,
            ]);
        } catch (\Exception $e) {
            \Log::warning('Typesense protocol index failed: ' . $e->getMessage());
        }
    }

    public function deleteProtocol(int $id): void
    {
        try {
            $this->client->collections['protocols']->documents[(string) $id]->delete();
        } catch (\Exception $e) {
            \Log::warning('Typesense protocol delete failed: ' . $e->getMessage());
        }
    }

    public function indexThread(Thread $thread): void
    {
        try {
            $voteScore = $thread->votes()->sum('value');

            $this->client->collections['threads']->documents->upsert([
                'id'         => (string) $thread->id,
                'title'      => $thread->title,
                'body'       => $thread->body,
                'tags'       => $thread->tags ?? [],
                'votes'      => (int) $voteScore,
                'created_at' => $thread->created_at->timestamp,
            ]);
        } catch (\Exception $e) {
            \Log::warning('Typesense thread index failed: ' . $e->getMessage());
        }
    }

    public function deleteThread(int $id): void
    {
        try {
            $this->client->collections['threads']->documents[(string) $id]->delete();
        } catch (\Exception $e) {
            \Log::warning('Typesense thread delete failed: ' . $e->getMessage());
        }
    }

    public function search(string $query, array $tags = [], string $sort = 'recent', ?string $type = null): array
    {
        $sortBy = match ($sort) {
            'upvoted' => 'votes:desc',
            default   => 'created_at:desc',
        };

        $filterBy = '';
        if (!empty($tags)) {
            $filterBy = 'tags:=[' . implode(',', array_map(fn($t) => "`$t`", $tags)) . ']';
        }

        $searchParams = [
            'q'        => $query,
            'query_by' => 'title',
            'sort_by'  => $sortBy,
        ];
        if ($filterBy) {
            $searchParams['filter_by'] = $filterBy;
        }

        $results = [];

        if (!$type || $type === 'protocols') {
            try {
                $r = $this->client->collections['protocols']->documents->search($searchParams);
                $results['protocols'] = $r['hits'] ?? [];
            } catch (\Exception) {
                $results['protocols'] = [];
            }
        }

        if (!$type || $type === 'threads') {
            try {
                $threadParams = array_merge($searchParams, ['query_by' => 'title,body']);
                $r = $this->client->collections['threads']->documents->search($threadParams);
                $results['threads'] = $r['hits'] ?? [];
            } catch (\Exception) {
                $results['threads'] = [];
            }
        }

        return $results;
    }

    public function reindexAll(): array
    {
        // Drop and recreate protocols collection to apply schema changes
        try { $this->client->collections['protocols']->delete(); } catch (\Exception) {}
        try { $this->client->collections['threads']->delete(); } catch (\Exception) {}

        $this->ensureCollections();

        $protocolCount = 0;
        Protocol::chunk(100, function ($protocols) use (&$protocolCount) {
            foreach ($protocols as $protocol) {
                $this->indexProtocol($protocol);
                $protocolCount++;
            }
        });

        $threadCount = 0;
        Thread::with('votes')->chunk(100, function ($threads) use (&$threadCount) {
            foreach ($threads as $thread) {
                $this->indexThread($thread);
                $threadCount++;
            }
        });

        return ['protocols' => $protocolCount, 'threads' => $threadCount];
    }
}
