import { ActionState, FieldErrors } from "@/lib/create-safe-action";
import { useCallback, useState } from "react";

type Action<TInput, TOutput> = (
  input: TInput
) => Promise<ActionState<TInput, TOutput>>;

interface UseActionOptions<TInput, TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onCompleted?: () => void;
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TInput, TOutput>
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput>>({});

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);

      try {
        const result = await action(input);

        if (!result) return;

        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }

        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      } finally {
        setIsLoading(false);
        options.onCompleted?.();
      }
    },
    [action, options]
  );

  return {
    execute,
    data,
    error,
    isLoading,
    fieldErrors,
  };
};
