import { z } from "zod";

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
  data?: TOutput;
  error?: string;
  fieldErrors?: FieldErrors<TInput>;
};

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (input: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validatedResult = schema.safeParse(input);

    if (!validatedResult.success) {
      return {
        fieldErrors: validatedResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    return handler(validatedResult.data);
  };
};
