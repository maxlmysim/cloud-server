import React, {useState} from 'react';
import Input from "../../utils/input/Input";
import {useDispatch, useSelector} from "react-redux";
import {setIsPopupDisplay} from "../../reducers/dirReducer";
import {createDir} from "../../actions/dir";

const Popup = () => {
    const [value, setValue] = useState('')
    const dispatch = useDispatch()
    const isPopupDisplay = useSelector(state => state.dir.isPopupDisplay)
    const currentDir = useSelector(state => state.dir.currentDir)

    function closePopup() {
        dispatch(setIsPopupDisplay(false))
    }

    function createDirHandler() {
        dispatch(createDir(value, currentDir._id))
        setValue('')
    }

    return (
        isPopupDisplay &&
        <div className='popup'>
            <div className="popup__content">
                <div className="popup__header">
                    <div className="popup__title">Create dir</div>
                    <button className="" onClick={closePopup}>X</button>
                </div>
                <Input type='text' placeholder='Input name dir' value={value} setValue={setValue}></Input>
                <button className="popup__create" onClick={createDirHandler}>Create</button>
            </div>
        </div>
    );
};

export default Popup;