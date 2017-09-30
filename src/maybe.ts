/**
 * # Maybe
 * 
 * A `Maybe<T>` is a value of type `T` which may or may not be present.
 * 
 * If the value is present, it is `Just(value)`. If it's absent, it's `Nothing`.
 * This provides a type-safe container for dealing with the possibility that
 * there's nothing here – a container you can do many of the same things you
 * might with an array – so that you can avoid nasty `null` and `undefined`
 * checks throughout your codebase.
 */

/** (keep typedoc from getting confused by the imports) */
import { isVoid } from './utils';
import { Result, ok, err } from './result';

/**
 * Discriminant for the `Just` and `Nothing` variants.
 */
export enum Variant {
  Just = 'Just',
  Nothing = 'Nothing',
}

// Someday maybe we'll have `protocol`s and this would just have default
// implementations for nearly everything in the concrete classes below.
export interface IMaybe<T> {
  variant: Variant;

  /** Method variant for [`Maybe.isJust`](../modules/_maybe_.html#isjust) */
  isJust(this: Maybe<T>): this is Just<T>;

  /** Method variant for [`Maybe.isNothing`](../modules/_maybe_.html#isnothing) */
  isNothing(this: Maybe<T>): this is Nothing<T>;

  /** Method variant for [`Maybe.map`](../modules/_maybe_.html#map) */
  map<U>(this: Maybe<T>, mapFn: (t: T) => U): Maybe<U>;

  /** Method variant for [`Maybe.mapOr`](../modules/_maybe_.html#mapor) */
  mapOr<U>(this: Maybe<T>, orU: U, mapFn: (t: T) => U): U;

  /** Method variant for [`Maybe.mapOrElse`](../modules/_maybe_.html#maporelse) */
  mapOrElse<U>(this: Maybe<T>, orElseFn: (...args: any[]) => U, mapFn: (t: T) => U): U;

  /** Method variant for [`Maybe.or`](../modules/_maybe_.html#or) */
  or(this: Maybe<T>, mOr: Maybe<T>): Maybe<T>;

  /** Method variant for [`Maybe.orElse`](../modules/_maybe_.html#orelse) */
  orElse(this: Maybe<T>, orElseFn: (...args: any[]) => Maybe<T>): Maybe<T>;

  /** Method variant for [`Maybe.and`](../modules/_maybe_.html#and) */
  and<U>(this: Maybe<T>, mAnd: Maybe<U>): Maybe<U>;

  /** Method variant for [`Maybe.andThen`](../modules/_maybe_.html#andthen) */
  andThen<U>(this: Maybe<T>, andThenFn: (t: T) => Maybe<U>): Maybe<U>;

  /**
   * Method variant for [`Maybe.unwrap`](../modules/_maybe_.html#unwrap)
   * 
   * @return {T} The unwrapped value, if `Just`
   * 
   * @throws     If `None`.
   */
  unsafelyUnwrap(): T | never;

  /** Method variant for [`Maybe.unwrapOrElse`](../modules/_maybe_.html#unwraporelse) */
  unwrapOrElse(this: Maybe<T>, elseFn: (...args: any[]) => T): T;

  /** Method variant for [`Maybe.toOkOrErr`](../modules/_maybe_.html#tookorerr) */
  toOkOrErr<E>(this: Maybe<T>, error: E): Result<T, E>;

  /** Method variant for [`Maybe.toOkOrElseErr`](../modules/_maybe_.html#tookorelseerr) */
  toOkOrElseErr<T, E>(this: Maybe<T>, elseFn: (...args: any[]) => E): Result<T, E>;

  /** Method variant for [`Maybe.toString`](../modules/_maybe_.html#tostring) */
  toString<T>(this: Maybe<T>): string;
}

export class Just<T> implements IMaybe<T> {
  private __value: T;

  variant = Variant.Just;

  /**
   * Create an instance of `Maybe.Just` with `new`.
   * 
   * **Note:** While you *may* create the `Just` type via normal JavaScript
   * class construction, it is not recommended for the functional style for
   * which the library is intended. Instead, use Maybe.[[of]] (for the general
   * case) or Maybe.[[just]] for this specific case.
   * 
   * ```ts
   * // Avoid:
   * const aString = new Maybe.Just('characters');
   * 
   * // Prefer:
   * const aString = Maybe.just('characters);
   * ```
   * 
   * @param value
   * The value to wrap in a `Maybe.Just`.
   * 
   * `null` and `undefined` are allowed by the type signature so that the
   * constructor may `throw` on those rather than constructing a type like
   * `Maybe<undefined>`.
   * 
   * @throws      If you pass `null` or `undefined`.
   */
  constructor(value: T | null | undefined) {
    if (isVoid(value)) {
      throw 'Tried to construct `Just` with `null` or `undefined`';
    }

    this.__value = value;
  }

