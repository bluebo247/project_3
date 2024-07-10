import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';
import axios from "axios";
import './Charts2.css';


function Charts2() {
    const [heightData, setHeightData] = useState([]);
    const [selectedBarData, setSelectedBarData] = useState(null);
    const [mountainInfo, setMountainInfo] = useState(null);

    useEffect(() => {
        const heightFetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/ChartsHeight');
                setHeightData(response.data);
            } catch (error) {
                console.error('Error fetching ascending chart data:', error);
            }
        };

        heightFetchData();
    }, []);

    const handleBarClick = (data, index) => {
        setSelectedBarData(data);

        // 클릭된 막대의 범주를 가져옵니다.
        const category = data.name;

        // API를 호출하여 해당 범주에 속하는 산의 정보를 가져옵니다.
        axios.get(`http://localhost:4000/api/ChartsMountain?category=${category}`)
            .then(response => {
                // 서버로부터 받은 산의 정보를 저장합니다.
                setMountainInfo(response.data);
            })
            .catch(error => {
                console.error("Error fetching mountain info:", error);
            });
    };



    return (
        <div style={{ width: '70%', margin: "30px auto 0 auto" }}>
            <h4>고도별 산 개수</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    width={500}
                    height={300}
                    data={heightData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis dataKey="count" />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="count"
                        fill="#8884d8"
                        shape={<Rectangle fill="skyblue" stroke="blue" />}
                        onClick={(data, index) => handleBarClick(data, index)}
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* 팝업을 표시하는 부분 */}
            {selectedBarData && mountainInfo && (
                <div>
                    <h4>선택된 고도 범주: {selectedBarData.name}</h4>
                    <h5>산의 정보</h5>
                    <ul className='charts-mountain-pop-up'>
                        <li className='pop-up1'>산 이름</li>
                        <li className='pop-up2'>주소</li>
                        <li className='pop-up3'>높이</li>
                    </ul>
                        {mountainInfo.map(mountain => (
                            <ul className='charts-mountain-pop-up'>
                                <li className='pop-up1'>
                                    {mountain.MT_NAME}
                                </li>
                                <li className='pop-up2'>
                                    {mountain.MT_ADRESS}
                                </li>
                                <li className='pop-up3'>
                                    {mountain.MT_HEIGHT}
                                </li>
                            </ul>
                        ))}
                </div>
            )}
        </div>
    );
}

export default Charts2;
