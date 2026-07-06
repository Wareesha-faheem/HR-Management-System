export function AuthReducer(state, action) {
  switch (action.type) {
    case "__HYDRATE__":
      return { ...state, ...action.payload, loading: false };
    case "LOGIN":
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "UPDATE_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}
