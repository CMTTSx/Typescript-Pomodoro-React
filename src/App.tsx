import React from 'react';
import '../src/index.css';
import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer
        pomodoroTime={1500} // 25min
        shortRestTime={300}
        longRestTime={900}
        cycles={4}
      />
    </div>
  );
}

export default App;