  /** Method variant for [`Maybe.isJust`](../modules/_maybe_.html#isjust) */
  isJust(this: Maybe<T>): this is Just<T> {
    return isJust(this);
  }

  /** Method variant for [`Maybe.isNothing`](../modules/_maybe_.html#isnothing) */
  isNothing(this: Maybe<T>): this is Nothing<T> {
    return isNothing(this);
  }

  map<U>(this: Maybe<T>, mapFn: (t: T) => U): Maybe<U> {
    return map(mapFn, this);
  }

  mapOr<U>(this: Maybe<T>, orU: U, mapFn: (t: T) => U): U {
    return mapOr(orU, mapFn, this);
  }

  mapOrElse<U>(this: Maybe<T>, orElseFn: (...args: any[]) => U, mapFn: (t: T) => U): U {
    return mapOrElse(orElseFn, mapFn, this);
  }

  or(this: Maybe<T>, mOr: Maybe<T>): Maybe<T> {
    return or(mOr, this);
  }

  orElse(this: Maybe<T>, orElseFn: (...args: any[]) => Maybe<T>): Maybe<T> {
    return orElse(orElseFn, this);
  }

  and<U>(this: Maybe<T>, mAnd: Maybe<U>): Maybe<U> {
    return and(mAnd, this);
  }

  andThen<U>(this: Maybe<T>, andThenFn: (t: T) => Maybe<U>): Maybe<U> {
    return andThen(andThenFn, this);
  }

  unsafelyUnwrap(): T {
    return this.__value;
  }

  unwrapOr(this: Maybe<T>, defaultValue: T): T {
    return unwrapOr(defaultValue, this);
  }

  unwrapOrElse(this: Maybe<T>, elseFn: (...args: any[]) => T): T {
    return unwrapOrElse(elseFn, this);
  }

  toOkOrErr<E>(this: Maybe<T>, error: E): Result<T, E> {
    return toOkOrErr(error, this);
  }

  toOkOrElseErr<T, E>(this: Maybe<T>, elseFn: (...args: any[]) => E): Result<T, E> {
    return toOkOrElseErr(elseFn, this);
  }

  /** Method variant for [`Maybe.toString`](../modules/_maybe_.html#tostring) */
  toString<T>(this: Maybe<T>): string {
    return toString(this);
  }
}

export class Nothing<T> implements IMaybe<T> {
  variant = Variant.Nothing;

  /** Method variant for [`Maybe.isJust`](../modules/_maybe_.html#isjust) */
  isJust(this: Maybe<T>): this is Just<T> {
    return isJust(this);
  }

  /** Method variant for [`Maybe.isNothing`](../modules/_maybe_.html#isnothing) */
  isNothing(this: Maybe<T>): this is Nothing<T> {
    return isNothing(this);
  }

  /** Method variant for [`Maybe.map`](../modules/_maybe_.html#map) */
  map<U>(this: Maybe<T>, mapFn: (t: T) => U): Maybe<U> {
    return map(mapFn, this);
  }

  mapOr<U>(this: Maybe<T>, orU: U, mapFn: (t: T) => U): U {
    return mapOr(orU, mapFn, this);
  }

  mapOrElse<U>(this: Maybe<T>, orElseFn: (...args: any[]) => U, mapFn: (t: T) => U): U {
    return mapOrElse(orElseFn, mapFn, this);
  }

  or(this: Maybe<T>, mOr: Maybe<T>): Maybe<T> {
    return or(mOr, this);
  }

  orElse(this: Maybe<T>, orElseFn: (...args: any[]) => Maybe<T>): Maybe<T> {
    return orElse(orElseFn, this);
  }

  and<U>(this: Maybe<T>, mAnd: Maybe<U>): Maybe<U> {
    return and(mAnd, this);
  }

  andThen<U>(this: Maybe<T>, andThenFn: (t: T) => Maybe<U>): Maybe<U> {
    return andThen(andThenFn, this);
  }

  unsafelyUnwrap(): never {
    throw 'Tried to `unsafelyUnwrap(Nothing)`';
  }

  unwrapOr(this: Maybe<T>, defaultValue: T): T {
    return unwrapOr(defaultValue, this);
  }

  unwrapOrElse(this: Maybe<T>, elseFn: (...args: any[]) => T): T {
    return unwrapOrElse(elseFn, this);
  }

