import ActionTypes from '../constant/constant.js';

const INITIAL_STATE = {
    store_todo_list: []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ActionTypes.UPDATETODO:
            // console.log(action.payload)
            return ({
                ...state,
                store_todo_list: action.payload
            });
        default:
            return state;
    }
}