import './App.css';
import React, {useEffect, useState} from "react";
import {Link, Route, Routes} from "react-router-dom";
import {Map,MapMarker} from "react-kakao-maps-sdk";
import Mountain from "./component/Mountain";
import MountainDetail from "./component/MountainDetail";
import Camping from "./component/Camping";
import CampingDetail from "./component/CampingDetail";
import axios from "axios";
function App() {

    const images = [
        process.env.PUBLIC_URL + '/images/image1.png',
        process.env.PUBLIC_URL + '/images/image2.png',
        process.env.PUBLIC_URL + '/images/image3.png'
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openIndex, setOpenIndex] = useState(null);
    const [fire, setFire] = useState([])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, 5000); // 이미지가 바뀌는 간격 (3초마다 변경되도록 설정)

        return () => clearInterval(interval); // 컴포넌트가 언마운트 될 때 인터벌을 정리합니다.
    }, [images.length]); // images 배열의 길이가 변경될 때마다 useEffect를 다시 실행합니다.
    const toggleSubmenu = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const [mountains, setMountains] = useState([]);

    useEffect(() => {
        fetchMountains();
    }, []);

    // 산 데이터를 가져오는 함수
    const fetchMountains = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/mountains');
            if (!response.ok) {
                throw new Error('Failed to fetch mountain list');
            }
            const data = await response.json();
            setMountains(data);
        } catch (error) {
            console.error('Error fetching mountain list:', error);
        }
    };

