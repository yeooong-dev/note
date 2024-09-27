import React, { useEffect, useState } from "react";
import styled from "styled-components";
import bgWhiteImg from "./assets/white-img.jpg";
import bgDarkImg from "./assets/dark-img.jpg";
import Modal from "./Modal";
import { MdOutlineToggleOff } from "react-icons/md";
import { MdToggleOn } from "react-icons/md";

const Note = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const showModal = () => {
        setModalIsOpen(true);
    };
    const closeModal = () => {
        setModalIsOpen(false);
    };

    // 메모 추가, 수정
    const [notes, setNotes] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
    const [currentEditIndex, setCurrentEditIndex] = useState(null); // 수정 중인 메모의 인덱스

    // 새로고침시 로컬스토리지에서 메모 불러오기
    useEffect(() => {
        const saveNotes = localStorage.getItem("notes");
        if (saveNotes) {
            setNotes(JSON.parse(saveNotes));
        }
    }, []);

    // 업데이트 시간 보여주기
    const formatDate = (date) => {
        if (!date) return "날짜 없음";

        try {
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Seoul",
            };
            return new Intl.DateTimeFormat("ko-KR", options).format(new Date(date));
        } catch (error) {
            return "잘못된 날짜";
        }
    };

    const addNote = (newNote) => {
        const updatedNotes = [
            ...notes,
            { id: Date.now(), text: newNote, createdAt: new Date(), updatedAt: new Date() },
        ];
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
    };

    const updateNote = (updateText) => {
        const updatedNotes = notes.map((note, i) => {
            if (i === currentEditIndex) {
                return { ...note, text: updateText, updatedAt: new Date().toISOString() };
            }
            return note;
        });
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setIsEditing(false); // 수정 완료 후 수정 모드 해제
    };

    const openEditModal = (id) => {
        setIsEditing(true); // 수정 모드 활성화
        const noteIndex = notes.findIndex((note) => note.id === id); // id로 인덱스 찾기
        setCurrentEditIndex(noteIndex); // 인덱스를 설정
        setModalIsOpen(true); // 모달 열기
    };

    // 리스트 글자수 제한
    const MAX_LENGTH = 13;
    const truncateText = (text) => {
        if (text.length > MAX_LENGTH) {
            return text.slice(0, MAX_LENGTH) + "...";
        }
        return text;
    };

    // 메모 삭제
    const deleteNote = (id) => {
        const newNotes = notes.filter((note) => note.id !== id); // id로 메모 삭제
        setNotes(newNotes);
        localStorage.setItem("notes", JSON.stringify(newNotes));
    };

    // 정렬 기능
    const [sortOption, setSortOption] = useState("recentAdded");

    const sortNotes = (option, notesList) => {
        if (option === "recentAdded") {
            return notesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (option === "recentUpdated") {
            return notesList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        return notesList;
    };

    // 검색 기능
    const [searchTerm, setSearchTerm] = useState("");

    // 검색어에 맞게 필터링된 메모 리스트 생성
    const filteredNotes = notes
        .filter((note) => note.text.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            return sortOption === "recentUpdated"
                ? new Date(b.updatedAt) - new Date(a.updatedAt)
                : new Date(b.createdAt) - new Date(a.createdAt);
        });

    // 다크 모드
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const backgroundImage = isDarkMode ? bgDarkImg : bgWhiteImg;
    const noteWrapStyles = {
        background: isDarkMode ? "rgba(32, 32, 32, 0.459)" : "rgba(255, 255, 255, 0.535)",
        color: isDarkMode ? "#fff" : "#000",
    };
    const topStyles = { background: isDarkMode ? "rgba(85, 85, 85, 0.396)" : "rgba(255, 255, 255, 0.535)" };

    const searchInputStyles = {
        backgroundColor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
    };

    const selectBoxStyles = {
        backgroundColor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
    };

    return (
        <Wrap style={{ backgroundImage: `url(${backgroundImage})` }}>
            <NoteWrap style={noteWrapStyles}>
                <Top>
                    <LeftBtn>
                        <div style={{ background: "#e75640" }}></div>
                        <div style={{ background: "#edb544" }}></div>
                        <div style={{ background: "#5cc439" }}></div>
                    </LeftBtn>
                    <RightBtn onClick={toggleDarkMode}>
                        {isDarkMode ? <MdOutlineToggleOff className='white' /> : <MdToggleOn className='white' />}
                    </RightBtn>
                </Top>
                <h1>메모</h1>
                <Middle>
                    <Search
                        placeholder='검색'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={searchInputStyles}
                    />
                    <Array action='#' style={searchInputStyles}>
                        <label htmlFor='array' style={{ display: "none" }}>
                            정렬
                        </label>
                        <select
                            name='array'
                            id='array'
                            onChange={(e) => setSortOption(e.target.value)}
                            style={selectBoxStyles}
                        >
                            <option value='recentAdded'>최근등록순</option>
                            <option value='recentUpdated'>최근수정순</option>
                        </select>
                    </Array>
                </Middle>

                <ListWrap>
                    {filteredNotes.map((note) => {
                        return (
                            <div
                                key={note.id}
                                onClick={() => openEditModal(note.id)}
                                className='column'
                                style={topStyles}
                            >
                                <div className='flex'>
                                    <p>{truncateText(note.text)}</p>
                                    <p>{formatDate(note.updatedAt)}</p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // 메모 클릭과 충돌 방지
                                        deleteNote(note.id);
                                    }}
                                >
                                    제거
                                </button>
                            </div>
                        );
                    })}
                </ListWrap>
                <Bottom>
                    <AddBtn
                        onClick={() => {
                            setIsEditing(false); // 새 메모 모드로 진입
                            setCurrentEditIndex(null); // 인덱스 초기화
                            setModalIsOpen(true); // 모달 열기
                        }}
                    >
                        새 메모
                    </AddBtn>
                </Bottom>
            </NoteWrap>
            <Modal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onSubmit={isEditing ? updateNote : addNote}
                initialText={isEditing && currentEditIndex !== null ? notes[currentEditIndex]?.text : ""} // 새 메모는 빈 값
                isEditing={isEditing}
                isDarkMode={isDarkMode}
            />
        </Wrap>
    );
};

