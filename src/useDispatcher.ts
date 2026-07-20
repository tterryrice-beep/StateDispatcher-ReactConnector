import type { StateDispatcher } from "state-dispatcher-red";
import { useDispatcherSubscription } from "./utils";

export function useDispatcher<
  StateValues,
  Events extends Record<string, unknown>,
  K extends keyof Events,
>(
  manager: StateDispatcher<StateValues, Events>,
  key: K,
  selector: (state: StateValues) => Events[K],
) {
  return useDispatcherSubscription(
    manager,
    key,
    selector,
  );
}