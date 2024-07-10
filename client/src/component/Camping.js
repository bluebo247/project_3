import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Camping.css'

function Camping() {
    const [camping, setCamping] = useState([]);

    useEffect(() => {
        async function fetchCamping() {
            try {
                const response = await axios.get('http://localhost:4000/api/camping');
                setCamping(response.data);
            } catch (error) {
                console.error('Error fetching camping:', error);
            }
        }

        fetchCamping();
    }, []);

    return (
        <div>
            <section id="cam_sec1">
                <img src="../images/camp1.png" alt="배경 이미지"/>
                <div className="text-overlay">
                    <p>지금,여기서</p>
                    <span>행복할 것</span>
                </div>
            </section>
            <h1>Campings</h1>
                <div className="camp-box">
                    {camping.slice(0, 4).map((camping, id) => (
                       <div className="camp_list" key={camping.ID}>
                            <Link to={`/camping/${camping.ID}`}>
                            <p>name: {camping.NAME}</p>
                            <p>intro: {camping.LINEINTRO}</p>
                        </Link>
                        {camping.IMGURL && (
                            <img src={camping.IMGURL} alt={camping.NAME} />
                        )}
                       </div>
                    ))}
                </div>
        </div>
    );
}

export default Camping;
