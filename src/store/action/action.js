import ActionTypes from '../constant/constant';

export default function setTodoListToStore(todo_list) {
    // console.log(todo_list);
    return dispatch => {
        dispatch({ type: ActionTypes.UPDATETODO, payload: todo_list })
    }
}