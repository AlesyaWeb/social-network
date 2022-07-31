import React, {useEffect, useState} from 'react';
import classes from './ProfileStatus.module.css'

const ProfileStatus = (props) => {
    const [editMode, setEditMode] = useState('')
    const [status, setStatus] = useState(props.status)

    useEffect(()=>{
        setStatus(props.status)
    }, [props.status])

    const onStatusChange = (e) => {
        setStatus(e.target.value)
    }
    const activateEditMode = () => {
        setEditMode(true)
    }
    const deactivateEditMode = () => {
        setEditMode(false)
        props.updateStatus(status)
    }

    return <>
        {props.isProfileEqsUser ?
            <div className={classes.own_status_container}>
                {
                    !editMode &&
                    <div onClick={ activateEditMode } className={classes.own_status}>
                        <span>{status ? status : <div>указать статус</div> }</span>
                    </div>
                }
                {
                    editMode &&
                    <div>
                        <div className={classes.edit_status_container} >
                            <div className={classes.edit_status}>
                                <input onBlur={ deactivateEditMode } onChange={ onStatusChange } autoFocus={true} type="text" value={ status }/>
                            </div>
                            {/*<div>*/}
                            {/*    <button className={classes.submit_status} onClick={ this.updateStatus }>Сохранить</button>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                }
            </div> :
            <>
                <div className={classes.status}>
                    <span>{props.status ? props.status : <div>статус не указан</div> }</span>
                </div>
            </>
        }
    </>

}

export default ProfileStatus;