  toOkOrErr<E>(this: Maybe<T>, error: E): Result<T, E> {
    return toOkOrErr(error, this);
  }

  /** Method variant for [`Maybe.toOkOrElseErr`](../modules/_maybe_.html#tookorelseerr) */
  toOkOrElseErr<T, E>(this: Maybe<T>, elseFn: (...args: any[]) => E): Result<T, E> {
    return toOkOrElseErr(elseFn, this);
  }

  /** Method variant for [`Maybe.toString`](../modules/_maybe_.html#tostring) */
  toString<T>(this: Maybe<T>): string {
    return toString(this);
  }
}

/**
 * Is this result a `Just` instance?
 * 
 * In TypeScript, narrows the type from `Maybe<T>` to `Just<T>`.
 */
export const isJust = <T>(maybe: Maybe<T>): maybe is Just<T> => maybe.variant === Variant.Just;

/**
 * Is this result a `Nothing` instance?
 * 
 * In TypeScript, narrows the type from `Maybe<T>` to `Nothing<T>`.
 */
export const isNothing = <T>(maybe: Maybe<T>): maybe is Nothing<T> =>
  maybe.variant === Variant.Nothing;

/**
 * Create an instance of `Maybe.Just`.
 * 
 * `null` and `undefined` are allowed by the type signature so that the
 * function may `throw` on those rather than constructing a type like
 * `Maybe<undefined>`.
 * 
 * @typeparam T The type of the item contained in the `Maybe`.
 * @param value The value to wrap in a `Maybe.Just`.
 * @throws      If you pass `null` or `undefined`.
*/
export const just = <T>(value: T | null | undefined): Maybe<T> => new Just<T>(value);

/**
 * Create an instance of `Maybe.Nothing`.
 * 
 * If you want to create an instance with a specific type, e.g. for use in a
 * function which expects a `Maybe<T>` where the `<T>` is known but you have no
 * value to give it, you can use a type parameter:
 * 
 * ```ts
 * const notString = Maybe.nothing<string>();
 * ```
 * 
 * @typeparam T The type of the item contained in the `Maybe`.
 */
export const nothing = <T>(): Maybe<T> => new Nothing<T>();

/**
 * A value which may (`Just<T>`) or may not (`Nothing`) be present.
 * 
 * The behavior of this type is checked by TypeScript at compile time, and bears
 * no runtime overhead other than the very small cost of the container object.
 */
export type Maybe<T> = Just<T> | Nothing<T>;

/**
 * Create a `Maybe` from any value.
 * 
 * To specify that the result should be interpreted as a specific type, you may
 * invoke `Maybe.of` with an explicit type parameter:
 * 
 * ```ts
 * const foo = Maybe.of<string>(null);
 * ```
 * 
 * This is usually only important in two cases:
 * 
 * 1.  If you are intentionally constructing a `Nothing` from a known `null` or
 *     undefined value.
 * 2.  If you are specifying that the type is more general than the value passed
 *     (since TypeScript can define types as literals).
 * 
 * @typeparam T The type of the item contained in the `Maybe`.
 * @param value The value to wrap in a `Maybe`. If it is `undefined` or `null`,
 *              the result will be `Nothing`; otherwise it will be the type of
 *              the value passed.
 */
export const of = <T>(value: T | undefined | null): Maybe<T> =>
  isVoid(value) ? nothing<T>() : just(value);

export default Maybe;

/**
 * Map over a `Maybe` instance: apply the function to the wrapped value if the
 * instance is `Just`, and return `Nothing` if the instance is `Nothing`.
 * 
 * ```ts
 * const someString = Maybe.just('string');
 * const notAString = Maybe.nothing<string>();
 * const length = (s: string) => s.length;
 * 
 * const someStringLength = map(length, someString);
 * console.log(stringLength.toString()); // "Just(6)"
 * 
 * const notAStringLength = map(length, notAString);
 * console.log(notAStringLength.toString()); // "Nothing"
 * ```
 * 
 * @param mapFn The function to apply the value to if `Maybe` is `Just`.
 * @param maybe The `Maybe` instance to map over.
 */
export const map = <T, U>(mapFn: (t: T) => U, maybe: Maybe<T>): Maybe<U> =>
  isJust(maybe) ? just(mapFn(unwrap(maybe))) : nothing<U>();

export const mapOr = <T, U>(orU: U, mapFn: (t: T) => U, maybe: Maybe<T>): U =>
  isJust(maybe) ? mapFn(unwrap(maybe)) : orU;

