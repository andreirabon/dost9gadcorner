/**
 * Shared input styling for the report edit sections.
 *
 * Extracted so section components and the page shell cannot drift apart on the
 * focus/transition treatment.
 */
export const REPORT_INPUT_CLASS = 'report-field w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]';

export const REPORT_TABLE_INPUT_CLASS =
    'report-field report-years-data-input w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]';