export default Note;

const Wrap = styled.div`
    width: 100%;
    height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-image 0.4s ease-in-out;
`;

const NoteWrap = styled.div`
    position: relative;
    width: 80%;
    max-width: 500px;
    height: 76vh;
    border-radius: 30px;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const LeftBtn = styled.div`
    display: flex;
    gap: 10px;

    div {
        width: 15px;
        height: 15px;
        border-radius: 50%;
    }

    @media only screen and (max-width: 550px) {
        gap: 8px;

        div {
            width: 13px;
            height: 13px;
        }
    }
`;

const RightBtn = styled.div`
    width: 55px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    .white {
        font-size: 55px;
        color: rgba(255, 255, 255, 0.648);
        cursor: pointer;
    }

    @media only screen and (max-width: 550px) {
        width: 50px;
    }
`;

const Middle = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`;

const Search = styled.input`
    width: 60%;
    height: 30px;
    border-radius: 5px;
    border: none;
    padding-left: 1rem;
    font-size: 16px;
`;

const Array = styled.form`
    width: 40%;
    height: 33px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;

    select {
        width: 90%;
        height: 100%;
        background: none;
        border: none;
        font-size: 0.9rem;
    }
`;

const ListWrap = styled.div`
    width: 100%;
    height: 450px;
    overflow-y: scroll;

    .column {
        width: 100%;
        height: 100px;
        background: white;
        margin-bottom: 10px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    p:first-child {
        padding: 0 0 0 20px;
        font-size: 1.4rem;
        font-weight: bold;
        margin: 0;
    }

    p:last-child {
        padding: 5px 0 0 20px;
        font-size: 0.9rem;
        margin: 0;
        color: gray;
    }

    button {
        border: none;
        width: 50px;
        height: 30px;
        background: #e75640;
        color: white;
        cursor: pointer;
        border-radius: 5px;
        margin-right: 1rem;
    }

    @media only screen and (max-width: 550px) {
        p:first-child {
            font-size: 1rem;
        }

        p:last-child {
            font-size: 0.7rem;
        }

        button {
            width: 50px;
            height: 25px;
            font-size: 12px;
        }
    }
`;

const Bottom = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
`;

const AddBtn = styled.button`
    width: 100px;
    height: 45px;
    background: #4675ed;
    color: white;
    border-radius: 8px;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;

    @media only screen and (max-width: 550px) {
        width: 70px;
        height: 35px;
        font-size: 14px;
    }
`;
