import React, {useState} from "react";
import './login.css'; // CSS 파일 import
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";


function Login({ setIsLogin, setLogin }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const onEmailHandler = (event) => {
        setUserId(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/login', {
                userId: userId,
                password: password
            });
            console.log(response.data);
            if (response.data.message === 'Login successful!') {
                console.log("로그인 성공!");
                setIsLogin(true);
                setLogin({ userid: response.data.user.userid, nickname: response.data.user.nickname });
                navigate('/');
            } else {
                console.log("로그인 실패: 잘못된 자격증명");
            }
        } catch (error) {
            console.error("로그인 요청 실패:", error);
            setErrorMessage("아이디 혹은 비밀번호가 확인되지않습니다.");
        }
    };


    return (
        <>
            <div className="login-container">
                <div className="login-image">
                    <img src="/images/login.jpg" alt="내 이미지"></img>
                </div>
                <div className="login-content">
                    <form className="login-form" onSubmit={onSubmitHandler}>
                        <label htmlFor="userId">아이디</label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={onEmailHandler}
                            placeholder="아이디를 입력하세요"
                        />
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={onPasswordHandler}
                            placeholder="비밀번호를 입력하세요"
                        />
                        <button type="submit" className="login-button">로그인</button>
                        <button type="submit" className="login-naver">네이버</button>
                        <button type="submit" className="login-kakao">카카오</button>
                        <Link to='/register'><button type="submit" className='register-button'>회원가입</button></Link>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
            </div>
        </>
    );
}


export default Login;
