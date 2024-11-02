import { Options, InferredOptionTypes } from "yargs";

export type OptionsT = Record<string, Options>;

type Arguments<T = object> = T & {
  /** Non-option arguments */
  _: Array<string | number>;
  /** The script name or node command */
  $0: string;
};

export type GetArgsT<T extends OptionsT> = Arguments<InferredOptionTypes<T>>;
