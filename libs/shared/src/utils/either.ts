type EitherOK<TValue> = { ok: true; value: TValue };
export type Empty = Record<string, never>;

type EitherError<TError> = {
  ok: false;
  error: TError;
};

export type BaseError = {
  message: string;
};

export type Either<TValue, TError> = EitherOK<TValue> | EitherError<TError>;
export type PromiseEither<TValue, TError> = Promise<Either<TValue, TError>>;

export function ok<TValue>(value: TValue): Either<TValue, never> {
  return { ok: true, value };
}

export function error<TError>(
  error: TError,
  data?: unknown,
): Either<never, TError> {
  return { ok: false, error: { ...error, data } };
}

export function isError<TValue, TError>(
  either: Either<TValue, TError>,
): either is EitherError<TError> {
  return !either.ok;
}
