import React from 'react';
import './App.css'

const SESSION_LENGTH = '25:00';
const BREAK_LENGTH = '05:00';
const AUDIO_FILE =
  'http://sampleswap.org/samples-ghost/%20MAY%202014%20LATEST%20ADDITIONS/PUBLIC%20DOMAIN%20MUSIC/626[kb]buster-brown-gonna-make-you-happy-1943.mp3.mp3';

const Controller = props => {
  let lengthNum = props.length;
  lengthNum = Number(lengthNum.slice(0, lengthNum.indexOf(':')));

  return (
    <div className="col s6">
      <h5 id={`${props.id}-label`}>{props.title}</h5>
      <div className="controller">
        <button className="btn-arrow">
          <i
            id={`${props.id}-decrement`}
            className="fas fa-arrow-down"
            onClick={() => props.lengthDecreased(props.title)}
          />
        </button>
        <span id={`${props.id}-length`} className="length">
          {lengthNum}
        </span>
        <button className="btn-arrow">
          <i
            id={`${props.id}-increment`}
            className="fas fa-arrow-up"
            onClick={() => props.lengthIncreased(props.title)}
          />
        </button>
      </div>
    </div>
  );
};

class App extends React.Component {
 state = {
    sessionLength: SESSION_LENGTH,
    breakLength: BREAK_LENGTH,
    timeLeft: SESSION_LENGTH,
    title: 'Pomodoro Clock',
    running: 0,
    btnLabel: 'Start',
    isBreak: 0
  };

  audio = () => document.getElementById('beep');

  getMins = length => {
    return Number(length.slice(0, length.indexOf(':')));
  };

  getSecs = length => {
    return Number(length.slice(length.indexOf(':') + 1));
  };

  lengthIncreaseHandler = cat => {
    if (this.state.running === 1) {
      return;
    }

    if (cat === 'Break Length') {
      let valCurrent = this.getMins(this.state.breakLength);
      if (valCurrent === 60) {
        return;
      }
      valCurrent += 1;
      this.setState({ breakLength: `${valCurrent}:00` });
    } else if (cat === 'Session Length') {
      let valCurrent = this.getMins(this.state.sessionLength);
      if (valCurrent === 60) {
        return;
      }
      valCurrent += 1;
      this.setState({
        sessionLength: `${valCurrent}:00`,
        timeLeft: `${valCurrent}:00`
      });
    }
  };

  lengthDecreaseHandler = cat => {
    if (this.state.running === 1) {
      return;
    }

    if (cat === 'Break Length') {
      let valCurrent = this.getMins(this.state.breakLength);
      if (valCurrent === 1) {
        return;
      }
      valCurrent -= 1;
      this.setState({ breakLength: `${valCurrent}:00` });
    } else if (cat === 'Session Length') {
      let valCurrent = this.getMins(this.state.sessionLength);
      if (valCurrent === 1) {
        return;
      }
      valCurrent -= 1;
      this.setState({
        sessionLength: `${valCurrent}:00`,
        timeLeft: `${valCurrent}:00`
      });
    }
  };

  startClickHandler = () => {
    if (this.state.running === 0) {
      if (this.state.isBreak === 1) {
        this.audio().play();
        this.setState({
          title: 'Break',
          running: 1,
          btnLabel: 'Pause'
        });
      } else {
        this.audio().pause();
        this.setState({
          title: 'Session',
          running: 1,
          btnLabel: 'Pause'
        });
      }

      let timer =
        this.getMins(this.state.timeLeft) * 60 +
        this.getSecs(this.state.timeLeft);

      this.timerInterval = setInterval(() => {
        if (timer === 0 && this.state.isBreak === 0) {
          this.audio().play();
          this.setState({
            isBreak: 1,
            timeLeft: this.state.breakLength,
            title: 'Break'
          });
          timer =
            this.getMins(this.state.timeLeft) * 60 +
            this.getSecs(this.state.timeLeft) +
            1;
        } else if (timer === 0 && this.state.isBreak === 1) {
          this.audio().pause();
          this.audio().currentTime = 0;
          this.setState({
            isBreak: 0,
            timeLeft: this.state.sessionLength,
            title: 'Session'
          });
          timer =
            this.getMins(this.state.timeLeft) * 60 +
            this.getSecs(this.state.timeLeft) +
            1;
        }
        timer -= 1;
        let mins = Math.floor(timer / 60);
        mins = mins < 10 ? `0${mins}` : mins;
        let secs = timer % 60 > 9 ? timer % 60 : `0${timer % 60}`;
        this.setState({
          timeLeft: `${mins}:${secs}`
        });
      }, 1000);
    } else {
      this.audio().pause();
      clearInterval(this.timerInterval);
      this.setState({
        title: 'Paused',
        running: 0,
        btnLabel: 'Resume'
      });
    }
  };
    this.setState({
      sessionLength: SESSION_LENGTH,
      breakLength: BREAK_LENGTH,
      timeLeft: SESSION_LENGTH,
      title: 'Pomodoro Clock',
      running: 0,
      btnLabel: 'Start',
      isBreak: 0
    });
  };

  render() {
    return (
      <div className="App">
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col s12 m8 offset-m2">
                <div className="card">
                  <div className="card-content">
                    <div id="timer-label" className="card-title">
                      {this.state.title}
                    </div>
                    <h1 id="time-left">{this.state.timeLeft}</h1>
                    <button
                      id="start_stop"
                      className="btn"
                      onClick={this.startClickHandler}
                    >
                      {this.state.btnLabel}
                    </button>
                    <button
                      id="reset"
                      className="btn red"
                      onClick={this.resetClickHandler}
                    >
                      Reset
                    </button>
                    <div className="row">
                      <Controller
                        title="Break Length"
                        id="break"
                        length={this.state.breakLength}
                        lengthDecreased={this.lengthDecreaseHandler}
                        lengthIncreased={this.lengthIncreaseHandler}
                      />
                      <Controller
                        title="Session Length"
                        id="session"
                        length={this.state.sessionLength}
                        lengthDecreased={this.lengthDecreaseHandler}
                        lengthIncreased={this.lengthIncreaseHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
       <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1"
          ref={(audio) => { this.audioBeep = audio; }} />
      </div>
    );
  }
}

export default App;