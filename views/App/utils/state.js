export function getState(key) {
    const { state } = window.history;
    if (!state || typeof state !== 'object' || !(key in state)) {
        return null;
    }
    return state[key];
}
export function getViewState(uuid) {
    const views = getState('views');
    if (!views || typeof views !== 'object' || !(uuid in views)) {
        return null;
    }
    return views[uuid];
}
export function modifyState(callback) {
    let { state } = window.history;
    if (!state || typeof state !== 'object') {
        state = {};
    }
    const newState = callback(state);
    if (newState && newState !== state) {
        window.history.replaceState(newState, '', window.location.href);
    }
}
export function setViewState(uuid, value) {
    modifyState((state) => (Object.assign(Object.assign({}, state), { views: Object.assign(Object.assign({}, ('views' in state ? state.views : {})), { [uuid]: value }) })));
}
