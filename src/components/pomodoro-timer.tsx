import React, { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToMinutes } from '../utils/seconds-to-minutes';
import { Button } from '../components/button';
import { Timer } from '../components/timer';
import { secondsToTime } from '../utils/seconds-to-time';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/src_sounds_bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/src_sounds_bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.pomodoroTime);
  const [timeCouting, setTimeCouting] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = React.useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = React.useState(0);
  const [fullWorkingTime, setFullWorkingTime] = React.useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = React.useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCouting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCouting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [setTimeCouting, setWorking, setResting, setMainTime, props.pomodoroTime]);

  const configureRest = useCallback(
    (Long: boolean) => {
      setTimeCouting(true);
      setWorking(false);
      setResting(true);

      if (Long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }

      audioStopWorking.play();
    },
    [
      setTimeCouting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;
    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    numberOfPomodoros,
    props.cycles,
    completedCycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>You are {working ? 'Working' : 'Resting'} </h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCouting ? 'Pause' : 'Play'}
          onClick={() => setTimeCouting(!timeCouting)}
        ></Button>
      </div>

      <div className="details">
        <p>Ciclos concluídos: {completedCycles} </p>
        <p>Horas Trabalhadas: {secondsToTime(fullWorkingTime)} </p>
        <p>Pomodoros Concluídos: {numberOfPomodoros} </p>
      </div>
    </div>
  );
}
