import type { StateDispatcher } from "state-dispatcher-red";
import { useDispatcherSubscription } from "./utils";

export function createHook<
  StateValues,
  Events extends Record<string, unknown>,
>(
  manager: StateDispatcher<StateValues, Events>,
) {
  return function useDispatcherSelector<
    K extends keyof Events,
  >(
    key: K,
    selector: (state: StateValues) => Events[K],
  ) {
    return useDispatcherSubscription(
      manager,
      key,
      selector,
    );
  };
}