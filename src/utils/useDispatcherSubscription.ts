import type { StateDispatcher } from "state-dispatcher-red";
import { useEffect, useState } from "react";

export function useDispatcherSubscription<
  StateValues,
  Events extends Record<string, unknown>,
  K extends keyof Events,
>(
  manager: StateDispatcher<StateValues, Events>,
  key: K,
  selector: (state: StateValues) => Events[K],
) {
  const [value, setValue] = useState(() =>
    selector(manager.getState()),
  );

  useEffect(() => {
    return manager.listen(key, () => {
      setValue(selector(manager.getState()));
    });
  }, [manager, key, selector]);

  return [
    value,
    manager.setters[key],
  ] as const;
}