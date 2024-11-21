import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getDir} from "../../actions/dir";
import "./disk.css"
import {setIsPopupDisplay} from "../../reducers/dirReducer";
import {uploadContents} from "../../actions/file";
import {formatFileSize} from "../../helper/fileHelper";

const DiskHeader = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.dir.currentDir)
    const user = useSelector(state => state.user.currentUser)


     function returnHandler() {
        dispatch(getDir(currentDir.parentFolderId))
    }

    function loadFileHandler(e) {
        if (e.target.files) {
            dispatch(uploadContents([{folderName: '', contents: [...e.target.files]}], currentDir._id))
        }
    }

    return (
        <div className="disk__btns">
            <button className="disk__back" onClick={returnHandler}>return</button>
            <button className="disk__create" onClick={() => dispatch(setIsPopupDisplay(true))}>Create dir
            </button>
            <button className="disk__upload">
                <label className='disk__upload-label'>
                    Load file
                    <input type="file" className='disk__upload-input'
                           multiple
                           onChange={loadFileHandler}/>
                </label>
            </button>

            <div className="disk__space">
                <p>Space total: {formatFileSize(user.diskSpace)}</p>
                <p>Space left: {formatFileSize(user.diskSpace - user.usedSpace)}</p>
            </div>
        </div>
    );
};

export default DiskHeader;