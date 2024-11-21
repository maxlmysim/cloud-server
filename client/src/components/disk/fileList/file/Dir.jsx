import React from 'react';
import './file.css'
import DirLogo from "../../../../assets/img/dir.svg";
import {useDispatch} from "react-redux";
import {deleteDir, getDir} from "../../../../actions/dir";
import {formatFileSize} from "../../../../helper/fileHelper";

const Dir = ({dir}) => {
    const dispatch = useDispatch()

    function openDirHandler() {
        dispatch(getDir(dir._id))
    }

    function deleteDirHandler() {
        dispatch(deleteDir(dir._id))
    }

    return (
        <div className='file' onDoubleClick={openDirHandler}>
            <img src={DirLogo} className='file__img' alt=""/>
            <div className="">{dir.name}</div>
            <div className="file__date">{dir.date}</div>
            <div className="file__size">{formatFileSize(dir.size)}</div>
            <button className="file__btn file__download">download</button>
            <button className="file__btn file__delete" onClick={deleteDirHandler}>delete</button>
        </div>
    );
};

export default Dir;