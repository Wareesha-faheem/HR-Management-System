export function AttendanceReducer(state, action) {
  switch (action.type) {
    case "ADD_ATTENDANCE":
      return {
        ...state,
        attendance: [...state.attendance, action.payload],
      };

    case "UPDATE_ATTENDANCE":
      return {
        ...state,
        attendance: state.attendance.map((record) =>
          record.id === action.payload.id ? action.payload : record
        ),
      };

    case "DELETE_ATTENDANCE":
      return {
        ...state,
        attendance: state.attendance.filter(
          (record) => record.id !== action.payload
        ),
      };

    default:
      return state;
  }
}