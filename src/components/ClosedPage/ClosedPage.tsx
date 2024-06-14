import { SyntheticEvent, useEffect, useState } from "react";
import "../../styles/ClosedPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faSuperscript,
  faSubscript,
  faListOl,
  faList,
  faRotateLeft,
  faRotateRight,
  faLink,
  faUnlink,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faIndent,
  faOutdent,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { DiscussionDetail } from "../../types/discussion";

export default function ClosedPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const [questionData, setQuestionData] = useState<DiscussionDetail>();
  console.log("questionId: ", questionId);

  const handleSelectedQuesId = async () => {
    const url = `${process.env.REACT_APP_API_SERVER}/questions/${questionId}`;
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data);
      setQuestionData(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    handleSelectedQuesId();
  }, []);
  console.log("questionData: ", questionData);

  const processQuestionContent = (content: string) => {
    // Regular expression to match code blocks
    const codeBlockRegex =
      /<span style="background-color: lightgray; font-family: monospace; white-space: pre-wrap; display: inline-block;">([\s\S]*?)<\/span>/g;
    // Replace code blocks with styled <pre> and <code> tags
    return content.replace(codeBlockRegex, (match, p1) => {
      return `<pre style="background-color: lightgray; font-family: monospace; white-space: pre-wrap; display: inline-block;">${p1}</pre>`;
    });
  };

  const processedContent = questionData?.questionContent
    ? processQuestionContent(questionData.questionContent)
    : "";

  return (
    <section>
      <article className="closed_container1" key={questionData?.questionId}>
        <div className="closed_header">
          <h1 className="headerTitle">문제 해결</h1>
          <button className="closed_askQBtn">질문 하기</button>
        </div>
        <div className="question_container">
          <div className="question_section1">{questionData?.questionTitle}</div>
          <div className="question_section2">
            <div className="section2_1">
              <div className="questionStats statsList">
                {questionData?.voteCount}평
              </div>
              <div className="questionStats statsList">
                {questionData?.answerList} 답변
              </div>
              <div className="questionStats statsList">
                {questionData?.viewCount} 열람
              </div>
            </div>
            <div className="section2_2">
              <div className="profileStats statsList">
                <img
                  src="https://picsum.photos/200/300?grayscale"
                  alt=""
                  style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                />
              </div>
              <div className="profileStats statsList">
                {questionData?.author.memberName}{" "}
                <span>{questionData?.viewCount}</span>
              </div>
              <div className="profileStats statsList">
                {questionData?.createdAt.toString()}
              </div>
            </div>
          </div>
          <div className="question_section3">
            <div className="section3_sideBar">
              <button className="answerBtn answer_likeBtn">▲</button>
              <div>{questionData?.voteCount}</div>
              <button className="answerBtn answer_disLikeBtn">▼</button>
              <div className="resolve_bookMark">🕮</div>
            </div>
            <div
              className="section3_body"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            ></div>
          </div>
          <div className="question_section4">
            <div className="section_text">수정</div>
            <div className="section_text">팔로우</div>
          </div>
        </div>
      </article>
      <article className="closed_container2">
        <h1 className="subTitle">1 답변</h1>
      </article>
      <article className="closed_container3">
        <div className="section3_1">
          <button className="answerBtn answer_likeBtn">▲</button>
          <div>8</div>
          <button className="answerBtn answer_disLikeBtn">▼</button>
          <div className="resolve_bookMark answer_bookMark">🕮</div>
        </div>
        <div className="section3_2">
          <div className="part3_1">
            <div className="area1">
              <div className="profileStats statsList">
                <img
                  src="https://picsum.photos/200/300?grayscale"
                  alt=""
                  style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                />
              </div>
              <div className="profileStats statsList">
                이기혁님 <span>485</span>
              </div>
            </div>
            <div className="area2">
              <div className="profileStats statsList">2024-06-04 16:09:30</div>
            </div>
          </div>
          <div className="part3_2">
            <div className="section4_body">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              qui tempora nisi vero nobis minima illum. Ducimus minima beatae
              doloribus culpa officiis! Corrupti, asperiores! Voluptate quas
              atque ratione eum voluptas.
            </div>
          </div>
        </div>
      </article>
      <article className="closed_container4">
        <h1 className="subTitle">내 답변</h1>
        <div className="richEditorText richEditorText_container">
          <div className="options">
            {/* Text Format */}
            <button id="bold" className="option-button format">
              <FontAwesomeIcon icon={faBold} />
            </button>
            <button id="italic" className="option-button format">
              <FontAwesomeIcon icon={faItalic} />
            </button>
            <button id="underline" className="option-button format">
              <FontAwesomeIcon icon={faUnderline} />
            </button>
            <button id="strikethrough" className="option-button format">
              <FontAwesomeIcon icon={faStrikethrough} />
            </button>
            <button id="superscript" className="option-button script">
              <FontAwesomeIcon icon={faSuperscript} />
            </button>
            <button id="subscript" className="option-button script">
              <FontAwesomeIcon icon={faSubscript} />
            </button>
            {/* List */}
            <button id="insertOrderedList" className="option-button">
              <FontAwesomeIcon icon={faListOl} />
            </button>
            <button id="insertUnorderedList" className="option-button">
              <FontAwesomeIcon icon={faList} />
            </button>

            {/* undo/redo */}
            <button id="undo" className="option-button">
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
            <button id="redo" className="option-button">
              <FontAwesomeIcon icon={faRotateRight} />
            </button>
            {/* Link */}
            <button id="createLink" className="adv-option-button">
              <FontAwesomeIcon icon={faLink} />
            </button>
            <button id="unlink" className="option-button">
              <FontAwesomeIcon icon={faUnlink} />
            </button>

            {/* Alignment */}
            <button id="justifyLeft" className="option-button align">
              <FontAwesomeIcon icon={faAlignLeft} />
            </button>
            <button id="justifyCenter" className="option-button align">
              <FontAwesomeIcon icon={faAlignCenter} />
            </button>
            <button id="justifyRight" className="option-button align">
              <FontAwesomeIcon icon={faAlignRight} />
            </button>
            <button id="justifyFull" className="option-button align">
              <FontAwesomeIcon icon={faAlignJustify} />
            </button>
            <button id="indent" className="option-button spacing">
              <FontAwesomeIcon icon={faIndent} />
              <i className="fa-solid fa-indent"></i>
            </button>
            <button id="outdent" className="option-button spacing">
              <FontAwesomeIcon icon={faOutdent} />
              <i className="fa-solid fa-outdent"></i>
            </button>
            {/* Headings */}
            <select id="formatblock" className="adv-option-button">
              <option value="H1">H1</option>
              <option value="H2">H2</option>
              <option value="H3">H3</option>
              <option value="H4">H4</option>
              <option value="H5">H5</option>
              <option value="H6">H6</option>
            </select>
            {/* Font */}
            <select id="fontName" className="adv-option-button"></select>
            <select id="fontSize" className="adv-option-button"></select>

            {/* Color */}
            <div className="input-wrapper">
              <input
                type="color"
                id="foreColor"
                className="adv-option-button"
              />
              <label htmlFor="foreColor">Font Color</label>
            </div>
            <div className="input-wrapper">
              <input
                type="color"
                id="backColor"
                className="adv-option-button"
              />
              <label htmlFor="backColor">Highlight Color</label>
            </div>

            {/* image */}
            <button id="insertImage" className="option-button">
              <FontAwesomeIcon icon={faImage} />
              <i className="fa-solid fa-image"></i>
            </button>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              multiple
              style={{ display: "none" }}
            />
          </div>
          {/* <div
            id="text-input"
            contentEditable={true}
            onInput={applicationHandleContentChange}
            dangerouslySetInnerHTML={{ __html: applicationContent }}
          ></div> */}
        </div>
        <div className="closedBtn_container">
          <button className="closedBtn">답변 하기</button>
        </div>
      </article>
    </section>
  );
}
