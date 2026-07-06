// Factory that produces a standard CRUD reducer for a given entity key
// (e.g. "departments"). Every module reducer builds on this so add/update/
// delete/set behavior stays consistent across the app, then layers its own
// domain-specific action types on top via `extraCases`.
export function createCrudReducer(entityKey, actionPrefix, extraCases = {}) {
  return function reducer(state, action) {
    switch (action.type) {
      case "__HYDRATE__":
        return { ...state, ...action.payload };

      case `ADD_${actionPrefix}`:
        return { ...state, [entityKey]: [action.payload, ...state[entityKey]] };

      case `UPDATE_${actionPrefix}`:
        return {
          ...state,
          [entityKey]: state[entityKey].map((item) =>
            item.id === action.payload.id ? { ...item, ...action.payload } : item
          ),
        };

      case `DELETE_${actionPrefix}`:
        return {
          ...state,
          [entityKey]: state[entityKey].filter((item) => item.id !== action.payload),
        };

      case `SET_${actionPrefix}`:
        return { ...state, [entityKey]: action.payload };

      default: {
        const handler = extraCases[action.type];
        return handler ? handler(state, action) : state;
      }
    }
  };
}
