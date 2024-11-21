import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getDir} from "../../actions/dir";
import "./disk.css"
import FileList from "./fileList/FileList";
import Popup from "./Popup";
import {uploadContents} from "../../actions/file";
import {getFileObject} from "../../helper/fileHelper";
import Uploader from "./uploader/uploader";
import DiskHeader from "./DiskHeader";

const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.dir.currentDir)
    const loader = useSelector(state => state.app.loader)
    const [dragEnter, setDragEnter] = useState(false)

    useEffect(() => {
        dispatch(getDir())
    }, [dispatch]);


    function dragEnterHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(true)
    }


    function dragLeaveHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(false)
    }

    async function dropHandler(e) {
        try {
            e.preventDefault()
            e.stopPropagation()

            const data = await getFileObject(e.dataTransfer.items)

            if (data.files.length > 0 || data.folders.length > 0) {
                dispatch(uploadContents([{folderName: '', contents: [...data.files, ...data.folders]}], currentDir._id))
            }

        } catch (e) {
            console.log(e)
        } finally {
            setDragEnter(false)
        }
    }

    if(loader) {
        return (
            <div className="loader">
                <div className="lds-dual-ring"></div>
            </div>
        )
    }


    return (
        !dragEnter ?
            <div className="disk"
                 onDragEnter={dragEnterHandler}
                 onDragLeave={dragLeaveHandler}
                 onDragOver={dragEnterHandler}>
                <DiskHeader/>
                <div className="disk__files">
                    <FileList/>
                </div>
                <Popup/>
                <Uploader/>
            </div>
            :
            <div className='drop-area'
                 onDragEnter={dragEnterHandler}
                 onDragLeave={dragLeaveHandler}
                 onDragOver={dragEnterHandler}
                 onDrop={dropHandler}
            >Drop file</div>
    );
};

export default Disk;