<?php

namespace App\Events;

use App\Models\ReportYear;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportYearUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public ReportYear $reportYear,
        public ?int $userId = null,
        public ?string $section = null
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('report-years'),
            new PrivateChannel('report-year.' . $this->reportYear->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'reportYear' => [
                'id' => $this->reportYear->id,
                'year' => $this->reportYear->year,
                'title' => $this->reportYear->title,
                'description' => $this->reportYear->description,
                'status' => $this->reportYear->status,
                'publishedAt' => $this->reportYear->published_at?->toIso8601String(),
            ],
            'userId' => $this->userId,
            'section' => $this->section,
        ];
    }
}
