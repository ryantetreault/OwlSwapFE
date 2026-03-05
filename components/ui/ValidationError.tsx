interface ValidationErrorProps {
  fieldErrors?: Record<string, string>;
  fieldName: string;
}

export function ValidationError({ fieldErrors, fieldName }: ValidationErrorProps) {
  const error = fieldErrors?.[fieldName];

  if (!error) return null;

  return (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
      {error}
    </p>
  );
}
