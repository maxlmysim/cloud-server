import React from 'react';
import './uploader.css'
import {useDispatch} from "react-redux";
import {cancelLoad} from "../../../reducers/loadReducer";

const UploadFile = ({fileObj}) => {
    const dispatch = useDispatch()

    const {file, progress} = fileObj


    return (
        <div className='upload-file'>
            <div className="upload-file__header">
                <div className="upload-file__name">{file.name}</div>
                <button className='upload-file__remove'
                        onClick={() => dispatch(cancelLoad(file))}
                >X</button>
            </div>
            <div className="upload-file__progress-bar">
                <div className="upload-file__upload-bar" style={{width: `${progress}%`}}></div>
                <div className="upload-file__percent">{progress}%</div>
            </div>
        </div>
    );
};

export default UploadFile;