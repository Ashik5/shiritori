import React, { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [player1Words, setPlayer1Words] = useState([]);
  const [player2Words, setPlayer2Words] = useState([]);
  const [lastAlphabet, setLastAlphabet] = useState('o');
  const [player1Score, setPlayer1Score] = useState(100);
  const [player2Score, setPlayer2Score] = useState(100);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [seconds, setSeconds] = useState(13);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const player1Ref = useRef(null);
  const player2Ref = useRef(null);



  useEffect(() => {
    if (currentPlayer === 1) {
      player1Ref.current.focus();
    } else {
      player2Ref.current.focus();
    }

  }, [currentPlayer]);
  useEffect(() => {
    if (player1Score <= 0 || player2Score <= 0) {
      setPlayer1Words([]);
      setPlayer2Words([]);
      setLastAlphabet('o');
      setPlayer1Score(100);
      setPlayer2Score(100);
      setCurrentPlayer(1);
      setSeconds(13);
      if (player1Score === player2Score) {
        setAlert("Match Draw")
      } else {

        if (player1Score < player2Score) {
          setPlayer1Score(0);
          setAlert("Player 1 Wins")
        } else {
          setPlayer2Score(0);
          setAlert("Player 2 Wins")
        }
      }
    }

  }, [player1Score, player2Score]);

  return (
    <div className="container">
      <h2 className="alert">{alert}</h2>
      <h2>{seconds}</h2>
      <div className="card-container">
        <div className="card">
          <h2>Player 1</h2>
          <h3>Score: {player1Score}</h3>
          <input className="card-input" type="text" placeholder={lastAlphabet} ref={player1Ref} onKeyDown={(e) => {
            const word = e.target.value;
            if (e.key === 'Enter') {
              fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                .then(res => {
                  if (res.ok) {
                    if (word.length >= 4) {
                      if (word[0].toLowerCase() === lastAlphabet.toLowerCase()) {
                        if (!player2Words.includes(word) && !player1Words.includes(word)) {
                          setPlayer1Words([...player1Words, word]);
                          setPlayer1Score(player1Score - ((word.length - 4) + seconds));

                          setLastAlphabet(word[word.length - 1]);
                          setCurrentPlayer(2);
                          setSeconds(13);
                          setAlert(null);
                        }
                        else {
                          setAlert("Word already used")
                        }
                      }
                      else {
                        setAlert(`Word should start with ${lastAlphabet}`)
                      }
                    }
                    else {
                      setAlert("length should be greater than 4")
                    }
                  }
                  else {
                    setAlert("Invalid Word")
                  }

                })
              e.target.value = '';
            }
          }} />
          <div className="card-content">
            {player1Words.map((word, index) => (
              <div key={index}>{word}</div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2>Player 2</h2>
          <h3>Score: {player2Score}</h3>
          <input className="card-input" type="text" ref={player2Ref} placeholder={lastAlphabet} onKeyDown={(e) => {
            const word = e.target.value;
            if (e.key === 'Enter') {
              fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                .then(res => {
                  if (res.ok) {
                    if (word.length >= 4) {
                      if (word[0].toLowerCase() === lastAlphabet.toLowerCase()) {
                        if (!player2Words.includes(word) && !player1Words.includes(word)) {
                          setPlayer2Words([...player2Words, word]);
                          setPlayer2Score(player2Score - ((word.length - 4) + seconds));
                          setLastAlphabet(word[word.length - 1]);
                          setCurrentPlayer(1);
                          setSeconds(13);
                          setAlert(null);
                        }
                        else {
                          setAlert("Word already used")
                        }

                      } else {
                        setAlert(`Word should start with ${lastAlphabet}`)
                      }
                    }
                    else {
                      setAlert("length should be greater than 4")
                    }

                  }
                  else {
                    setAlert("Invalid Word")
                  }


                })
              e.target.value = '';
            }
          }} />
          <div className="card-content">
            {player2Words.map((word, index) => (
              <div key={index}>{word}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}