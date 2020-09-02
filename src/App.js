import React, {useState, useEffect, useRef} from "react";
import "./App.css";
import dayjs from "dayjs";
import styled from "styled-components";
import { useWindowSize } from "./useWindowSize";

const Container = styled.div`
    display: flex;
    justify-content: space-around;
    height: 100px;
    align-items: center;
`;

const Popup = styled.div`
    background-color: #f3f3f3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: ${props => `${props.height}px` ?? '100vh'};
`;

const PopupContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const PopupHeader = styled.div`
    margin-bottom: 10px;
    padding: 10px 10px 10px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #efefef;
    border-bottom: 1px solid #dedede;
`;

const PopContent = styled.div`
    flex-grow: 1;
    padding: 0 28px 0 28px;
    overflow-y: scroll;
`;

const MessageContainer = styled.div`
    display: flex;
    margin-bottom: 15px;
    position: relative;
    flex-direction: ${props => (props.reverse ? "row" : "row-reverse")};
`;

const MessageContent = styled.div`
    word-break: break-all;
    background-color: ${props => (props.messColor ? "white" : "rgb(167, 232, 120)")};
    border-radius: 10px;
    padding: 10px 15px;
    &::before {
        content: "";
        width: 0px;
        height: 0px;
        position: absolute;
        border: 8px solid ${props => (props.messBefore ? "white" : "rgb(167, 232, 120)")};
        border-radius: 20%;
        transform: rotate(-45deg);
        left: ${props => (props.messBefore ? "61px" : "calc(100vw - 133px)")};
        top: 17px;
    }
`;

const MessageAvatar = styled.img`
    width: 3rem;
    height: 3rem;
    border-radius: 5px;
    margin: ${props => (props.avatar ? "0 20px 0 0" : "0 0 0 20px")};
`;

const MessageTime = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TimeContainer = styled.div`
    font-size: 0.3rem;
    opacity: 0.6;
    margin-top: 0.4rem;
`;

const MessageInput = styled.textarea`
    padding: 5px 10px;
    flex-grow: 1;
    resize: none;
    background-color: white;
    border: none;
    border-radius: 5px;
    line-height: 1.15;
    font-size: 1.2rem;
    outline: none;
`;

const MessageBtn = styled.button`
    background-color: transparent;
    color: #007bf1;
    border: 2px solid #007bf1;
    border-radius: 3px;
    font-weight: 600;
    margin-left: 10px;
`;
const ItemName = styled.div`
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
`;

const MessageInputContainer = styled.div`
    margin-top: 1rem;
    padding: 10px 10px 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background-color: #ececec;
    border-top: 1px solid #dedede;
`;

let opts = {
    method: "POST", //请求方法
    body: JSON.stringify({
        ids: [
            "5e7dad9e4edf0252e778e591",
            "5e7c6dec4edf0252e778e4e1",
            "5e816415d38a4402b66c2316",
            "5e81632fd38a4402b66c2309",
        ],
        session: "5e6f0cb67734f35232ee533a",
    }),
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
};

const Message = ({_id, author, text, time}) => {
    return (
        <MessageContainer key={_id} reverse={author.login !== "client"}>
            <MessageAvatar avatar={author.login !== "client"} src={author.avatar} alt=""></MessageAvatar>
            <MessageContent messBefore={author.login !== "client"} messColor={author.login !== "client"}>
                {author.login !== "client" && (
                    <div style={{fontWeight: "700", marginBottom: ".4rem"}}>{author.name}</div>
                )}
                {text}
                <MessageTime>
                    <div />
                    <TimeContainer>{dayjs(time).format("HH:mm")}</TimeContainer>
                </MessageTime>
            </MessageContent>
        </MessageContainer>
    );
};

const Input = ({onSend}) => {
    const [text, setText] = useState("");
    const rows = text.split("\n").length;
    const send = () => {
        typeof onSend === "function" && text.length > 0 && onSend(text);
        setText("");
    };
    return (
        <MessageInputContainer>
            <MessageInput
                onKeyDown={e => {
                    if (e.keyCode === 13 && e.shiftKey === false) {
                        e.preventDefault();
                        send();
                    }
                }}
                value={text}
                onChange={e => setText(e.target.value)}
                rows={rows > 15 ? 15 : rows}
            />
            <MessageBtn onClick={send}>发送</MessageBtn>
        </MessageInputContainer>
    );
};

const ChatWindow = ({onClose}) => {
    const chatRef = useRef(null);

    const [messData, setmessData] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await fetch("https://api.globus.furniture/comments/forClient", opts);
            const data = await response.json();
            console.log(data);
            setmessData(data);
        })();
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight - chatRef.current.offsetHeight;
        }
    }, [messData]);

    const size = useWindowSize()

    return (
        <Popup height={size.height}>
            <PopupContainer>
                <PopupHeader>
                    <div />
                    <ItemName>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo earum omnis praesentium
                        necessitatibus natus eaque minima labore assumenda id cum error autem aspernatur recusandae,
                        maxime tempore? Inventore aliquid reiciendis nihil!
                    </ItemName>
                    <button
                        style={{border: "0", backgroundColor: "rgba(0,0,0,0)", fontSize: "1.2rem"}}
                        onClick={() => {
                            typeof onClose === "function" && onClose();
                        }}
                    >
                        ✖
                    </button>
                </PopupHeader>
                <PopContent ref={chatRef}>
                    {messData == null ? 'Loading...' : messData.map((element, i) => (
                        <Message key={element._id} {...element} />
                    ))}
                </PopContent>
                <Input onSend={console.log} />
            </PopupContainer>
        </Popup>
    );
};

const App = () => {
    const [opened, setOpened] = useState(false);
    return (
        <Container>
            <button
                onClick={() => {
                    setOpened(true);
                }}
            >
                Open chat
            </button>
            {opened && <ChatWindow onClose={() => setOpened(false)} />}
        </Container>
    );
};
export default App;
