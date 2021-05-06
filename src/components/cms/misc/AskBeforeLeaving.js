import React, {useState} from "react"
import SiteAlert from "./SiteAlert";

// TODO Build this out.
const AskBeforeLeaving = (props) => {
    const [showAlert, setShowAlert] = useState(false)

    return (
        props.hasUnsavedChanges
            ? <SiteAlert
                showAlert={showAlert}
                alertType={"confirmation"}
                alertTitle="Unsaved changes"
                message='Your unsaved changes will be lost'
                onConfirm={() => {setShowAlert(false)}}
                onCancel={() => {setShowAlert(false)}}
              />
              : <></>
    )
}

export default AskBeforeLeaving