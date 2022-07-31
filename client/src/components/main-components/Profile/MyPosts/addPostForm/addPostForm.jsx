import React, {useState} from 'react';
import classes from '../MyPosts.module.css';
import addFiliIcon from "../../../../../assets/images/addFile.png";
const AddPostForm = React.memo(props => {
    console.log(props)
    const [newPostText, setNewPostText] = useState(null)
    const [files, setFiles] = useState([])
    let newElem = React.createRef();
    let addNewPost = () => {
        console.log(files)
        props.addNewPost(newPostText, files);
        props.doBigger();
        setNewPostText('');
        setFiles([])
    }
    const filesChangeHandle = (e) => {
        if(e.target.files){
            const filesArr = Array.from(e.target.files).map((file) => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))
            console.log(filesArr)
            setFiles(filesArr)
        }
    }
    let onPostChange = () => {
        let text = newElem.current.value;
        setNewPostText(text)
    }
    let doBigger = () => {
        console.log('BIGGGER')
        let textarea = newElem;
        textarea.current.rows = props.TextareaRows;
        props.doBigger();
    }
    let doLittle = () => {
        let textarea = newElem;
        textarea.current.rows = props.TextareaRows;
        props.doLittle();
    }
    console.log(files)
    const thumbs = files.map(file => <div className={classes.postUploadThumbs_item}>
                <img src={file.preview} alt=""/>
                <div>{file.name.length > 8 ? file.name.substring(0, 8) + '...' : file.name}</div>
    </div>)
    return (
        <div className={classes.add_post_form}
             onBlur={doLittle}
             onFocus={doBigger}
             tabIndex={ 0 }
        >
            <p className={classes.add_post_title}>Что у вас нового</p>
            <textarea className={classes.post_input}
                      ref={newElem}
                      value={newPostText}
                      onChange={onPostChange}/>
            <div className={classes.add_post_form_footer}>
                <button className={classes.add_post_button} onClick={addNewPost} >Add</button>
                <div className={classes.postUploadThumbs}>
                    {files.length <=5 ? thumbs : <div>U may upload only 5 or less files</div>}
                </div>

                <input accept=".png,.jpg,.svg" className={classes.addFileInput} multiple type="file" id="upload" onChange={filesChangeHandle} hidden/>
                <label className={classes.addFile} htmlFor="upload">
                    <img src={addFiliIcon} alt=""/>
                </label>
            </div>
        </div>
    );
});

export default AddPostForm;