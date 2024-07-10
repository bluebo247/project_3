import React, {useState } from "react";
import './register.css'; // CSS 파일 import
import {Link} from 'react-router-dom';
import axios from "axios";

function Register({ setIsLogin, setLogin }) {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [realname, setRealName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/register', {
                userId: userId,
                password: password,
                nickname: nickname,
                realname: realname
            });
            if (response.status === 200) {
                console.log("회원가입 성공!");
                setErrorMessage('회원가입 성공!')
                // 회원가입 성공 처리
            } else if (response.status === 400) {
                console.log('이미 등록된 아이디입니다.');
                setErrorMessage('이미 등록된 아이디입니다.');
            } else {
                console.log("서버 오류로 회원가입에 실패했습니다.");
                setErrorMessage("회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원가입 요청 실패:", error);
            setErrorMessage('회원가입에 실패했습니다.')
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-image">
                    <img src="/images/login.jpg" alt="내 이미지"></img>
                </div>
                <div className="login-content">
                    <form className="login-form" onSubmit={handleSignup}>
                        <label htmlFor="userId">아이디</label>
                        <input type="text" id="userId" value={userId}
                               onChange={(e) => setUserId(e.target.value)} required/>
                        <label htmlFor="password">비밀번호</label>
                        <input type="password" id="password" value={password}
                               onChange={(e) => setPassword(e.target.value)} required/>
                        <label htmlFor="nickname">닉네임</label>
                        <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)}
                               required/>
                        <label htmlFor="nickname">이름</label>
                        <input type="text" id="realname" value={realname} onChange={(e) => setRealName(e.target.value)}
                               required/>
                        <button type="submit" className="login-button">가입하기</button>
                        <Link to='/login'><button className="login-button">뒤로</button></Link>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
            </div>
        </>
    );
}


export default Register;
