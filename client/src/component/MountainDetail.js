import React, {useEffect, useState, useRef} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import './MountainDetail.css'
import {Map,MapMarker} from "react-kakao-maps-sdk";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MountainDetail() {
    const {id} = useParams(); // URL 파라미터에서 id 추출
    const [data, setData] = useState([]);
    // 산의 상세 정보를 저장할 상태 변수
    const [mountainDetail, setMountainDetail] = useState(null);
    const [camping, setCamping] = useState([]);
    const [campingList, setCampingList] = useState([]);

    useEffect(() => {
        const fetchMountainDetail = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/mountains/${id}`);
                if (!response.ok) {
                    throw new Error('산 상세 정보를 가져오는 데 실패했습니다');
                }
                const data = await response.json();
                setMountainDetail(data);
            } catch (error) {
                console.error('산 상세 정보를 가져오는 중 오류 발생:', error);
            }
        };

        fetchMountainDetail(); // fetchMountainDetail 함수를 의존성 배열에 추가
    }, [id]); // id가 변경될 때마다 useEffect가 다시 실행됨

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/data');  // 플라스크 애플리케이션의 엔드포인트 주소를 입력합니다.
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


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

    useEffect(() => {
        // 마커에 찍힌 캠핑장들의 정보를 기반으로 리스트 생성
        const generateCampingList = () => {
            const newList = camping
                .filter(camp => {
                    const distance = calculateDistance(
                        mountainDetail.MT_LATITUDE,
                        mountainDetail.MT_LONGITUDE,
                        camp.LATI,
                        camp.LONGI
                    );
                    return distance <= 10;
                })
                .map(camp => ({
                    id: camp.ID,
                    name: camp.NAME
                }));
            setCampingList(newList);
        };

        if (mountainDetail && camping.length > 0) {
            generateCampingList();
        }
    }, [mountainDetail, camping]);
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/search?query=가야산`);
                setBlogs(response.data.items);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (mountainDetail) {
            fetchData();
        }
    }, [mountainDetail]);




    const sliderRef = useRef(null);

    // 이전 슬라이드로 이동하는 함수
    const goToPrevSlide = () => {
        sliderRef.current.slickPrev();
    };

    // 다음 슬라이드로 이동하는 함수
    const goToNextSlide = () => {
        sliderRef.current.slickNext();
    };
    // 산의 상세 정보를 표시

    function WeatherComponent(props) {
        if (5 < props.time && props.time < 21) {
            if (props.rainp < 20) {
                return <img className='weather-image' src='/images/sunny.png'/>;
            } else if (props.rainp === 20) {
                return <img className='weather-image' src='/images/sunny-cloud.png'/>;
            } else if (props.rainp <= 30) {
                return <img className='weather-image' src='/images/cloud.png'/>;
            } else {
                return <img className='weather-image' src='/images/rain.png'/>
            }
        } else {
            if (props.rainp < 20) {
                return <img className='weather-image' src='/images/moon.png'/>;
            } else if (props.rainp === 20) {
                return <img className='weather-image' src='/images/moon-cloud.png'/>;
            } else if (props.rainp <= 30) {
                return <img className='weather-image' src='/images/cloud.png'/>;
            } else {
                return <img className='weather-image' src='/images/rain.png'/>;
            }
        }
    }


    return (
        <div className="mountain-detail">
            {mountainDetail ? (
                <div className='mountain-detail-info'>
                    <div className='mountain-detail-info-bundle'>
                        <img
                            src={`/images/mt_${mountainDetail.id}.jpg`} // 이미지 파일 이름을 변경
                            alt={mountainDetail.MT_NAME}
                            className="mountain-detail-image"
                        />
                        <div className='mountain-detail-info-text'>
                            <div><span className='info-text-name'>{mountainDetail.MT_NAME}</span></div>
                            <br/>
                            <div className='info-text-adress'><span>{mountainDetail.MT_ADRESS}</span></div>
                            <div className='info-text-height'><span>{mountainDetail.MT_HEIGHT}M</span></div>
                            <div className='info-box'><span className='info-box-color'>상세정보</span></div>
                            <div className='info-text-information'
                                 style={{'marginTop': '10px'}}>{mountainDetail.MT_INFO}</div>
                        </div>
                    </div>
                    <div className='mountain-weather'>
                        <div className="weather_container">
                            <ul>
                                <li className='weather-nonbox' style={{border: '0', padding: '1px'}}></li>
                                {data.map((item, index) => (
                                    mountainDetail.id === item[1] ? (
                                        <>
                                            <li className='weather-nonbox'
                                                style={{border: '0', padding: '1px'}}>{item[3].slice(6, 8) === "00" ? (
                                                <div className='color-box'>{item[3].slice(0, 5)}</div>
                                            ) : (null)}</li>
                                        </>
                                    ) : null
                                ))}
                            </ul>
                            <div className="jonhee">
                                <ul>
                                    <li>시간</li>
                                    {data.map((item, index) => (
                                        mountainDetail.id === item[1] ? (
                                            <>
                                                <li>{item[3].slice(6, 8)}시</li>
                                            </>
                                        ) : null
                                    ))}
                                </ul>
                                <ul className='weather-box'>
                                    <li>날씨</li>
                                    {data.map((item, index) => (
                                        mountainDetail.id === item[1] ? (
                                            <>
                                                <li><WeatherComponent
                                                    time={item[3].slice(6, 8)}
                                                    rainp={item[4]}/></li>
                                            </>
                                        ) : null
                                    ))}
                                </ul>
                                <ul>
                                    <li>기온</li>
                                    {data.map((item, index) => (
                                        mountainDetail.id === item[1] ? (
                                            <>
                                                <li>{item[5]}˚C</li>
                                            </>
                                        ) : null
                                    ))}
                                </ul>
                                <ul>
                                    <li>강수확률</li>
                                    {data.map((item, index) => (
                                        mountainDetail.id === item[1] ? (
                                            <>
                                                <li>{item[4]}%</li>
                                            </>
                                        ) : null
                                    ))}
                                </ul>

                                <ul className='windlist'>
                                    <li>바람</li>
                                    {data.map((item, index) => (
                                        mountainDetail.id === item[1] ? (
                                            <>
                                                <li className='windicon'>
                                                    <div><img
                                                        src='/images/wind-icon.png'
                                                        style={{
                                                            transform: `rotate(${item[7]}deg)`,
                                                            width: '22px'
                                                        }}
                                                    /></div>
                                                    <div className='windresult'>{item[8]}</div>
                                                </li>
                                            </>
                                        ) : null
                                    ))}
                                </ul>
                                <ul>
                                    <li>습도</li>
                                    {data.map((item, index) => (
                                        mountainDetail.id === item[1] ? (
                                            <>
                                                <li>{item[6]}%</li>
                                            </>
                                        ) : null
                                    ))}
                                </ul>
                                <ul>
                                    <li>불쾌지수</li>
                                    {data.map((item, index) => (
                                        mountainDetail.id === item[1] ? (
                                            <>
                                                <li>{item[9]}</li>
                                            </>
                                        ) : null
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="sec_3map">
                        <div className="mapmaker">
                            <Map
                                center={{lat: mountainDetail.MT_LATITUDE, lng: mountainDetail.MT_LONGITUDE}}
                                style={{width: "100%", height: "600px"}}
                            >
                                <MapMarker position={{lat: mountainDetail.MT_LATITUDE, lng: mountainDetail.MT_LONGITUDE}}>
                                    <div style={{color: "#000"}}>{mountainDetail.MT_NAME}</div>
                                </MapMarker>
                                {camping.map((camping, index) => {
                                    const distance = calculateDistance(
                                        mountainDetail.MT_LATITUDE,
                                        mountainDetail.MT_LONGITUDE,
                                        camping.LONGI,
                                        camping.LATI
                                    );
                                    if (distance <= 10) {
                                        return (
                                            <MapMarker key={index} position={{lat: camping.LONGI, lng: camping.LATI}}>
                                                <div className='marker-style'>{camping.NAME}</div>
                                            </MapMarker>
                                        );
                                    }
                                    return null;
                                })}
                            </Map>
                            <div className="Naver_blog">
                                <h1>Blog Posts</h1>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <ul>
                                        {blogs.map((blog, index) => (
                                            <li key={index}>
                                                <div className="posts">
                                                    <a href={blog.link} target="_blank" rel="noopener noreferrer">
                                                        {blog.title}
                                                    </a>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="camp-container">
                            <div className="camp_list_21">
                                <h2>주변 캠핑장</h2>
                                <Slider dots={true} slidesToShow={5} slidesToScroll={1}>
                                    {camping.filter((camping) => {
                                        const distance = calculateDistance(
                                            mountainDetail.MT_LATITUDE,
                                            mountainDetail.MT_LONGITUDE,
                                            camping.LONGI,
                                            camping.LATI
                                        );
                                        return distance <= 10 && camping.IMGURL;
                                    }).map((camping, index) => (
                                        <div className="camp_list" key={index}>
                                            <div className="camp_img1">
                                                {camping.IMGURL && (
                                                    <img src={camping.IMGURL} alt={camping.NAME}
                                                         style={{maxWidth: "300px", maxHeight: "200px"}}/>
                                                )}

                                                <Link to={`/camping/${camping.ID}`}>
                                                    <p>{camping.NAME}</p>
                                                    <span>{camping.ADDR}</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>로딩 중...</p>
            )}

        </div>

    );
}


export default MountainDetail;