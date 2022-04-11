import React from 'react';
import './App.css';
import Split from 'react-split'


function App() {
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
        <button>컴파일</button>
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
                <textarea id="solution" placeholder="코딩" defaultValue={""} />
                <textarea id="result" placeholder="컴파일" defaultValue={""} />
              </Split>
          </Split>
        </div>
      </main>
    </div>
  );
}

export default App;
