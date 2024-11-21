const SET_SHOW_UPLOADER = 'SET_SHOW_UPLOADER'
const SET_HIDE_UPLOADER = 'SET_HIDE_UPLOADER'
const ADD_FILES_UPLOADER = 'ADD_FILES_UPLOADER'
const SET_PROGRESS_FILE = 'SET_PROGRESS_FILE'
const SET_CANCEL_LOAD = 'CANCEL_LOAD'
const SET_LINK_CANCEL = 'SET_LINK_CANCEL'

const defaultState = {
    isShowUploader: false,
    files: []
}

export default function loadReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_SHOW_UPLOADER:
            return {
                ...state,
                isShowUploader: true
            }

        case SET_HIDE_UPLOADER: {
            const filterFiles = state.files.filter(f => f.progress !== 100)
            return {
                ...state,
                files: filterFiles,
                isShowUploader: false
            }
        }

        case ADD_FILES_UPLOADER:
            return {
                ...state,
                files: [...state.files, ...action.payload]
            }

        case SET_PROGRESS_FILE: {
            const {file, progress} = action.payload
            const newFiles = state.files.map(f => {
                if (f.file === file) {
                    if (progress === 100 && !state.isShowUploader) {
                        return false
                    }

                    return {...f, progress}
                }

                return f
            }).filter(f => !(f.file === file && progress === 100 && !state.isShowUploader))

            return {
                ...state,
                files: [...newFiles]
            }
        }

        case SET_CANCEL_LOAD: {
            const {file} = action.payload

            const newFiles = state.files.filter(f => {
                if (f.file === file) {
                    f.linkCancel && f.linkCancel()
                    return false
                }

                return f
            })



            return {
                ...state,
                isShowUploader: newFiles.length > 0,
                files: newFiles
            }
        }

        case SET_LINK_CANCEL: {
            const {file, linkCancel} = action.payload
            const newFiles = state.files.map(f => {
                if (f.file === file) {
                    f.linkCancel = linkCancel
                }

                return f
            })

            return {
                ...state,
                files: newFiles
            }
        }

        default:
            return state
    }
}

export const showUploader = () => ({type: SET_SHOW_UPLOADER, payload: true})
export const hideUploader = () => ({type: SET_HIDE_UPLOADER, payload: false})
export const addFilesUploader = (files) => ({type: ADD_FILES_UPLOADER, payload: files})
export const setProgressFile = (file, progress) => ({type: SET_PROGRESS_FILE, payload: {file, progress}})
export const cancelLoad = (file) => ({type: SET_CANCEL_LOAD, payload: {file}})
export const setLinkCancel = (file, linkCancel) => ({type: SET_LINK_CANCEL, payload: {file, linkCancel}})