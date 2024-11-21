const SET_FILES = 'SET_FILES'

const defaultState = {
    files: []
}

export default function fileReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_FILES:
            return {
                ...state,
                files: action.payload
            }

        default:
            return state
    }
}

export const setFiles = (files) => ({type: SET_FILES, payload: files})
