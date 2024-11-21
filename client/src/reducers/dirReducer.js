const SET_CURRENT_DIR = 'SET_CURRENT_DIR'
const SET_IS_POPUP_DISPLAY = 'SET_IS_POPUP_DISPLAY'

const defaultState = {
    currentDir: [],
    isPopupDisplay: false
}

export default function dirReducer(state = defaultState, action) {
    switch (action.type) {

        case SET_CURRENT_DIR:
            return {
                ...state,
                currentDir: action.payload
            }

        case SET_IS_POPUP_DISPLAY:
            return {...state, isPopupDisplay: action.payload}
        default:
            return state
    }
}

export const setCurrentDir = (dir) => ({type: SET_CURRENT_DIR, payload: dir})
export const setIsPopupDisplay = (isDisplay) => ({type: SET_IS_POPUP_DISPLAY, payload: isDisplay})