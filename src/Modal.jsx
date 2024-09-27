import React, { useEffect, useRef, useState } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";

const Modal = ({ isOpen, onClose, onSubmit, initialText = "", isEditing, isDarkMode }) => {
    const textareaRef = useRef(null);
    const [text, setText] = useState(initialText); // 초기값 설정

    useEffect(() => {
        setText(typeof initialText === "string" ? initialText : ""); // initialText가 변경될 때마다 텍스트 상태 업데이트
    }, [initialText]);

    // 모달 열렸을 때 textarea에 포커스 설정
    const handleAfterOpen = () => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    // 메모 추가 또는 수정
    const [note, setNote] = useState([]);

    const handleSubmit = () => {
        if (text.trim()) {
            onSubmit(text); // 부모 컴포넌트로 텍스트 전달
            setText("");
            onClose();
        }
    };

    // 모달이 닫힐 때도 자동으로 저장
    const handleClose = () => {
        if (text.trim()) {
            onSubmit(text);
        }
        setText("");
        onClose(); // 이 부분에서 onClose를 함수로 호출
    };

    // textarea 내용 변경 시 상태 업데이트
    const handleChange = (e) => {
        setText(e.target.value);
    };

    // 첫 번째 줄의 글자 크기를 크게 하기 위해 각 줄을 계산
    const getLineStyles = (lineIndex) => {
        return lineIndex === 0 ? "2rem" : "1rem";
    };

    // 다크모드
    const modalStyles = {
        backgroundColor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
    };

    return (
        <>
            {isOpen ? (
                <ReactModal
                    isOpen={true}
                    onAfterOpen={handleAfterOpen}
                    ariaHideApp={false}
                    onRequestClose={handleClose} // 모달 닫힐 때 텍스트 저장
                    className='w-[50%] h-[58vh] mt-[10%] m-auto bg-bgColor text-lg rounded-[10px] drop-shadow-lg'
                    overlayClassName='modal-overlay'
                >
                    <ModalWrap style={modalStyles}>
                        <StyledTextarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleChange}
                            placeholder='메모를 작성해주세요.'
                            isDarkMode={isDarkMode}
                        />
                        <p onClick={handleSubmit}>{isEditing ? "확인" : "추가"}</p>
                    </ModalWrap>
                </ReactModal>
            ) : null}
        </>
    );
};

export default Modal;

const ModalWrap = styled.div`
    width: 80%;
    max-width: 400px;
    min-width: 230px;
    height: 60vh;
    border-radius: 20px;
    padding: 2rem;
    outline: none;
    position: relative;
    transition: background-color 0.5s ease-in-out, color 0.5s ease-in-out;
    margin: auto;

    p {
        position: absolute;
        top: 0;
        right: 15px;
        color: #edb544;
        cursor: pointer;
        font-size: 1.2rem;
        text-align: right;
        margin-bottom: 10px;
    }

    @media only screen and (max-width: 550px) {
        width: 70%;

        p {
            font-size: 1rem;
        }
    }
`;

const StyledTextarea = styled.textarea`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
    caret-color: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#000")};
    background-color: ${({ isDarkMode }) => (isDarkMode ? "rgb(51, 51, 51)" : "#fff")};
    color: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#000")};
    font-size: ${({ value }) => {
        const lines = (value || "").split("\n");
        return lines.length === 1 ? "2rem" : "1rem";
    }};
    line-height: 1.5;
    transition: background-color 0.5s ease-in-out, color 0.5s ease-in-out;

    @media only screen and (max-width: 550px) {
        font-size: ${({ value }) => {
            const lines = (value || "").split("\n");
            return lines.length === 1 ? "1.2rem" : "0.8rem";
        }};
    }
`;

// 모달 오버레이의 스타일을 지정하는 CSS
const customStyles = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7); /* 어두운 배경 */
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

// 스타일을 페이지에 삽입
const styleTag = document.createElement("style");
styleTag.innerHTML = customStyles;
document.head.appendChild(styleTag);
