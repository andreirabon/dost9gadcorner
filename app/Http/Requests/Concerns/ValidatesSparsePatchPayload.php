<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Contracts\Validation\Validator;

trait ValidatesSparsePatchPayload
{
    /**
     * @param  array<int, array<string, mixed>>  $items
     * @param  list<string>  $valueFields
     */
    protected function assertEachItemHasPatchField(Validator $validator, array $items, string $keyField, array $valueFields, string $errorPrefix): void
    {
        foreach ($items as $index => $item) {
            if (! is_array($item)) {
                continue;
            }

            $hasValueField = false;

            foreach ($valueFields as $field) {
                if (array_key_exists($field, $item)) {
                    $hasValueField = true;

                    break;
                }
            }

            if (! $hasValueField) {
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
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $payload)) {
                return;
            }
        }

        $validator->errors()->add($errorKey, 'At least one field must be provided.');
    }
}
