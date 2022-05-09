import React from 'react';
import './App.css';
import Split from 'react-split'
import { useState, useEffect } from "react";
import $ from 'jquery';
import { isCompositeComponent } from 'react-dom/test-utils';



function App() {
  const [count, setCount] = useState(0);
  const [result, setResult] = useState([]);
  
  const onKeyUp =(event)=>{
    //console.log(event);
  }
  
  const onclick = ()=>{
    setCount(count+1);
    
  }
  useEffect(() => {
    let solutiontext;
    console.log("Count change");
    solutiontext=$('#solution').val();
    fetch('http://dev-compile.coala.services:2358/submissions/?base64_encoded=true&wait=true', {
      method: "POST",
      headers: {
        "Content-Type": "application/json,text/plain;q=0.9,text/html;q=0.8",
        "X-Auth-Token": "coalacompilepass"
      },
      body: JSON.stringify({
        source_code: btoa(solutiontext),
        language_id: "54",
      }),
    }).then((response) => response.json())
    .then((data) => {
      setResult(data);
      //console.log(data);
    });
  
    if(count>0){
      solutiontext=atob(result.stdout);
      $('#result').val(solutiontext);
    }
    
  }, [count]);

  return (
    <div className="App">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min.js"> </script>
      
      <title>Coala_Web</title>
      <header>
        <h1>Coala</h1>
      </header>
      <main>
        <select id="language" name="language">
          <option name={1}>C++</option>
          <option name={1}>C</option>
          <option name={2}>Python</option>
          <option name={3}>Java</option>
        </select>
        <button onClick={onclick}>컴파일{count}</button>
        <button>제출하기</button>
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
                sizes= {[60, 40]}
                direction= 'vertical'
              >
                <textarea id="solution" placeholder="코딩" defaultValue={"#include<iostream>\nusing namespace std;\nint main(){\n\treturn 0;\n}"}/>
                <textarea id="result" placeholder="컴파일" defaultValue={""}/> 
              </Split>
          </Split>
        </div>
      </main>
    </div>
  );
}

export default App;
