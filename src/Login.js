import {Link} from "react-router-dom";
import React from 'react';
import { useState} from "react";

//로그인 element
function Login(){
    const[teacherId,setTeacherId]=useState('')
    const [loginInfo,setLogin] = useState({
      userId: "",
      userPw: "",
    });
    const {userId,userPw} = loginInfo;
    const onLoginChange = (e) =>{
      const {name,value} = e.target;
      setLogin({
        ...loginInfo,
        [name] : value,
      })
    }
  
    const [selectTeacherList, setTeacher] = useState([]); //선택 가능 선생님 set
  
    function loginClick(){
      const url='http://dev-api.coala.services:8000/student-login-check/'+userId+'/'+userPw
      fetch(url, {
                  method: 'Get',
                })
                .then((response) => response.json())
                .then((result) => {
                        if(result===true){
                          document.getElementById("enter").style.display="block";
                          fetch("http://dev-api.coala.services:8000/get-all-redis-teacher", {
                            method: 'Get',
                          })
                          .then((response) => response.json())
                          .then((result) => {
                                  setTeacher(result)
                                })
                        }
                        else{
                          alert(`아이디와 비밀번호를 다시 확인해 주세요`)
                        }
                      });
      //
    }
  
  
    function onEnterClick(){
      const url="http://dev-api.coala.services:8000/student-redis-Login?teacher_id="+teacherId+"&student_id="+userId
      fetch(url, {
          method: 'Get',
        })
        .then((response) => response.json())
        .then((result) => {
          if(result===true){
            alert('로그인 되었습니다.');
            //window.location.replace("/next")
          }
          else{
            alert(`선생님을 다시 선택해주세요`)
          }     
        })
    }
   
    return(
      <div 
        id="loginEnter" 
        style={{
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}>
        <header>
          <h1 style={{ padding:20}}>Welcome to Coala</h1>
        </header>
        <input name="userId" onChange={onLoginChange} placeholder="아이디" value={userId}></input>
        <input name="userPw" onChange={onLoginChange} placeholder="비밀번호" value={userPw}></input>
        <button onClick={loginClick}>로그인</button>
        <div id="enter" style={{ display:'none' ,padding:20 }}>
          <select id="teacherSelectSet" onChange={(e)=>{setTeacherId(e.target.value)}} >
            <option>선생님</option>
            {selectTeacherList.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <Link to="/next" state = {{teacherID: teacherId ,userID: userId}}>
                <button onClick={onEnterClick} >접속하기</button>
            </Link>
            
        </div>
      </div>
      
    )
  }
export default Login;