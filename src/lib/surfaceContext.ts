import { ReadonlySignal } from "@lit-labs/preact-signals"
import { Context, createContext } from "@lit/context"
import { Context2D } from "./Contexts"

type NewType = ReadonlySignal<Context2D | undefined>

export const surfaceContext2D: Context<string, NewType> =
  createContext("pg-surface-2d")
