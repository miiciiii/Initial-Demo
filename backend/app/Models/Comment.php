<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'thread_id',
        'user_id',
        'parent_id',
        'body',
    ];

    protected $appends = ['vote_score', 'user_vote'];

    public function thread(): BelongsTo
    {
        return $this->belongsTo(Thread::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('replies', 'user', 'votes');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    public function voteScore(): int
    {
        return $this->votes()->sum('value');
    }

    public function getVoteScoreAttribute(): int
    {
        if ($this->relationLoaded('votes')) {
            return (int) $this->votes->sum('value');
        }
        return (int) $this->votes()->sum('value');
    }

    public function getUserVoteAttribute(): ?int
    {
        if (!auth()->check() || !$this->relationLoaded('votes')) {
            return null;
        }
        return optional($this->votes->firstWhere('user_id', auth()->id()))->value;
    }
}
