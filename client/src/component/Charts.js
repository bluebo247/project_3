import React, {useState, useEffect} from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import axios from 'axios'

function Charts() {
    const [ascData, setAscData] = useState([]);
    const [descData, setDescData] = useState([]);

    useEffect(() => {
        const ascFetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/ChartsAsc');
                setAscData(response.data);
            } catch (error) {
                console.error('Error fetching ascending chart data:', error);
            }
        };

        ascFetchData();
    }, []);

    useEffect(() => {
        const descFetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/ChartsDesc');
                setDescData(response.data);
            } catch (error) {
                console.error('Error fetching descending chart data:', error);
            }
        };

        descFetchData();
    }, []);

    return (
        <div style={{width: '70%', margin: "auto"}}>

            <h4>불쾌지수가 낮은 산 Best 5 (09시 기준)</h4>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                    width={500}
                    height={200}
                    data={ascData.length > 0 ? ascData.slice(0, 5).map(item => ({
                        name: `${item.day.slice(5,10)} ${item.name}`,
                        uv: item.di,
                    })) : []}
                    syncId="anyId"
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis domain={[35,60]}/>
                    <Tooltip/>
                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8"/>
                </AreaChart>
            </ResponsiveContainer>

            <h4>불쾌지수가 높은 산 Worst 5 (09시 기준)</h4>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                    width={500}
                    height={200}
                    data={descData.length > 0 ? descData.slice(0, 5).map(item => ({
                        name: `${item.day.slice(5,10)} ${item.name}`,
                        pv: item.di,
                    })) : []}
                    syncId="anyId"
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis domain={[50,70]}/>
                    <Tooltip/>
                    <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d"/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Charts;
