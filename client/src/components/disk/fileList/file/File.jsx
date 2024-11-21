import React from 'react';
import './file.css'
import FileLogo from '../../../../assets/img/file.svg';
import {useDispatch} from "react-redux";
import {deleteFile, downloadFile} from "../../../../actions/file";
import {formatFileSize} from "../../../../helper/fileHelper";

const File = ({file}) => {
    const dispatch = useDispatch()

    function deleteFileHandler() {
        dispatch(deleteFile(file))
    }

    function getFileHandler() {
        downloadFile(file)
    }

    const localDate = !isNaN(new Date(file.createdAt).getTime())
        ? new Date(file.createdAt).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'short', // Сокращённый месяц
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : '';

    return (
        <div className='file'>
            <img src={FileLogo} className='file__img' alt=""/>
            <div className="">{file.name}</div>
            <div className="file__date">{localDate}</div>
            <div className="file__size">{formatFileSize(file.size)}</div>
            <button className="file__btn file__download" onClick={getFileHandler}>download</button>
            <button className="file__btn file__delete" onClick={deleteFileHandler}>delete</button>
        </div>
    );
};

export default File;