import React from 'react';
import {useState, useCallback, useEffect} from 'react'
import classes from './DropZonePopup.module.css'
import {useDropzone} from 'react-dropzone'

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const DropZonePopup = (props) => {

    const [files, setFiles] = useState([]);
    useEffect(() => {
        if(props.active === false) {
           console.log(props.active)
            setFiles([])
        }
    }, [props.active])
    const {getRootProps, getInputProps, isDragAccept, isDragReject} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });
    const uploadAvatar = () => {
        props.uploadAvatar(files[0])
        setFiles([])
    }
    const thumbs = files.map(file => (
        <div key={file.name}>
            <div>
                <img
                    src={file.preview}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);
    return (
        <div className={classes.uploadAvatar_container}>
            <h1>Put your photo here</h1>
            <div className={
                isDragAccept || isDragReject ?
                    (
                        isDragAccept ?
                            classes.dropZone_field + " " + classes.dropAccept :
                            classes.dropZone_field + " " + classes.dropReject
                    )
                    :
                    classes.dropZone_field
            } {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <div className={classes.avatarPreview}>
                <div className={classes.largeAvatarPreview}>
                    <p>big avatar</p>
                    <div>
                        {files.length > 0 ? thumbs : <img src={props.currentAvatar} alt=""/>}
                    </div>
                </div>
                <div className={classes.littleAvatarPreview}>
                    <p>little avatar</p>
                    <div>
                        {files.length > 0 ? thumbs : <img src={props.currentAvatar} alt=""/>}
                    </div>
                </div>
            </div>
            <div className={classes.imageActions}>
                <button className={classes.applyNewAvatarBtn} disabled={files.length <= 0} onClick={uploadAvatar}>Загрузить</button>
            </div>
        </div>
    );
};

export default DropZonePopup;