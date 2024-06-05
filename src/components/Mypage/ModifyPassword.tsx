import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import axios from "axios";

interface Passwords {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ModifyPasswordProps {
  handleUserDataChange: (name: string, value: string) => void;
  currentPw: string;
  onHide: () => void;
}

const ModifyPassword: React.FC<ModifyPasswordProps> = ({
  handleUserDataChange,
  currentPw,
  onHide,
}) => {
  const [passwords, setPasswords] = useState<Passwords>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [wrongPw2, setWrongPw2] = useState<string>("");
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleCheckPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value !== passwords.newPassword) {
      setWrongPw2("비밀번호가 일치하지 않습니다.");
    } else {
      setWrongPw2("비밀번호가 일치합니다.");
    }
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  // const handleSaveChanges = async () => {
  //     try {
  //         let res;
  //         if (!userInfo?.tutor_idx) {
  //             const url = `${process.env.REACT_APP_API_SERVER}/api/editStudentPassword`;
  //             res = await axios.patch(url, {
  //                 password: passwords.currentPassword,
  //                 newPassword: passwords.newPassword,
  //             });
  //             const { result, msg } = res.data;
  //             if (result) {
  //                 handleUserDataChange("password", passwords.newPassword);
  //                 onHide();
  //                 alert(msg);
  //             } else {
  //                 alert(msg);
  //             }
  //         } else {
  //             const url = `${process.env.REACT_APP_API_SERVER}/api/editTutorPassword`;
  //             res = await axios.patch(url, {
  //                 password: passwords.currentPassword,
  //                 newPassword: passwords.newPassword,
  //             });
  //             const { result, msg } = res.data;
  //             if (result) {
  //                 handleUserDataChange("password", passwords.newPassword);
  //                 onHide();
  //                 alert(msg);
  //             } else {
  //                 alert(msg);
  //             }
  //         }
  //     } catch (error) {
  //         console.error("Error updating password:", error);
  //         alert("비밀번호 업데이트 중 오류가 발생했습니다.");
  //     }
  // };

  return (
    <>
      <div className="modal-content">
        <div>
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleCheckPassword}
          />
        </div>
        <div className="check">{wrongPw2}</div>
        {/* <button onClick={handleSaveChanges}>변경사항 저장</button> */}
        <button className="hide" onClick={onHide}>
          X
        </button>
      </div>
    </>
  );
};

export default ModifyPassword;
