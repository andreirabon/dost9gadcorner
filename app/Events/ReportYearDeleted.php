<?php

namespace App\Events;

use App\Models\ReportYear;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportYearDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $reportYearId
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('report-years'),
            new PrivateChannel('report-year.' . $this->reportYearId),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->reportYearId,
        ];
    }
}
