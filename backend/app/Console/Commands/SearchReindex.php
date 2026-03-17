<?php

namespace App\Console\Commands;

use App\Services\TypesenseService;
use Illuminate\Console\Command;

class SearchReindex extends Command
{
    protected $signature = 'search:reindex';
    protected $description = 'Rebuild the Typesense search index from database records';

    public function handle(TypesenseService $typesense): int
    {
        $this->info('Reindexing...');
        $counts = $typesense->reindexAll();
        $this->info("Indexed {$counts['protocols']} protocols and {$counts['threads']} threads.");
        return self::SUCCESS;
    }
}
