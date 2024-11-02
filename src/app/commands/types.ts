import { Options, Arguments, InferredOptionTypes } from "yargs";

export type OptionsT = Record<string, Options>;

export type GetArgsT<T extends OptionsT> = Arguments<InferredOptionTypes<T>>;
