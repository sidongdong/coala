import './App.css';
import {Link} from "react-router-dom";
import React, { useRef } from 'react';
import { useState, useEffect} from "react";
import $ from 'jquery';
import {Base64} from 'js-base64';
//import utf8 from 'utf8';
import Split from 'react-split'
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useLocation } from "react-router-dom"; 
//import { io } from "socket.io-client";



function Home(){
    const [count, setCount] = useState(0);
    const location = useLocation();
    var teacherID=location.state?.teacherID;
    var userID=location.state?.userID;
    console.log(teacherID);
    console.log(userID);
    const selectLanguageNameList = ["C++", "C", "Python", "Java"]; //선택 가능 언어 set
    
    let languageSelected;
    const [languageId,setLanNum] = useState("54");
    let writingDafault="#include<iostream>\nusing namespace std;\nint main(){\n    cout<<\"Hello, World!\";\n    return 0;\n}";
    const [code, setCode] = useState( writingDafault );
    const[wholeText,setText]=useState(writingDafault);
    const [editorFontSize, setFontSize] = useState( 14 );
    const [language,setLan] = useState("cpp");
    const [inputNeed,setInput] = useState("cin>>")
    const[lineNumber,setLineNum]=useState('1.\n2.\n3.\n4.\n5.\n6.');
    const[read,setRead] = useState(true);
    const[languageImgUrl,setLanImg] = useState("assets/languageLogo/cpp_logo.png")
  
  
    const onLanguageChange = () => {
      languageSelected = $('#languageSelectSet').val(); //select에서 선택된 value
  
      if (languageSelected==="C++"){
        setLanNum("54");
        writingDafault="#include<iostream>\nusing namespace std;\nint main(){\n    cout<<\"Hello, World!\";\n    return 0;\n}";
        setLan("cpp");
        setInput("cin>>");
        setLanImg("assets/languageLogo/cpp_logo.png")
      }
      else if(languageSelected==="C"){
        setLanNum("50");
        writingDafault="#include<stdio.h>\nint main(){\n    printf(\"Hello, World!\");\n    return 0;\n}";
        setLan("c");
        setInput("scanf(");
        setLanImg("assets/languageLogo/c_logo.png")
      }
      else if(languageSelected==="Python"){
        setLanNum("71");
        writingDafault="print(\"Hello, World!\")";
        setLan("py");
        setInput("input(");
        setLanImg("assets/languageLogo/python_logo.png")
      }
      else if(languageSelected==="Java"){
        setLanNum("62");
        writingDafault="class Main {\n    public static void main(String args[]) {\n      System.out.println(\"Hello, World!\");\n    }\n}";
        setLan("java");
        setInput("Scanner");
        setLanImg("assets/languageLogo/java_logo.png")
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
      //console.log(count)
      if(count===0){
        document.getElementById("coala3Display").style.display="none";
      }
      else if(count===1){
        document.getElementById("coala3Display").style.display="none";
        document.getElementById("coala2Display").style.display="none";
      }
      else if(count===2){
        document.getElementById("coala3Display").style.display="none";
        document.getElementById("coala2Display").style.display="none";
        document.getElementById("coala1Display").style.display="none";
        alert(`다음 컴파일부터는 감점됩니다.`);
      }
    };
  
    const onInputClick = () =>{
      document.getElementById("result").value="원하는 값을 입력해주세요::"
      setRead(false);
    };

    const onMyInfoClick = () =>{
      alert(`서비스 준비 중입니다`)
    };

    const onSaveClick = () =>{
      alert(`서비스 준비 중입니다`)
    };

    const onSetClick = () => {
      alert(`서비스 준비 중입니다`)
    }

    const onHelpClick = () => {
      alert(`서비스 준비 중입니다`)
    }

    const onLevelClick = () => {
      alert(`서비스 준비 중입니다`)
    }
  
    const onFontUp=()=>{
      setFontSize(editorFontSize+1);
    };
  
    const onFontDown=()=>{
      setFontSize(editorFontSize-1);
    };

    const onSubmitClick=()=> {
      let solutiontext;
      solutiontext=$('#solution').val();
      let submittext;
      submittext=solutiontext.replace(/\//gi,'@Reverse_slash@');
      submittext=submittext.replace(/'/gi,'@Mini@');
      submittext=submittext.replace(/\n/gi,'@ChangeLines@');
      submittext=submittext.replace(/&/gi,'@and@');
      submittext=submittext.replace(/"/gi,'@Double@');
      submittext=submittext.replace(/#/gi,'@Shap@');
      submittext=submittext.replace(/!/gi,'@Point@');
      submittext=submittext.replace(/\[/gi,'@OpenBig@');
      submittext=submittext.replace(/\]/gi,'@CloseBig@');
      submittext=submittext.replace(/\{/gi,'@OpenMiddle@');
      submittext=submittext.replace(/\}/gi,'@CloseMiddle@');
      submittext=submittext.replace(/,/gi,'@Comma@');
      let problem_num=problemNum;
      fetch('http://dev-api.coala.services:8000/websubmission?teacher_id='+teacherID+'&student_id='+userID+'&problem_num='+problem_num+'&compile_count='+count+'&code='+submittext)
        .then((response) => response.json())
        .then((data) => {
          if(data==='sub_ok')
          {
            alert(`제출하였습니다`)
          }
        });
    }
  
    const onLogoutClick=()=>{
      fetch('http://dev-api.coala.services:8000/delete-redis/'+userID)
      .then((response) => response.json())
      .then((data) => {
        if(data===1)
        {
          alert('로그아웃되었습니다.');
        }
      });
      userID="";
      teacherID="";
    }
    const onTryClick=()=>{
      var compileTry=3-count;
      if(compileTry>=0){
        alert(compileTry+'번 남았습니다.');
      }
      else{
        alert(count+'번 시도했습니다.'+"\n"+'감점 횟수:'+(-compileTry));
      }
    }

    const [cursor, setCursor] = useState(0);
  
      //커서 위치 조정
      function onCursor(e){
        if((e.key==="[")||(e.key==="{")||(e.key==="(")||(e.key==="'")||(e.key==="\"")){
          e.target.setSelectionRange(cursor+1,cursor+1);
        }
      }
    
    const[openBracket,setOpenState]=useState(0);
    
    //문제 선택
    let problemNum=5001;
    const selectProbleRangeList = [5000];//[1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,13000]; //문제 번호대 리스트
    const [problemUrl, setProblemUrl] = useState(['https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/5001.png']); //문제링크
    const [problemNumList,setProblemNumList]=useState([5001,5002,5003,5004,5005,5006,5007,5008,5009,5010,5011,5012,5013,5014,5015,5016,5017,5018,5019,5020,5021,5022,5023,5024,5025,5026,5027,5028,5029,5030,5031,5032,5033])//선택한 번호대 문제리스트
    const prourl='https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/';//기본 링크
    const problemUrl12=['https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/5012-1.png','https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/5012-2.png']
    
    const onNumSet1Change=(e)=>{
      /*
      let minimum = e.target.value;
      let maximum = Number(minimum)+1000;
      fetch('http://dev-api.coala.services:8000/Problem-combo?minimum='+minimum+'&maximum='+maximum, {
        method: 'Get',
      })
      .then((response) => response.json())
      .then((data) => {
        data.stringify(data)
        setProblemNumList(data);
      });
      */ //데이터 형식을 받아오는데 문제 있음. n천번대의 번호만 받아올 것이므로 number의 key값만 저장해야함. 현재는 입력해놓은 array의 디폴트 값으로 돌아가는 중
      document.getElementById("problemNumSelectSet2").style.visibility="visible";
    }

    const onNumSet2Change=(e)=>{
      let problemNum = Number(e.target.value);
      problemNum===5012 
      ? setProblemUrl(problemUrl12)
      : problemNumList.map(function(a,i){
        return(problemNumList[i]===problemNum ? setProblemUrl([prourl+problemNum+'.png']):null)
      })
      setCount(0);
      document.getElementById("coala3Display").style.display="block";
      document.getElementById("coala2Display").style.display="block";
      document.getElementById("coala1Display").style.display="block";
    }
  

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
    /*
    const socket = io("http://172.30.1.23:9998");
    
    const socketEx=(e)=>{
      e.preventDefault()
      var infoString="student┴"+"test_t"+"┴"+"sl5"+"┬";
      infoString=utf8.encode(infoString)
      console.log(infoString)
      socket.emit("send",infoString)
    }

    socket.on("receive", (data)=>{
      var string=utf8.decode(data)
      console.log(string)
      })
    */
   

    document.documentElement.setAttribute('data-color-mode', 'dark'); //다크모드 사용
  
    return (
      <div className="wholeScreen" id="wholeScreen">
        <header style={{
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}>
          <h1>The Coala</h1>
        </header>
        <div 
          id="webCompiler" 
          className="App"
        >
          <script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min.js"> </script>
          <script src="/socket.io/socket.io.js"></script>
          <title>Coala_Web</title>
          <main>
              <div id="setButton">
                <img src="assets/imgs/settingButton.png" alt="" onClick={onSetClick} style={{width: 30, height: 30, marginLeft:15, marginRight:17, position:"relative", top:8,}}/>
                <img src="assets/imgs/helpButton.png" alt="" onClick={onHelpClick} style={{width: 29, height: 33, marginRight:17, position:"relative", top:12,}}/>
                <img src="assets/imgs/level.png" alt="" onClick={onLevelClick} style={{width: 80, height: 33, marginRight:13, position:"relative", top:10,}}/>
                <select id="problemNumSelectSet1" defaultValue="" style={{width: 80, height: 31.5, marginLeft:8, marginRight:5, borderRadius:5, borderBlockColor: "rgb(204, 202, 202)", position:"relative", top:-2 }} onChange={onNumSet1Change}>
                <option value="" disabled>문제선택</option>
                {selectProbleRangeList.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
                </select>
                <select id="problemNumSelectSet2" defaultValue="" style={{width: 80, height: 31.5, marginTop:3, visibility:"hidden",  borderRadius:5, borderBlockColor: "rgb(204, 202, 202)", position:"relative", top:-2 }} onChange={onNumSet2Change}>
                <option value="" disabled>번호선택</option>
                { problemNumList.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
                </select>
                <Link to="/" >
                  <button onClick={onLogoutClick} style={{float:'right', width: 100, height: 33, marginRight:15, marginTop:7, borderRadius:5, border:"none", backgroundColor: "rgb(228, 228, 228)",}}><img src="assets/imgs/logoutButton.png" alt="" style={{width: 100, height: 33,}}/></button>
                </Link>
                <button onClick={onMyInfoClick} style={{float:'right', width: 103, height: 33, marginRight:8, marginTop:7, borderRadius:5, border:"none", backgroundColor: "rgb(228, 228, 228)",}}><img src="assets/imgs/infoButton.png" alt="" style={{width: 103, height: 33,}}/></button>
                <button  onClick={onSaveClick} style={{float:'right', width: 103, height: 33, marginRight:8, marginTop:7, borderRadius:5, border:"none", backgroundColor: "rgb(228, 228, 228)",}}><img src="assets/imgs/saveButton.png" alt="" style={{width: 103, height: 33,}}/></button>
                <select id="languageSelectSet" onChange={onLanguageChange} style={{float:'right', width: 90, height: 34, marginRight:4, marginTop:7.5,  borderRadius:5, borderBlockColor: "rgb(204, 202, 202)",}}>
                {selectLanguageNameList.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button id='fontUp' onClick={onFontUp} style={{width:21, height:17, marginRight:5, marginTop:6.5, backgroundColor:'rgb(71, 70, 70)', color:'white', }}>^</button>
                <button id='fontDown' onClick={onFontDown} style={{width:21 , height:21, marginRight:5, marginTop:6.5,backgroundColor:'rgb(71, 70, 70)', color:'white',}}>v</button>
            </div>
              
            <div id="splitWrapper" className="splitWrapper">
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
                  style={{borderRadius:10}}
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
                    <div className='codeEditor'>
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
                  <textarea readOnly={read} id="result" placeholder="컴파일" style={{padding : 15, fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace', fontSize: editorFontSize, resize:"none"}}  defaultValue={""}/>
                </Split>
              </Split>
            </div>
          </main>
        </div>
        <button id="compileTry" style={{width: 270, height: 50,marginRight:14, marginTop:5, borderRadius:5, border:"none", backgroundColor: "rgba(255,255,255,1)", float:"right"}}onClick={onTryClick}><img src="assets/imgs/compileTry.png" alt="" style={{width: 270, height: 50,}}/></button>
        <button id="submitButton" style={{width: 110, height: 35.5, marginBottom:10, marginTop:13, marginRight:15, borderRadius:5, border:"none", backgroundColor: "rgba(255,255,255,1)", float:"right"}} onClick={onSubmitClick}><img src="assets/imgs/submitButton.png" alt="" style={{width: 110, height: 35.5,}}/></button>
        <button id="compileButton" style={{width: 110, height: 35.5,marginRight:7, marginTop:13, borderRadius:5, border:"none", backgroundColor: "rgba(255,255,255,1)", float:"right"}} onClick={onCompileClick}><img src="assets/imgs/compileButton.png" alt="" style={{width: 110, height: 35.5,}}/></button>
        <button id="inputButton" style={{width: 110, height: 35.5, marginRight:7, marginTop:13, borderRadius:5, border:"none", backgroundColor: "rgba(255,255,255,1)", float:"right"}} onClick={onInputClick}><img src="assets/imgs/inputButton.png" alt="" style={{width: 110, height: 35.5,}}/></button>
        <img id="coala1Display" src="assets/imgs/coala.png" alt="coala1" style={{width: 50, height: 40, float:"right", marginTop:12, position:"relative", left:619, display:"block"}}/>
        <img id="coala2Display" src="assets/imgs/coala.png" alt="coala2" style={{width: 50, height: 40, float:"right",marginTop:12, position:"relative", left:604, display:"block"}}/>
        <img id="coala3Display" src="assets/imgs/coala.png" alt="coala3" style={{width: 50, height: 40, float:"right",marginTop:12, position:"relative", left:589, display:"block"}}/>
      </div>
    );
  }
export default Home;