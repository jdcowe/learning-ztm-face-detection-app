import React from 'react'
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
    return (
        <div>
            <div className='center ma'>
                <div className='absolute mt2'>
                    <img id='inputImage' alt='face recognition' src={imageUrl} width='500px' height='auto'/>
                    <div className='bounding-box' style={{top: box.topRow, right: box.leftCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                </div>
            </div>
        </div>
    )
}

export default FaceRecognition;