export const mapOrElse = <T, U>(
  orElseFn: (...args: any[]) => U,
  mapFn: (t: T) => U,
  maybe: Maybe<T>
): U => (isJust(maybe) ? mapFn(unwrap(maybe)) : orElseFn());

/**
 * You can think of this like a short-circuiting logical "and" operation on a
 * `Maybe` type. If the first item is `Nothing`, the result is `Nothing`. If the
 * first item is `Just`, then the value is the `Maybe` instance.
 *
 * ```ts
 * const stringA = Maybe.of('A');
 * const stringB = Maybe.of('B');
 * const nothing = Maybe.nothing<number>;
 *
 * console.log(and(stringA, stringB).toString());  // 'Just("B")'
 * console.log(and(nothing, stringB).toString());  // 'Nothing'
 * console.log(and(stringA, nothing).toString());  // 'Nothing'
 * console.log(and(nothing, nothing).toString());  // 'Nothing'
 * ```
 * 
 * @param andMaybe The `Maybe` instance to return if `maybe` is `Just`
 * @param maybe    The `Maybe` instance to check.
 * @return         `Nothing` if the original `maybe` is `Nothing`, or `andMaybe`
 *                 if the original `maybe` is `Just`.
 */
export const and = <T, U>(andMaybe: Maybe<U>, maybe: Maybe<T>): Maybe<U> =>
  isJust(maybe) ? andMaybe : nothing(); // cannot coerce Nothing<T> to Nothing<U>

export const andThen = <T, U>(thenFn: (t: T) => Maybe<U>, maybe: Maybe<T>): Maybe<U> =>
  isJust(maybe) ? thenFn(unwrap(maybe)) : nothing();

export const or = <T>(defaultMaybe: Maybe<T>, maybe: Maybe<T>): Maybe<T> =>
  isJust(maybe) ? maybe : defaultMaybe;

export const orElse = <T>(elseFn: (...args: any[]) => Maybe<T>, maybe: Maybe<T>): Maybe<T> =>
  isJust(maybe) ? maybe : elseFn();

// For internal use; but not exported because we want to emphasize that this is
// a bad idea via the name.
const unwrap = <T>(maybe: Maybe<T>): T => maybe.unsafelyUnwrap();

/**
 * Get the value out of the `Maybe`.
 *
 * Returns the content of a `Just`, but **throws if the `Maybe` is `Nothing`**.
 * Prefer to use [`unwrapOr`](#unwrapor) or [`unwrapOrElse`](#unwraporelse).
 *
 * @param maybe The value to unwrap
 * @returns     The unwrapped value if the `Maybe` instance is `Just`.
 */
export const unsafelyUnwrap = unwrap;

/**
 * Safely get the value out of a `Maybe`.
 *
 * Returns the content of a `Just` or `defaultValue` if `Nothing`.
 */
export const unwrapOr = <T>(defaultValue: T, maybe: Maybe<T>): T =>
  isJust(maybe) ? unwrap(maybe) : defaultValue;

/**
   * Safely get the value out of a `Maybe`.
   *
   * Returns the content of a `Just` or `defaultValue` if `Nothing`.
   */
export const unwrapOrElse = <T>(orElseFn: (...args: any[]) => T, maybe: Maybe<T>): T =>
  isJust(maybe) ? unwrap(maybe) : orElseFn();

/**
 * Transform the [[Maybe]] into a [[Result]], using the wrapped value as the
 * `Ok` value if `Just`; otherwise using the supplied `error` value for `Err`.
 * 
 * @param error The error value to use if the `Maybe` is `Nothing`.
 * @param maybe The `Maybe` instance to convert.
 */
export const toOkOrErr = <T, E>(error: E, maybe: Maybe<T>): Result<T, E> =>
  isJust(maybe) ? ok(unwrap(maybe)) : err(error);

/**
 * Transform the [[Maybe]] into a [[Result]], using the wrapped value as the
 * `Ok` value if `Just`; otherwise using `elseFn` to generate `Err`.
 * 
 * @typeparam T  The wrapped value.
 * @typeparam E  The error type to in the `Result`.
 * @param elseFn The function which generates an error of type `E`.
 * @param maybe  The `Maybe` instance to convert.
 */
export const toOkOrElseErr = <T, E>(elseFn: (...args: any[]) => E, maybe: Maybe<T>): Result<T, E> =>
  isJust(maybe) ? ok(unwrap(maybe)) : err(elseFn());

export const toString = <T>(maybe: Maybe<T>): string =>
  isJust(maybe) ? `Just(${unwrap(maybe).toString()})` : `Nothing`;