//  내위치마커
    const [state, setState] = useState({
        center: {
            lat: 33.450701,
            lng: 126.570667,
        },
        errMsg: null,
        isLoading: true,
    })

    useEffect(() => {
        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setState((prev) => ({
                        ...prev,
                        center: {
                            lat: position.coords.latitude, // 위도
                            lng: position.coords.longitude, // 경도
                        },
                        isLoading: false,
                    }))
                },
                (err) => {
                    setState((prev) => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: false,
                    }))
                }
            )
        } else {
            // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            setState((prev) => ({
                ...prev,
                errMsg: "geolocation을 사용할수 없어요..",
                isLoading: false,
            }))
        }
    }, [])

    useEffect(() => {
        const fetchFire = async () => {
            try {
                const response = await axios.get('http://localhost:5000/fire');  // 플라스크 애플리케이션의 엔드포인트 주소를 입력합니다.
                setFire(response.data);
                console.log(response)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchFire();
    }, []);

  return (
      <div className="App">

          <Routes>
              <Route path="/" element={
                  <>
                      <div className="main">
                          <section id="main_sec1">
                              <div className="slider">
                                  <img src={images[currentIndex]} alt="slide"/>
                                  <div className="text-overlay">
                                      <p>Climbing begins where the road ends</p>
                                      <span> 등산은 길이 끝나는 곳에서 시작된다</span>
                                  </div>
                              </div>
                          </section>

                          <section id="main_sec2">
                              <div className="video">
                                  <div className="sec2_img">
                                  <img src="../images/image4.png" alt="배경 이미지"/></div>
                                  <div className="play_icon">
                                      <h2>Mountain Forest</h2>
                                      <h3>등산과 숲길을 통해 자연을 느껴보세요</h3>
                                      <img src="../images/sec2_btn.png" alt="" className="sec2_btn"/>
                                      <p>Play Video</p>
                                  </div>
                              </div>
                          </section>

                          <section id="main_sec3">
                              <div className="location">
                                  <h2>가장 가까운 산은?</h2>

                                      <Map // 지도를 표시할 Container
                                          center={state.center}
                                          style={{
                                              // 지도의 크기
                                              width: "450px",
                                              height: "300px",
                                          }}
                                          level={3} // 지도의 확대 레벨
                                      >
                                          {!state.isLoading && (
                                              <MapMarker position={state.center}>
                                                  <div style={{padding: "5px", color: "#000"}}>
                                                      {state.errMsg ? state.errMsg : "여기에 계신가요?!"}
                                                  </div>
                                              </MapMarker>
                                          )}
                                      </Map>

                              </div>
                          </section>

                          <section id="main_sec4">
                              <h2>산불 실시간</h2>
                              <ul>
                                  <li>시간</li>

                              </ul>

                          </section>

                          <section id="main_sec5">
                              <h2>자연을 즐기는 등산</h2>
                              <div className="mt_videos">
                                  <iframe
                                      width="400"
                                      height="240"
                                      src="https://www.youtube.com/embed/fWpD32nw318"
                                      frameBorder="0"
                                      allow="autoplay; encrypted-media"
                                      allowFullScreen
                                  ></iframe>
                                  <iframe
                                      width="400"
                                      height="240"
                                      src="https://www.youtube.com/embed/1S5B0f1hr1E"
                                      frameBorder="0"
                                      allow="autoplay; encrypted-media"
                                      allowFullScreen
                                  ></iframe>
                                  <iframe
                                      width="400"
                                      height="240"
                                      src="https://www.youtube.com/embed/iyA0KNbeNJQ"
                                      frameBorder="0"
                                      allow="autoplay; encrypted-media"
                                      allowFullScreen
                                  ></iframe>
                                  <iframe
                                      width="400"
                                      height="240"
                                      src="https://www.youtube.com/embed/6ANv2UtAQRk"
                                      frameBorder="0"
                                      allow="autoplay; encrypted-media"
                                      allowFullScreen
                                  ></iframe>
                              </div>
                          </section>
                          <section id="main_sec6">
                              <div className="footer">
                                  <div className="foot">
                                      <div className="top">
                                          <div className="txt">
                                              <dl>
                                                  <dt>대표</dt>
                                                  <dd>손진익</dd>
                                              </dl>
                                              <dl>
                                                  <dt>사업자번호</dt>
                                                  <dd>220-88-18489</dd>
                                              </dl>
                                              <dl>
                                                  <dt>상호명</dt>
                                                  <dd>로미지안가든 주식회사</dd>
                                              </dl>
                                          </div>
                                          <div className="txt">
                                              <dl>
                                                  <dt>주소</dt>
                                                  <dd>강원특별자치도 정선군 북평면 어도원길 12 로미지안가든</dd>
                                              </dl>
                                              <dl>
                                                  <dt>영업시간</dt>
                                                  <dd>연중무휴 (오전 9시 ~ 오후 17시)</dd>
                                              </dl>
                                          </div>
                                          <div className="txt">
                                              <dl>
                                                  <dt>서울 사무소</dt>
                                                  <dd>02-3288-3377 (예약 및 단체문의)</dd>
                                              </dl>
                                              <dl>
                                                  <dt>정선 매표소</dt>
                                                  <dd>033-563-1826</dd>
                                              </dl>
                                              <dl>
                                                  <dt>정선 매표소(Mobile)</dt>
                                                  <dd>010-5295-3691</dd>
                                              </dl>
                                          </div>
                                      </div>
                                      <div className="bot">
                                          <div className="copyright">저작권 © 2023 지안바이오 주식회사. 모든 권리 보유.</div>
                                          <ul>
                                              <li><a href="https://www.instagram.com/romyziangarden/"><img
                                                  src="./romyziangarden_files/instagram_icon.png" alt=""/></a></li>
                                              {/* <li><a href="https://www.facebook.com/people/RomyZian-Garden/pfbid02nF3fJh1A4PoKe4RAFtjQCpyzEQYpnLdVGjnU6SirmXDnRoJ9gcvbXeQZ8enZAQnvl/"><img src="/images/common/facebook_icon.png" alt=""></a></li> */}
                                              {/* <li><a href=""><img src="/images/common/twitter_icon.png" alt=""></a></li> */}
                                              <li><a href="https://blog.naver.com/romyziangarden"><img
                                                  src="./romyziangarden_files/blog_icon.png" alt=""/></a></li>
                                              <li><a
                                                  href="https://www.youtube.com/channel/UCUfZXQ2VWIPDjVkA2691lFg"><img
                                                  src="./romyziangarden_files/youtube_icon.png" alt=""/></a></li>
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                          </section>
                      </div>
                  </>
              }/>
              <Route path="/mountain" element={<Mountain/>}/>
              <Route path="/mountains/:id" element={<MountainDetail />} />
              <Route path="/camping" element={<Camping />} />
              <Route path="/camping/:id" element={<CampingDetail />} />
          </Routes>
          <div className="nav">
              <ul>
                  <li><Link to="/">HOME</Link></li>
                  <li><Link to="/Mountain">MOUNTAIN</Link></li>
                  <li><Link to="#">FACILITIES</Link></li>
                  <li><Link to="#">BLOG</Link></li>
                  <li><Link to="#">ABOUT</Link></li>
              </ul>
          </div>
      </div>
  );
}

export default App;
