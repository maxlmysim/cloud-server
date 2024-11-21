import React from 'react';
import './fileList.css'
import File from "./file/File";
import Dir from "./file/Dir";
import {useSelector} from "react-redux";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const FileList = () => {
    const fileList = useSelector(state => state.dir.currentDir?.files) || []
    const dirList = useSelector(state => state.dir.currentDir?.childListFolderId) || []


    return (
        <div className='filelist'>
            <div className="filelist__header">
                <div className="filelist__name">Name</div>
                <div className="filelist__date">Date</div>
                <div className="filelist__size">Size</div>
            </div>
            <TransitionGroup>
                {
                    dirList.map(dir =>
                            dir && <CSSTransition key={dir._id}
                                                  timeout={500}
                                                  classNames="file"
                            >
                                <Dir dir={dir}/>
                            </CSSTransition>
                    )
                }
                {
                    fileList.map(file =>
                            file && <CSSTransition key={file._id}
                                                   timeout={500}
                                                   classNames="file"
                            >
                                <File file={file}/>
                            </CSSTransition>
                    )
                }
            </TransitionGroup>
        </div>
    );
};

export default FileList;