import React from "react"
import {useHistory} from "react-router-dom";

const CMSOption = (props) => {
    const history = useHistory()

    return (
        <div className={`cms-option ${props.rectangular ? "rectangular" : ""}`}
             onClick={() => {
                 history.push(props.link)
             }}
        >
            <div>
                {props.icon}
                <p className="option-text">
                    {props.text}
                </p>
            </div>
        </div>
    )

}

export default CMSOption