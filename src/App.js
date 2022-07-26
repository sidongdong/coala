import './App.css';
import React, { useRef } from 'react';
import { useState, useEffect} from "react";
import $ from 'jquery';
import {Base64} from 'js-base64';
import Split from 'react-split'
import CodeEditor from '@uiw/react-textarea-code-editor';


function App() {

  const [count, setCount] = useState(0);

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

    var input=writingDafault;
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
      let input;
      if(solutiontext.includes(inputNeed)){
        input = $('#result').val();
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
        $('#result').val(solutiontext);
      });
    }
  }, [count]);

  const onCompileClick = ()=>{
    setCount(count+1);
  };

  const onInputClick = () =>{
    document.getElementById("result").value="";
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

  return (
    <div className="App">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min.js"> </script>
      <title>Coala_Web</title>
      <header>
        <h1>Coala</h1>
      </header>
      <main>
        <select id="languageSelectSet" onChange={onLanguageChange} value={languageSelected}>
        {selectLanguageNameList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <button onClick={onInputClick}>입력하기</button>
        <button onClick={onCompileClick}>컴파일{count}</button>
        <button>제출하기</button>
        <button onClick={onFontUp}>+</button>
        <button onClick={onFontDown}>-</button>
        <div className="splitWrapper">
          <Split
            className="splitHorizontal"
            sizes={[45, 55]}
          >
            <div className="leftPanel" id="question">
              <img src="https://s3.ap-northeast-2.amazonaws.com/thecoala.io/Algorithm/algorithm1/1001.jpg" alt="profile"/>
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
                      width: editorFontSize*1.5,
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

export default App;
