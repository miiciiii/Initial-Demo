<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProtocolController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ThreadController;
use App\Http\Controllers\Api\VoteController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Auth
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login',    [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me',      [AuthController::class, 'me']);
    });

    // Protocols (public reads, protected writes)
    Route::get('protocols',            [ProtocolController::class, 'index']);
    Route::get('protocols/{protocol}', [ProtocolController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('protocols',              [ProtocolController::class, 'store']);
        Route::put('protocols/{protocol}',    [ProtocolController::class, 'update']);
        Route::delete('protocols/{protocol}', [ProtocolController::class, 'destroy']);
    });

    // Threads (public read, protected writes)
    Route::get('threads/{thread}', [ThreadController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('threads',            [ThreadController::class, 'store']);
        Route::put('threads/{thread}',    [ThreadController::class, 'update']);
        Route::delete('threads/{thread}', [ThreadController::class, 'destroy']);
    });

    // Comments (public read, protected writes)
    Route::get('comments/thread/{thread_id}', [CommentController::class, 'byThread']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('comments',             [CommentController::class, 'store']);
        Route::delete('comments/{comment}', [CommentController::class, 'destroy']);
    });

    // Reviews (public read, protected writes)
    Route::get('reviews/protocol/{protocol_id}', [ReviewController::class, 'byProtocol']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('reviews', [ReviewController::class, 'store']);
    });

    // Votes (protected)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('votes', [VoteController::class, 'store']);
    });

    // Search
    Route::get('search', [SearchController::class, 'search']);
});
