import React, { useState, useEffect } from 'react';
import './CampingDetail.css'
import { useParams } from 'react-router-dom';
function CampingDetail() {
    const { id } = useParams();
    const [campingDetail, setCampingDetail] = useState(null);

    useEffect(() => {
        const fetchCampingDetail =async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/camping/${id}`);
                if (!response.ok) {
                    throw new Error('캠핑정보를 가져오는데 실패했습니다.');
                }
                const data = await response.json();
                setCampingDetail(data);
            } catch (error) {
                console.error('Error fetching camping:', error);
            }
        }

        fetchCampingDetail();
    }, [id]);

    if (!campingDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="camping">
            <section id="sec1" className="CD_sec1">
                <img src="../images/camp1.png" alt="배경 이미지"/>
                <div className="text-overlay">
                    <p>지금,여기서</p>
                    <span>행복할 것</span>
                </div>
            </section>
            <div className="camp_name">
                <h2>{campingDetail.NAME}</h2>
            </div>
            <section id="sec2" className="detail">
                <div className="camp_info">
                    <p>소개: {campingDetail.LINEINTRO}</p>
                    <p>위치: {campingDetail.ADDR}</p>
                    <p>시설: {campingDetail.FACILITY}</p>
                    <p>위도: {campingDetail.LATI}</p>
                    <p>경도: {campingDetail.LONGI}</p>
                </div>
                <div className="camp_img">
                    {campingDetail.IMGURL && <img src={campingDetail.IMGURL} alt={campingDetail.NAME}/>}
                </div>

                {/* Display other camping details as needed */}
            </section>
            <section id="sec3" className="third">
                <div className="dd">
                    dddd
                </div>
            </section>
        </div>
    );
}

export default CampingDetail;
