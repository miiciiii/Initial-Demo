<?php

use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProtocolController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ThreadController;
use App\Http\Controllers\Api\VoteController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Protocols
    Route::apiResource('protocols', ProtocolController::class);

    // Threads
    Route::get('threads/{thread}', [ThreadController::class, 'show']);
    Route::post('threads', [ThreadController::class, 'store']);
    Route::put('threads/{thread}', [ThreadController::class, 'update']);
    Route::delete('threads/{thread}', [ThreadController::class, 'destroy']);

    // Comments
    Route::post('comments', [CommentController::class, 'store']);
    Route::get('comments/thread/{thread_id}', [CommentController::class, 'byThread']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    // Reviews
    Route::post('reviews', [ReviewController::class, 'store']);
    Route::get('reviews/protocol/{protocol_id}', [ReviewController::class, 'byProtocol']);

    // Votes
    Route::post('votes', [VoteController::class, 'store']);

    // Search
    Route::get('search', [SearchController::class, 'search']);
});
