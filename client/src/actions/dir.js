import {API_URL} from "../config";
import {api} from "../api/axiosInstance";
import {setCurrentDir, setIsPopupDisplay} from "../reducers/dirReducer";
import {auth} from "./user";
import {setShowLoader} from "../reducers/appReducer";

export const getDir = (id = null) => {
    return async (dispatch) => {
        try {
            dispatch(setShowLoader(true))
            const dir = await api.post(API_URL + '/folder', {
                folderId: id
            })
            dispatch(setCurrentDir(dir.data))

        } catch (e) {
            console.log(e)
        } finally {
            dispatch(setShowLoader(false))
        }
    }
}

export const createDir = (name, parentFolderId, isDoDispatch = true) => {
    return async (dispatch) => {
        try {
            const data = await api.post(API_URL + '/folder/create', {parentFolderId, name})

            if (data.status === 200) {
                if (isDoDispatch) {
                    dispatch(setCurrentDir(data.data.parent))
                    dispatch(setIsPopupDisplay(false))
                } else {
                    return data.data

                }
            }

        } catch (e) {
            console.log(e)
        }
    }
}

export const deleteDir = (id) => {
    return async (dispatch) => {
        try {
            const updatedParentDir = await api.delete('/folder', {
                data: {folderId: id}
            })
            if (updatedParentDir.status === 200) {
                dispatch(auth())
                dispatch(setCurrentDir(updatedParentDir.data.parent))
            }
        } catch (e) {
            console.log(e)
        }
    }
}