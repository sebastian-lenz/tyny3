export type State = tyny.Map<any>;

export function getState<T>(key: string): T | null {
  const { state } = window.history;
  if (!state || typeof state !== 'object' || !(key in state)) {
    return null;
  }

  return state[key];
}

export function getViewState<T>(uuid: string): T | null {
  const views = getState<tyny.Map<T>>('views');
  if (!views || typeof views !== 'object' || !(uuid in views)) {
    return null;
  }

  return views[uuid];
}

export function modifyState(callback: (state: State) => State) {
  let { state } = window.history;
  if (!state || typeof state !== 'object') {
    state = {};
  }

  const newState = callback(state);
  if (newState && newState !== state) {
    window.history.replaceState(newState, '', window.location.href);
  }
}

export function setViewState<T>(uuid: string, value: T) {
  modifyState((state) => ({
    ...state,
    views: {
      ...('views' in state ? state.views : {}),
      [uuid]: value,
    },
  }));
}
