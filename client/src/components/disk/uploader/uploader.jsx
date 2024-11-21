import React from 'react';
import './uploader.css'
import UploadFile from "./UploadFile";
import {useDispatch, useSelector} from "react-redux";
import {hideUploader} from "../../../reducers/loadReducer";

const Uploader = () => {
    const dispatch = useDispatch()
    const uploader = useSelector(state => state.load)
    if (!uploader.isShowUploader) return null


    return (
        <div className='uploader'>
            <div className="uploader__header">
                <div className="uploader__title">Load...</div>
                <button className="uploader__close" onClick={() => dispatch(hideUploader())}>X</button>
            </div>
            <div className="uploader__body">
                {uploader.files.map((file, index) => <UploadFile key={index} fileObj={file}/>)}
            </div>
        </div>
    );
};

export default Uploader;