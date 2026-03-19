<?php

namespace App\Providers;

use App\Services\TypesenseService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        try {
            $this->app->make(TypesenseService::class)->ensureCollections();
        } catch (\Exception $e) {
            \Log::warning('Typesense collection bootstrap failed: ' . $e->getMessage());
        }
    }
}
