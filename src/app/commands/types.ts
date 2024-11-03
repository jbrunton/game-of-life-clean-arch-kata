import { Options, InferredOptionTypes, CommandModule } from "yargs";

export type OptionsT = Record<string, Options>;

type Arguments<T = object> = T & {
  /** Non-option arguments */
  _: Array<string | number>;
  /** The script name or node command */
  $0: string;
};

type GetArgsT<T extends OptionsT> = Arguments<InferredOptionTypes<T>>;

export type Command<O extends OptionsT> = CommandModule<object, GetArgsT<O>> & {
  handler: (args: GetArgsT<O>) => void | Promise<void>;
};
