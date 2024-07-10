import "./Chatbot.css";
// import image from "./img/bot_image.jpg";
import {useState, useRef, useEffect} from "react";
// import { useHistory } from "react-router-dom"; // react-router-dom의 useHistory를 추가

function Chatbot() {
    const [currentStage, setCurrentStage] = useState("initial");
    const [userInputText, setUserInputText] = useState('');
    const [botMessage, setBotMessage] = useState({ text: '', isHTML: false });
    const inputRef = useRef();
    const history = useHistory(); // useHistory를 초기화

    useEffect(() => {
        setBotMessage({ text: "안녕하세요! 무엇이 궁금하신가요?", isHTML: false });
    }, []);

    const handleInput = () => {
        const userInput = inputRef.current.value.toLowerCase();
        setUserInputText(userInput);
        let response = { text: "I'm sorry, I didn't understand that.", isHTML: false };

        if (userInput.includes("안녕")) {
            response = { text: "안녕하세요! 궁금한 점이 있다면 말씀해주세요!", isHTML: false };
        } else if (userInput.includes("백대명산")) {
            response = { text: "백대명산의 정보를 제공합니다. 지역을 입력해주세요:\n1. 서울/경기\n2. 강원\n3. 충북\n...", isHTML: false };
            setCurrentStage("selectRegion");
        } else if (currentStage === "selectRegion") {
            response = handleRegionSelection(userInput);
            setCurrentStage("initial");
        }

        setBotMessage(response);
        inputRef.current.value = ""; // 입력 필드 초기화
    };

    const handleRegionSelection = (input) => {
        switch (input) {
            case "1":
            case "서울":
            case "경기":
                return { text: `서울과 경기 지역에 대한 정보를 확인하시려면 <a href="http://localhost:3000/Mountain">여기</a>를 클릭하세요.`, isHTML: true };
            case "2":
            case "강원":
                return { text: "강원 지역에 대한 정보입니다.", isHTML: false };
            default:
                return { text: "올바른 지역 번호를 입력해주세요.", isHTML: false };
        }
    };

    // 이동 처리 함수
    const handleLinkClick = () => {
        // 여기서 지정한 값을 사용하여 fetch 요청을 보내고 데이터를 가져올 수 있음
        history.push("/Mountain", { region: userInputText }); // 해당 경로로 이동하며 region 값을 전달
    };

    return (
        <div className="Chatbot">
            <div className="wrapper">
                <div className="content">
                    <div className="header">
                        <div className="name">ChatBot</div>
                        <div className="status">Active</div>
                    </div>
                    <div className="main">
                        <div className="main_content">
                            <div className="messages">
                                {botMessage.isHTML ? (
                                    <div dangerouslySetInnerHTML={{ __html: botMessage.text }} />
                                ) : (
                                    <div>{botMessage.text}</div>
                                )}
                                <div className="human-message">{userInputText}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="btm">
                            <div className="input">
                                <input
                                    type="text"
                                    placeholder="Enter your message"
                                    ref={inputRef}
                                    onKeyPress={(event) => event.key === 'Enter' && handleInput()}
                                />
                            </div>
                            <div className="btn">
                                <button onClick={handleLinkClick}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
