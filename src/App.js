import './App.css';
import React, { useRef } from 'react';
import { useState, useEffect} from "react";
import $ from 'jquery';
import {Base64} from 'js-base64';
import Split from 'react-split'
import CodeEditor from '@uiw/react-textarea-code-editor';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


let teacherId="";
let userId=""
//로그인 element
function Login(){
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
    teacherId=document.getElementById("teacherSelectSet").value
    const url="http://dev-api.coala.services:8000/student-redis-Login?teacher_id="+teacherId+"&student_id="+userId
    fetch(url, {
        method: 'Get',
      })
      .then((response) => response.json())
      .then((result) => {
        if(result===true){
          window.location.replace("/next")
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
        <select id="teacherSelectSet" >
          <option>선생님</option>
          {selectTeacherList.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <button onClick={onEnterClick} >접속하기</button>
      </div>
    </div>
    
  )
}


//코딩 element
function Home(){
  const [count, setCount] = useState(0);

  const selectLanguageNameList = ["C++", "C", "Python", "Java"]; //선택 가능 언어 set
  
  let languageSelected;
  let problemNum=5001;
  const [languageId,setLanNum] = useState("54");
  let writingDafault="#include<iostream>\nusing namespace std;\nint main(){\n    cout<<\"Hello, World!\";\n    return 0;\n}";
  const [code, setCode] = useState( writingDafault );
  const[wholeText,setText]=useState(writingDafault);
  const [editorFontSize, setFontSize] = useState( 14 );
  const [language,setLan] = useState("cpp");
  const [inputNeed,setInput] = useState("cin>>")
  const[lineNumber,setLineNum]=useState('1.\n2.\n3.\n4.\n5.\n6.');
  const[read,setRead] = useState(true);


  const onLanguageChange = () => {
    languageSelected = $('#languageSelectSet').val(); //select에서 선택된 value

    if (languageSelected==="C++"){
      setLanNum("54");
      writingDafault="#include<iostream>\nusing namespace std;\nint main(){\n    cout<<\"Hello, World!\";\n    return 0;\n}";
      setLan("cpp");
      setInput("cin>>");
    }
    else if(languageSelected==="C"){
      setLanNum("50");
      writingDafault="#include<stdio.h>\nint main(){\n    printf(\"Hello, World!\");\n    return 0;\n}";
      setLan("c");
      setInput("scanf(");
    }
    else if(languageSelected==="Python"){
      setLanNum("71");
      writingDafault="print(\"Hello, World!\")";
      setLan("py");
      setInput("input(");
    }
    else if(languageSelected==="Java"){
      setLanNum("62");
      writingDafault="class Main {\n    public static void main(String args[]) {\n      System.out.println(\"Hello, World!\");\n    }\n}";
      setLan("java");
      setInput("Scanner");
    }
    setCode(writingDafault);
    setText(writingDafault);

    let input=writingDafault;
    input = input.toString().split("\n").map((line, i) => `${i + 1}.`).join("\n");
    setLineNum(input);//라인 수 세기

  }; //select value 값에 따라 languageId와 디폴트값 변경

  
  const mounted = useRef(false);


  useEffect(() => {
    if(!mounted.current){
      mounted.current = true; //count값이 마운트 될 때는 제외, 업데이트 시에만 렌더링
    } else {
      let solutiontext;
      solutiontext=$('#solution').val();
      let input = null;
      if(solutiontext.includes(inputNeed)){
        input = $('#result').val();
        input = input.substring(15,input.length);
        setRead(false);
      }
      fetch('http://dev-compile.coala.services:2358/submissions/?base64_encoded=true&wait=true', {
        method: "POST",
        headers: {
          "Content-Type": "application/json,text/plain;q=0.9,text/html;q=0.8",
          "X-Auth-Token": "coalacompilepass"
        },
        body: JSON.stringify({
          source_code: Base64.encode(solutiontext),
          language_id: languageId,
          stdin: Base64.encode(input),
        }),
      }).then((response) => response.json())
      .then((data) => {
        setRead(true);
        if(data.stdout===null){
          if(data.stderr===null){
            solutiontext = Base64.decode(data.compile_output);
          }
          else{
            solutiontext = Base64.decode(data.stderr);
          };
        }
        else{
          solutiontext = Base64.decode(data.stdout);
        };
        if (input!==null){
          solutiontext = "원하는 값을 입력해주세요::"+input+"\n"+solutiontext;
        }
        $('#result').val(solutiontext);
      });
    }
  }, [count]);

  const onCompileClick = ()=>{
    setCount(count+1);
  };

  const onInputClick = () =>{
    document.getElementById("result").value="원하는 값을 입력해주세요::"
    setRead(false);
  };

  const onFontUp=()=>{
    setFontSize(editorFontSize+1);
  };

  const onFontDown=()=>{
    setFontSize(editorFontSize-1);
  };


  const [cursor, setCursor] = useState(0);

    //커서 위치 조정
    function onCursor(e){
      if((e.key==="[")||(e.key==="{")||(e.key==="(")||(e.key==="'")||(e.key==="\"")){
        e.target.setSelectionRange(cursor+1,cursor+1);
      }
    }
  
  const[openBracket,setOpenState]=useState(0);

  //자동 괄호 닫기 함수
  function bracketClose(e) {

    var selectPos=e.target.selectionStart;
    var beforeText=wholeText.substring(0,selectPos);
    var closeBracket="";
    var afterText=wholeText.substring(selectPos,wholeText.length);
    const close=e.key;
    setOpenState(0);

    if(close==="["){
      closeBracket="[]";
      setOpenState(1);
    }
    else if (close==="{"){
      closeBracket="{}";
      setOpenState(1);
    }
    else if (close==="("){
      closeBracket="()";
      setOpenState(1);
    }
    else if (close==="'"){
      closeBracket="''";
      setOpenState(1);
    }
    else if(close==="\""){
      closeBracket="\"\"";
      setOpenState(1);
    }

    setText(beforeText+closeBracket+afterText);
    setCursor(selectPos);

  };
  
  function onBraketChange(e){

    if(openBracket===1){
      setCode(wholeText);
    }
    else{
      setCode(e.target.value);
      setText(e.target.value);
    }

    var input=document.getElementById("solution").value;
    input = input.toString().split("\n").map((line, i) => `${i + 1}.`).join("\n");
    setLineNum(input);
    
    
    let textarea = document.getElementById('lineCounter');
    if (textarea) {
      textarea.style.height = 'auto';
      let height = textarea.scrollHeight; // 높이
      textarea.style.height = `${height + 350}px`;
    }//line 수에 맞게 자동 높이 조절
  }

  document.documentElement.setAttribute('data-color-mode', 'dark'); //다크모드 사용

  const selectProbleRangeList = [5000];//[1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,13000]; //문제 번호대 리스트
  const [problemUrl, setProblemUrl] = useState(['https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/5001.png']); //문제링크
  const [problemNumList,setProblemNumList]=useState([5001,5002,5003,5004,5005,5006,5007,5008,5009,5010,5011,5012,5013,5014,5015,5016,5017,5018,5019,5020,5021,5022,5023,5024,5025,5026,5027,5028,5029,5030,5031,5032,5033])//선택한 번호대 문제리스트
  const prourl='https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/';//기본 링크
  const problemUrl12=['https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/5012-1.png','https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/5012-2.png']
  return (
    <div className="App">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min.js"> </script>
      <title>Coala_Web</title>
      <header>
        <h1>Coala</h1>
      </header>
      <main>
        <div>
          <select id="problemNumSelectSet1" onChange={(e)=>{
            let minimum = e.target.value;
            let maximum = Number(minimum)+1000;
            fetch('http://dev-api.coala.services:8000/Problem-combo?minimum='+minimum+'&maximum='+maximum)
            .then((response) => response.json())
            .then((data) => {
              setProblemNumList(data);
            });
          }}>
          {selectProbleRangeList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
          </select>
          <select id="problemNumSelectSet2" onChange={(e)=>{
            let problemNum = Number(e.target.value);
            problemNum===5012 
            ? setProblemUrl(problemUrl12)
            : problemNumList.map(function(a,i){
              return(problemNumList[i]===problemNum ? setProblemUrl([prourl+problemNum+'.png']):null)
            })
          }}>
          {problemNumList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
          </select>
        </div>
        <select id="languageSelectSet" onChange={onLanguageChange}>
        {selectLanguageNameList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        
        <button onClick={onInputClick}>입력하기</button>
        <button onClick={onCompileClick}>컴파일{count}</button>
        <button onClick={()=>{
          let solutiontext;
          solutiontext=$('#solution').val();
          console.log(solutiontext);
          let submittext;
          submittext=solutiontext.replace(/\//gi,'@Reverse_slash@');
          submittext=submittext.replace(/\'/gi,'@Mini@');
          submittext=submittext.replace(/\n/gi,'@ChangeLines@');
          submittext=submittext.replace(/\&/gi,'@and@');
          submittext=submittext.replace(/\"/gi,'@Double@');
          submittext=submittext.replace(/\#/gi,'@Shap@');
          submittext=submittext.replace(/\!/gi,'@Point@');
          submittext=submittext.replace(/\[/gi,'@OpenBig@');
          submittext=submittext.replace(/\]/gi,'@CloseBig@');
          submittext=submittext.replace(/\{/gi,'@OpenMiddle@');
          submittext=submittext.replace(/\}/gi,'@CloseMiddle@');
          submittext=submittext.replace(/\,/gi,'@Comma@');
          console.log(submittext);
          console.log(problemNum);
          let teacher_id=teacherId;//선생님 아이디
          let student_id=userId;//학생 아이디
          let problem_num=problemNum;
          fetch('http://dev-api.coala.services:8000/websubmission?teacher_id='+teacher_id+'&student_id='+student_id+'&problem_num='+problem_num+'&compile_count='+count+'&code='+submittext)
            .then((response) => response.json())
            .then((data) => {
              if(data=='sub_ok')
              {
                alert(`제출하였습니다`)
              }
            });

        }}>제출하기</button>
        <button onClick={onFontUp}>+</button>
        <button onClick={onFontDown}>-</button>
        <div className="splitWrapper">
          <Split
            className="splitHorizontal"
            sizes={[45, 55]}
          >
            <div className="leftPanel" id="question">
              {
                problemUrl.map(i=><img key={i} src={i} alt="profile"/>)
              }
            </div>
            <Split
              className="splitVertical" 
              sizes= {[70, 30]}
              direction= 'vertical'
            >
              <div className='editor'>
                <div>
                  <textarea 
                    id="lineCounter"  
                    value={lineNumber}
                    wrap='on' 
                    readOnly="readonly"
                    style={{
                      backgroundColor: "black",
                      fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                      fontSize: editorFontSize,
                      width: editorFontSize*1.8,
                    }}>1.</textarea>
                </div>
                <div className="w-tc-editor-var" > </div>
                <div className='codeEditor' >
                  <CodeEditor
                    id="solution"
                    wrap='on'
                    value={code}
                    language={language}
                    placeholder="코딩"
                    onKeyDown={bracketClose}
                    onChange={onBraketChange}
                    onKeyUp={onCursor}
                    padding={15}
                    style={{
                      backgroundColor: "black",
                      fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                      fontSize: editorFontSize,
                    }}
                />
                </div>
              </div>
              <textarea readOnly={read} id="result" placeholder="컴파일" style={{padding : 15, fontSize: editorFontSize,}}  defaultValue={""}/>
            </Split>
          </Split>
        </div>
      </main>
    </div>
  );
}

function App() {
  return(
    <Router>
      <div>
        <Routes>
          <Route path="/next" element={<Home/>} />
          <Route path="/" element={<Login/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
