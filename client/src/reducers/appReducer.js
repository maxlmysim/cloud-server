const SET_SHOW_LOADER = 'SET_SHOW_LOADER'

const defaultState = {
    loader: false
}

export default function appReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_SHOW_LOADER:
            return {...state, loader: action.payload}

        default:
            return state
    }
}


export const setShowLoader = (isShow) => ({type: SET_SHOW_LOADER, payload: isShow})
