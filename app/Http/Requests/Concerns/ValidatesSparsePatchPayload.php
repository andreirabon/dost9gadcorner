<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Arr;

trait ValidatesSparsePatchPayload
{
    /**
     * @param  array<int, mixed>  $items
     * @param  list<string>  $valueFields
     */
    protected function assertEachItemHasPatchField(Validator $validator, array $items, array $valueFields, string $errorPrefix): void
    {
        foreach ($items as $index => $item) {
            if (is_array($item) && ! Arr::hasAny($item, $valueFields)) {
                $validator->errors()->add(
                    "{$errorPrefix}.{$index}",
                    'At least one field must be provided besides the row identifier.',
                );
            }
        }
    }

    /**
     * @param  array<string, mixed>  $payload
     * @param  list<string>  $allowedFields
     */
    protected function assertHasAtLeastOneField(Validator $validator, array $payload, array $allowedFields, string $errorKey = 'patch'): void
    {
        if (! Arr::hasAny($payload, $allowedFields)) {
            $validator->errors()->add($errorKey, 'At least one field must be provided.');
        }
    }
}
