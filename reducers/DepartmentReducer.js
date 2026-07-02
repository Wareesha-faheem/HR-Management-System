export function DepartmentReducer(state, action) {
  switch (action.type) {
    case "LOAD_DEPARTMENTS":
      return {
        ...state,
        departments: action.payload,
      };

    case "ADD_DEPARTMENT":
      return {
        ...state,
        departments: [...state.departments, action.payload],
      };

    case "UPDATE_DEPARTMENT":
      return {
        ...state,
        departments: state.departments.map((department) =>
          department.id === action.payload.id
            ? action.payload
            : department
        ),
      };

    case "DELETE_DEPARTMENT":
      return {
        ...state,
        departments: state.departments.filter(
          (department) => department.id !== action.payload
        ),
      };

    default:
      return state;
  }
}