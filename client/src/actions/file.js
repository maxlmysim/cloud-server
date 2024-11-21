import {api, CancelToken} from "../api/axiosInstance";
import {API_URL} from "../config";
import {setCurrentDir} from "../reducers/dirReducer";
import {createDir, getDir} from "./dir";
import {addFilesUploader, setLinkCancel, setProgressFile, showUploader} from "../reducers/loadReducer";
import {getFileListForUploader} from "../helper/fileHelper";
import {auth} from "./user";


const uploadData = (data, parentFolderId) => {
    return async (dispatch, getState) => {
        for (let item of data) {
            if (item instanceof File) {
                await uploadFile(item, parentFolderId, false)(dispatch, getState)
            } else {
                if (item.folderName) {
                    const newFolderData = await createDir(item.folderName, parentFolderId, false)()
                    await uploadData(item.contents, newFolderData.current._id)(dispatch, getState)
                } else if (item.folderName === '') {
                    await uploadData(item.contents, parentFolderId)(dispatch, getState)
                }
            }
        }
    }
}

export const uploadContents = (data, parentFolderId) => {
    return async (dispatch, getState) => {
        try {
            dispatch(showUploader())

            dispatch(addFilesUploader(getFileListForUploader(data)))

            await uploadData(data, parentFolderId)(dispatch, getState)
            dispatch(auth())
            await getDir(parentFolderId)(dispatch)
        } catch (e) {
            console.log(e)
        }
    }
}


export const uploadFile = (file, parentFolderId, isUpdateCurrentDir = true) => {
    return async (dispatch, getState) => {
        const currentFileLoad = getState()?.load?.files.find(f => f.file === file);

        const formData = new FormData()

        formData.append('file', file)
        formData.append('parentFolderId', parentFolderId)


        if (!currentFileLoad) return

        const data = await api.post(API_URL + '/files/upload', formData, {
            cancelToken: new CancelToken(function executor(c) {
                dispatch(setLinkCancel(file, c))
            }),
            onUploadProgress: function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    dispatch(setProgressFile(file, progress))
                } else {
                    dispatch(setProgressFile(file, 100))
                }
            }
        })

        isUpdateCurrentDir && dispatch(setCurrentDir(data.data.parent))
    }
}

export const deleteFile = (file) => {
    return async (dispatch) => {
        const updatedFolderData = await api.delete(`${API_URL}/files/`, {
            data: file
        });

        if (updatedFolderData.status === 200) {
            dispatch(auth())
            dispatch(setCurrentDir(updatedFolderData.data.parent))
        }

    }
}


export const downloadFile = async (file) => {
    const getFile = await api.get(`${API_URL}/files/`,
        {
            params: {id: file._id},
            responseType: 'blob'
        })

    const blob = new Blob([getFile.data], {type: getFile.headers['content-type']});
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove()
}