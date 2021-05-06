import React, {useEffect, useState} from 'react';

import Confetti from 'react-dom-confetti';

/**
 * Component for the content published successfully page in the CMS.
 * @returns {JSX.Element}
 * @constructor
 */
const PublishSuccess = () => {
    /* State to trigger the confetti */
    const [showConfetti, setShowConfetti] = useState(false)

    /* Runs on component mount and scrolls content into view and triggers confetti */
    useEffect(() => {
        document.getElementById("content-view").scrollIntoView();
        setShowConfetti(true)
    }, [])

    /* display the popup component */
    return (
        <div className="success-page">
            <span className="confetti">
                <Confetti
                    active={ showConfetti } config={{
                    angle: "121",
                    spread: 360,
                    startVelocity: "50",
                    elementCount: "97",
                    dragFriction: 0.12,
                    duration: "3730",
                    stagger: 3,
                    width: "10px",
                    height: "10px",
                    perspective: "500px",
                    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
                }}/>
            </span>
            <div className="success-message">
                <h1>Confirmation!</h1>
                <i className="far fa-laugh-beam fa-7x"/>
                <h2>Content Published Successfully <i className="far fa-check-circle" /></h2>
                <div>
                    <div
                        onClick={() => {
                            window.location.href = "/cms-dashboard"
                        }}
                        className="site-button"
                    >
                        <p>Okay</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PublishSuccess