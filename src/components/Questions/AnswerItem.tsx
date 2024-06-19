import { AnswerDetail, AnswerVote } from "../../types/question";
import { QuestionDetail } from "../../types/question";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useInfoStore } from "../../store";
import authStore from "../../store/authStore";
import { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";

import ReactQuillModule from "./ReactQuillModule";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "../../styles/index.scss";

interface AnswerItemProps {
  answer: AnswerDetail;
  refreshAnswers: () => Promise<void>;
  isQuestionAuthor: boolean;
  handleSelectAnswer: (answerId: string) => Promise<void>;
}

export default function AnswerItem({
  answer,
  refreshAnswers,
  isQuestionAuthor,
  handleSelectAnswer,
}: AnswerItemProps) {
  const { authToken } = authStore();
  const userData = useInfoStore((state) => state.userInfo);
  const [questionData, setQuestionData] = useState<QuestionDetail>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(answer.answerContent);
  const QuillRef = useRef<ReactQuill>();
  const navigate = useNavigate();
  const [voteCount, setVoteCount] = useState<number>(answer.voteCount);
  const [voteState, setVoteState] = useState<null | boolean>(null); // null: no vote, true: like, false: dislike
  const [selected, setSelected] = useState(answer.isSelected);

  // 수정
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(answer.answerContent);
  };

  // 수정된 것 저장
  const handleSaveEdit = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/questions/answers/${answer.answerId}`;
    try {
      await axios.patch(
        url,
        { answerContent: editedContent },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setIsEditing(false);
      refreshAnswers(); // 부모 컴포넌트에서 답변 목록을 다시 불러오는 함수 호출
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  const handleDelete = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/questions/answers/${answer.answerId}`;
    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      refreshAnswers(); // 부모 컴포넌트에서 답변 목록을 다시 불러오는 함수 호출
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // editor 설정
  const formats: string[] = [
    "header",
    "size",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "background",
    "align",
    "script",
    "code-block",
    "clean",
  ];
  hljs.configure({
    languages: ["javascript", "ruby", "python", "java", "cpp", "kotlin", "sql"],
  });
  const modules: {} = useMemo(
    () => ({
      toolbar: {
        container: "#toolBar",
      },
      syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value,
      },
    }),
    []
  );

  // 회원 투표 state
  const fetchVoteState = async () => {
    if (userData && userData.idx != null && answer.answerVoteDtoList) {
      const userVote = answer.answerVoteDtoList.find((vote: AnswerVote) => {
        return vote.memberIdx === userData.idx?.toString();
      });
      if (userVote) {
        setVoteState(userVote.voteState);
      }
    }
  };

  useEffect(() => {
    fetchVoteState();
  }, [answer.answerId, userData, voteCount]);

  // 취소 있는 버전
  const handleVoteIncrement = async () => {
    if (!authToken) {
      alert("투표하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (voteState === true) {
      // 이미 좋아요를 누른 경우 취소
      const url = `${process.env.REACT_APP_API_SERVER}/votes/answer/${answer.answerId}`;
      try {
        if (!authToken) {
          alert("투표하려면 로그인이 필요합니다.");
          navigate("/login");
          return;
        }
        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setVoteCount(voteCount - 1);
        setVoteState(null);
        await refreshAnswers();
      } catch (error) {
        console.error("투표 취소 오류: ", error);
      }
    } else {
      // 좋아요 추가
      const url = `${process.env.REACT_APP_API_SERVER}/votes/answer/${answer.answerId}`;
      const data = { voteState: true };

      try {
        await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const updatedVoteCount =
          voteState === null ? voteCount + 1 : voteCount + 2;
        setVoteCount(updatedVoteCount);
        setVoteState(true);
        await refreshAnswers();
      } catch (error) {
        console.error("투표 오류: ", error);
      }
    }
  };

  const handleVoteDecrement = async () => {
    if (!authToken) {
      alert("투표하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (voteState === false) {
      // 이미 싫어요를 누른 경우 취소
      const url = `${process.env.REACT_APP_API_SERVER}/votes/answer/${answer.answerId}`;
      try {
        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setVoteCount(voteCount + 1);
        setVoteState(null);
        await refreshAnswers();
      } catch (error) {
        console.error("투표 취소 오류: ", error);
        alert("투표 취소 오류");
      }
    } else {
      // 싫어요 추가
      const url = `${process.env.REACT_APP_API_SERVER}/votes/answer/${answer.answerId}`;
      const data = { voteState: false };

      try {
        await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const updatedVoteCount =
          voteState === null ? voteCount - 1 : voteCount - 2;
        setVoteCount(updatedVoteCount);
        setVoteState(false);
        await refreshAnswers();
      } catch (error) {
        console.error("투표 취소 오류: ", error);
        alert("투표 취소 오류");
      }
    }
  };

  // 답변 채택
  const handleClick = () => {
    if (isQuestionAuthor && !selected) {
      handleSelectAnswer(answer.answerId)
        .then(() => {
          setSelected(true);
        })
        .catch((error) => {
          console.error("답변 채택 에러:", error);
          alert("답변 채택에 실패했습니다. >>");
        });
    } else {
      alert("이미 채택된 답변입니다.");
    }
  };

  return (
    <div className="closed_container3" key={answer.answerId}>
      <div className="section3_1">
        <button
          className="answerBtn answer_likeBtn"
          onClick={handleVoteIncrement}
          disabled={userData?.idx === answer.author.memberIdx}
        >
          ▲
        </button>
        <div>{voteCount}</div>
        <button
          className="answerBtn answer_disLikeBtn"
          onClick={handleVoteDecrement}
          disabled={userData?.idx === answer.author.memberIdx}
        >
          ▼
        </button>
      </div>
      <div className="section3_2">
        <div className="part3_1">
          <div className="area1">
            <div className="profileStats statsList">
              <img
                src={process.env.REACT_APP_STATIC_SERVER + "/" + userData?.img}
                alt={userData?.img}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                }}
              />
            </div>
            <div className="profileStats statsList">
              {answer.author.memberName} 님
            </div>
          </div>
          <div className="area2">
            <div className="profileStats statsList">
              {new Date(answer.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="answerItem">
          <div className="part3_2">
            {isEditing ? (
              <>
                <div id="toolBar">
                  <ReactQuillModule />
                </div>
                <ReactQuill
                  ref={(element) => {
                    if (element !== null) {
                      QuillRef.current = element;
                    }
                  }}
                  value={editedContent}
                  onChange={setEditedContent}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  placeholder="수정할 내용을 입력해주세요."
                />
              </>
            ) : (
              <div
                className="section4_body"
                dangerouslySetInnerHTML={{ __html: answer.answerContent }}
              />
            )}
          </div>
          <div>
            {/* 채택 */}
            {isQuestionAuthor && !selected && (
              <button onClick={handleClick}>답변 채택</button>
            )}
            {selected && (
              <div>
                <span>채택됨</span>
              </div>
            )}
          </div>
          <div className="answer_actions">
            {userData?.idx === answer.author.memberIdx && (
              <>
                {isEditing ? (
                  <>
                    <button onClick={handleSaveEdit} className="saveBtn">
                      저장
                    </button>
                    <button onClick={handleCancelEdit} className="cancelBtn">
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEdit} className="editBtn">
                      수정
                    </button>
                    <button onClick={handleDelete} className="deleteBtn">
                      삭제
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
