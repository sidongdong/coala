import './App.css';
import {Link, useLocation} from "react-router-dom";
import React, { useRef, useState, useEffect} from "react";
import $ from 'jquery';
import {Base64} from 'js-base64';
//import utf8 from 'utf8';
import Split from 'react-split'
import Modal from 'react-modal';
import CodeMirror from '@uiw/react-codemirror';
import { loadLanguage, langNames, langs } from '@uiw/codemirror-extensions-langs';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
//import { io } from "socket.io-client";



function Home(){
    const [count, setCount] = useState(0);
    const location = useLocation();
    var teacherID=location.state?.teacherID;
    var userID=location.state?.userID;
    var teacherName=location.state?.teacherName;
    //console.log(teacherID);
    //console.log(userID);
    const selectLanguageNameList = ["C++", "C", "Python", "Java"]; //선택 가능 언어 set
    
    let languageSelected;
    const [languageId,setLanNum] = useState("54");
    let writingDafault="#include <iostream>\nusing namespace std;\nint main()\n{\n    cout<<\"Hello, World!\";\n    return 0;\n}";
    const [code, setCode] = useState( writingDafault );
    //const[wholeText,setText]=useState(writingDafault);
    const [editorFontSize, setFontSize] = useState( 14 );
    const [language,setLan] = useState("cpp");
    const [inputNeed,setInput] = useState("cin>>")
    //const[lineNumber,setLineNum]=useState('1.\n2.\n3.\n4.\n5.\n6.\n7.');
    const[read,setRead] = useState(true);
    //const[languageImgUrl,setLanImg] = useState("assets/languageLogo/cpp_logo.png")
    const date = new Date();
  
  
    const onLanguageChange = () => {
      loadLanguage('tsx');
      langs.tsx();
      //console.log('langNames:', langNames);

      languageSelected = $('#languageSelectSet').val(); //select에서 선택된 value
  
      if (languageSelected==="C++"){
        setLanNum("54");
        writingDafault="#include <iostream>\nusing namespace std;\nint main()\n{\n    cout<<\"Hello, World!\";\n    return 0;\n}";
        setLan(langNames[91]);
        setInput("cin>>");
        //setLanImg("assets/languageLogo/cpp_logo.png")
      }
      else if(languageSelected==="C"){
        setLanNum("50");
        writingDafault="#include <stdio.h>\nint main()\n{\n    printf(\"Hello, World!\");\n    return 0;\n}";
        setLan(langNames[3]);
        setInput("scanf(");
        //setLanImg("assets/languageLogo/c_logo.png")
      }
      else if(languageSelected==="Python"){
        setLanNum("71");
        writingDafault="print(\"Hello, World!\")";
        setLan(langNames[83]);
        setInput("input(");
        //setLanImg("assets/languageLogo/python_logo.png")
      }
      else if(languageSelected==="Java"){
        setLanNum("62");
        writingDafault="class Main {\n    public static void main(String args[]) {\n      System.out.println(\"Hello, World!\");\n    }\n}";
        setLan(langNames[89]);
        setInput("Scanner");
        //setLanImg("assets/languageLogo/java_logo.png")
      }
      setCode(writingDafault);
      //setText(writingDafault);
  
      let input=writingDafault;
      input = input.toString().split("\n").map((line, i) => `${i + 1}.`).join("\n");

    }; //select value 값에 따라 languageId와 디폴트값 변경
  
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

    const mounted = useRef(false);
  
  
    useEffect(() => {
      if(!mounted.current){
        mounted.current = true; //count값이 마운트 될 때는 제외, 업데이트 시에만 렌더링
      } else {
        let solutiontext=code;
        
        console.log(solutiontext);
        let input = null;
        if(solutiontext.includes(inputNeed)){
          input = $('#result').val();
          input = input.substring(15,input.length);
          setRead(false);
        }
        //console.log(solutiontext)
        fetch('http://dev-api.coala.services:8000/data', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
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
  

  
    const onInputClick = () =>{
      document.getElementById("result").value="원하는 값을 입력해주세요::"
      setRead(false);
    };

    const [infoIsOpen,setInfoOpen] = useState(false);
    const [myInfo, setMyInfo] = useState("ID:\n이름:\nCoCo\n선생님\n")
    const onMyInfoClick = () =>{
      document.getElementById("fontUp").style.zIndex=0;
      document.getElementById("fontDown").style.zIndex=0;
      const url="http://dev-api.coala.services:8000/get-student-info/"+ userID
      fetch(url, {
          method: 'Get',
        })
        .then((response) => response.json())
        .then((result) => {
          let stdName=result["std_name"]
          let id=result["id"]
          let coalaPoint=result["score"]
          setMyInfo("ID:"+id+"\n이름:"+stdName+"\nCoCo:"+coalaPoint+"\n선생님:"+teacherName)
        })
      setInfoOpen(true);
    };

    const onSaveClick = () =>{
      alert(`서비스 준비 중입니다`)
    };

    const[feedbackCode,setFeedback]=useState("")
    const [feedbackIsOpen,setFeedbackOpen] = useState(false);
    const onAnswerClick = () =>{
      document.getElementById("fontUp").style.zIndex=2; 
      document.getElementById("fontDown").style.zIndex=2; 
      document.getElementById("editor").style.zIndex=1;
      const answerUrl="http://dev-api.coala.services:8000/get-web-answer-check?student_id="+ userID+"&problem_num="+problemNum
      fetch(answerUrl, {
          method: 'Get',
        })
        .then((response) => response.json())
        .then((result) => {
          if(result === 1){
            alert(`😀정답입니다`);
          }
          else{
            alert(`😈오답입니다`);
          };
        })
      const feedbackUrl="http://dev-api.coala.services:8000/get-feedback-code/"+userID
      fetch(feedbackUrl, {
          method: 'Get',
        })
        .then((response) => response.json())
        .then((resultF) => {
          if(resultF==="no feedback code"){
            alert(`📑받은 피드백이 없습니다`);
          }
          else{
            setFeedbackOpen(true)
            resultF=resultF.replace(/@Reverse_slash@/gi,"\\");
            resultF=resultF.replace(/@Mini@/gi,"'");
            resultF=resultF.replace(/@ChangeLines@/gi,"\n");
            resultF=resultF.replace(/@and@/gi,"&");
            resultF=resultF.replace(/@Double@/gi,"\"");
            resultF=resultF.replace(/@Shap@/gi,"#");
            resultF=resultF.replace(/@Point@/gi,"!");
            resultF=resultF.replace(/@OpenBig@/gi,"[");
            resultF=resultF.replace(/@CloseBig@/gi,"]");
            resultF=resultF.replace(/@OpenMiddle@/gi,"{");
            resultF=resultF.replace(/@CloseMiddle@/gi,"}");
            resultF=resultF.replace(/@Comma@/gi,",");
            resultF=resultF.replace(/@Percent@/gi,"%");
            resultF=resultF.replace(/@Division@/gi,'/');
            resultF=resultF.replace(/@SemiColon@/gi,';');
            resultF=resultF.replace(/@Plus@/gi,'+');
            setFeedback(resultF)
          };
        })
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

    const onCodeChange=(e)=> {
      setCode(e);
    }

    const onSubmitClick=()=> {
      let solutiontext=code;
    
      let submittext;
      submittext=solutiontext.replace(/\\/gi,'@Reverse_slash@');
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
      submittext=submittext.replace(/%/gi,'@Percent@');
      submittext=submittext.replace(/\//gi,'@Division@');
      submittext=submittext.replace(/;/gi,'@SemiColon@');
      submittext=submittext.replace(/\+/gi,'@Plus@');
      let problem_num=problemNum;
      //console.log(teacherID);
      //console.log(userID);
      //console.log(problem_num);
      //console.log(count);
      //console.log(submittext)
      fetch('http://dev-api.coala.services:8000/websubmission?teacher_id='+teacherID+'&student_id='+userID+'&problem_num='+problem_num+'&compile_count='+count+'&code='+submittext + "&sub_type=n"+ "&sub_time="+date+"&student_memo=",{
        method: "GET",
      }).then((response) => response.json())
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
    
    //문제 선택
    const [problemNum,setProblemNum]=useState(1001);
    const selectProbleRangeList = [1000,2000,3000,4000,5000,7000,8000,9000,10000,11000,12000,13000]; //문제 번호대 리스트, 6000번대는 모의고사라 제외
    const [problemUrl, setProblemUrl] = useState('https://thecoala.io/Algorithm/algorithm_link/1001.html'); //문제링크
   // const prourl='https://s3.ap-northeast-2.amazonaws.com/page.thecoala.io/Algorithm/algorithm5/';//기본 링크
    
    const onNumSet1Change=(e)=>{
      
      let minimum = e.target.value;
      let maximum = Number(minimum)+200; //200번대는 시험문제라 제외
      $('#problemNumSelectSet2').empty(); //바뀔 때마다 옵션 초기화
      fetch('http://dev-api.coala.services:8000/Problem-combo?minimum='+minimum+'&maximum='+maximum, {
        method: 'Get',
        headers: { 'accept': 'application/json' }
      })
      .then((response) => response.json())
      .then((data) => {
        for(var i=0;i<data.length;i++){
          var problems=data[i].number
          problems= $("<option>"+problems+"</option>");
          $('#problemNumSelectSet2').append(problems);
        }
        setProblemUrl(data[0].content)
      });

      document.getElementById("problemNumSelectSet2").style.visibility="visible";
    }

    const onNumSet2Change=(e)=>{
      let min = Number(e.target.value)
      let max = min+1
      fetch('http://dev-api.coala.services:8000/Problem-combo?minimum='+min+'&maximum='+max, {
        method: 'Get',
        headers: { 'accept': 'application/json' }
      })
      .then((response) => response.json())
      .then((data) => {
        data=data[0].content
        setProblemUrl(data);
      });
      setProblemNum(e.target.value)
      

      setCount(0);
      document.getElementById("coala3Display").style.display="block";
      document.getElementById("coala2Display").style.display="block";
      document.getElementById("coala1Display").style.display="block";
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

      const myTheme = createTheme({
        theme: 'dark',
        settings: {
          background: 'black',
          foreground: 'rgb(255, 194, 38)',
          caret: 'white',
          selection: 'rgb(56, 96, 117)',
          selectionMatch: 'rgb(123, 134, 63)',
          //lineHighlight: 'rgb(51, 50, 50)',
          gutterBackground: 'black',
          gutterForeground: 'rgb(183, 183, 183)',
        },
        styles: [
          { tag: t.comment, color: 'green' },
          { tag: t.variableName, color: 'rgb(111, 173, 198)' },
          { tag: [t.string, t.special(t.brace)], color: 'white' },
          { tag: t.number, color: 'rgb(183, 183, 183)' },
          { tag: t.bool, color: 'yellow' },
          { tag: t.null, color: 'rgb(183, 183, 183)' },
          { tag: t.keyword, color: 'rgb(183, 183, 183)' },
          { tag: t.operator, color: 'rgb(183, 183, 183)' },
          { tag: t.className, color: 'rgb(183, 183, 183)' },
          { tag: t.definition(t.typeName), color: 'rgb(183, 183, 183)' },
          { tag: t.typeName, color: 'rgb(183, 183, 183)' },
          { tag: t.angleBracket, color: 'rgb(183, 183, 183)' },
          { tag: t.tagName, color: 'rgb(183, 183, 183)' },
          { tag: t.attributeName, color: 'rgb(183, 183, 183)' },
        ],
      });
  
    return (
      <div className="wholeScreen" id="wholeScreen">
        <Modal 
          id = "infoModal"
          isOpen={infoIsOpen} 
          onRequestClose={()=>setInfoOpen(false)}
          ariaHideApp={false}
        >
          <h3>내 정보🐨</h3>
          <textarea 
            value={myInfo} 
            readOnly="readonly"
            style={{border:"none", resize:"none",height:100,width:200}}
          ></textarea>
          <button onClick={()=> {setInfoOpen(false); document.getElementById("fontUp").style.zIndex=2; document.getElementById("fontDown").style.zIndex=2;}} style={{width:100,height:30,borderRadius:5,border:"none",backgroundColor:"skyblue"}}>확인</button>
        </Modal>
        <Modal 
          id = "feedbackModal"
          isOpen={feedbackIsOpen} 
          ariaHideApp={false}
          backdrop = "static"
        >
          <h3>피드백</h3>
          <CodeMirror
            theme={myTheme}
            value={feedbackCode}
            readOnly="readonly"
            padding={15}
            extensions={[loadLanguage(language)]}
            style={{
              backgroundColor: "black",
              width:500,
              height: 400,
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              fontSize: editorFontSize,
              resize:"none",
              borderRadius: 5,
            }}
            //onChange={onChange}
          />
          <button onClick={()=> {setFeedbackOpen(false); document.getElementById("editor").style.zIndex=0;}} style={{width:100,height:30,borderRadius:5,border:"none",backgroundColor:"skyblue"}}>닫기</button>
        </Modal>
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
                </select>
                <Link to="/" >
                  <button onClick={onLogoutClick} style={{float:'right', width: 100, height: 33, marginRight:15, marginTop:7, borderRadius:5, border:"none", backgroundColor: "rgb(228, 228, 228)",}}><img src="assets/imgs/logoutButton.png" alt="" style={{width: 100, height: 33,}}/></button>
                </Link>
                <button onClick={onMyInfoClick} style={{float:'right', width: 103, height: 33, marginRight:8, marginTop:7, borderRadius:5, border:"none", backgroundColor: "rgb(228, 228, 228)",}}><img src="assets/imgs/infoButton.png" alt="" style={{width: 103, height: 33,}}/></button>
                <button  onClick={onSaveClick} style={{float:'right', width: 103, height: 33, marginRight:6, marginTop:7, borderRadius:5, border:"none", backgroundColor: "rgb(228, 228, 228)",}}><img src="assets/imgs/saveButton.png" alt="" style={{width: 103, height: 33,}}/></button>
                <button  onClick={onAnswerClick} style={{float:'right', width: 103, height: 33, marginTop:8.3, borderRadius:5, borderColor:"rgb(160, 160, 160)",border:2, backgroundColor:"rgba(255,255,255,1)"}}>정답 확인</button>
                <select id="languageSelectSet" onChange={onLanguageChange} style={{float:'right', width: 94, height: 34, marginRight:6, marginTop:7.5 ,borderRadius:5, borderBlockColor: "rgb(204, 202, 202)",}}>
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
                  <iframe className="leftPanel2" id="question2" title="qLink" src={problemUrl}/>
                </div>
                <Split
                  className="splitVertical" 
                  sizes= {[70, 30]}
                  direction= 'vertical'
                  style={{borderRadius:10}}
                >
                  <div className='editor' id='editor'>
                    <CodeMirror
                      id="solution"
                      value={code}
                      extensions={[loadLanguage(language)]}
                      theme={myTheme}
                      placeholder="코딩"
                      style={{fontSize:editorFontSize, padding:10}}
                      onChange={onCodeChange}
                    />
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