import {Link} from "react-router-dom";
import React from 'react';
import { useState} from "react";
import $ from 'jquery';

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
  
    function loginClick(){
      const url='http://dev-api.coala.services:8000/student-login-check/'+userId+'/'+userPw
      fetch(url, {
                  method: 'Get',
                })
                .then((response) => response.json())
                .then((result) => {
                        if(result===true){
                          //const selectTeacherName = [];
                          document.getElementById("enter").style.display="block";
                          fetch("http://dev-api.coala.services:8000/get-all-redis-teacher", {
                            method: 'Get',
                          })
                          .then((response) => response.json())
                          .then((result) => {
                            //$("#teacherSelectSet").empty();
                            //console.log(result.length)
                            for(var i=0;i<result.length;i++){
                              const url2='http://dev-api.coala.services:8000/get-teacher-info/'+result[i]
                              fetch(url2, {
                                method: 'Get',
                                headers: { 'accept': 'application/json' },
                              })
                              .then((response) => response.json())
                              .then((result1) => {
                                result1=result1["t_name"]
                                result1= $("<option>"+result1+"</option>");
                                $('#teacherSelectSet').append(result1);
                              })
                            }
                            //setTeacher(selectTeacherName);
                          })
                        }
                        else{
                          alert(`아이디와 비밀번호를 다시 확인해 주세요`)
                        }
                      });
      //
    }
  
    function onTeacherChange(e){
      const url='http://dev-api.coala.services:8000/get-teacher-name/'+e.target.value
      fetch(url, {
        method: 'Get',
        headers: { 'accept': 'application/json' },
      })
      .then((response) => response.json())
      .then((result) => {
        //console.log("1: "+result)
        result=result["id"]
        console.log("2: "+result)
        setTeacherId(result);
      })
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
        <input name="userPw" onChange={onLoginChange} placeholder="비밀번호" value={userPw} type='password'></input>
        <button onClick={loginClick}>로그인</button>
        <div id="enter" style={{ display:'none' ,padding:20 }}>
          <select id="teacherSelectSet" onChange={onTeacherChange} >
            <option>선생님</option>
          </select>
          <Link to="/next" state = {{teacherID: teacherId ,userID: userId}}>
              <button onClick={onEnterClick} >접속하기</button>
          </Link>
            
        </div>
      </div>
      
    )
  }
export default Login;