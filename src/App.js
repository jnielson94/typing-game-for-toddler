import React from "react";
import styled from "styled-components";

const DescriptionText = styled.p`
  font-size: 2rem;
  margin: 0;
`;

const positiveColor = "#1d0094";
const negativeColor = "#006557";
const SingleLetter = styled.p`
  font-size: 8rem;
  border: 2px solid
    ${({ positive }) => (positive ? positiveColor : negativeColor)};
  max-width: 3ch;
  margin: auto;
  line-height: 1;
`;

const MatchButton = styled.button`
  font-size: 2rem;
  margin-right: 1rem;
  padding: 0.5rem;
  color: ${({ positive }) => (positive ? positiveColor : negativeColor)};
  background-color: #fff;
  border-radius: 0.5rem;
  border: 2px solid #0f0f0f;
`;

/*

font-family: 'Roboto Mono', monospace;
font-family: 'Pacifico', cursive;
font-family: 'Permanent Marker', cursive;

*/

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const reducer = (state, event) => {
  // Check for match
  if (event.letter) {
    return {
      ...state,
      lastLetter: event.letter,
      message: ""
    };
  } else if (event.didMatch !== null) {
    if (event.didMatch) {
      // He says it matches... does it?
      if (state.lastLetter === state.target) {
        let remainingLetters = [...state.lettersLeft];
        remainingLetters.splice(state.lettersLeft.indexOf(state.target), 1);
        if (remainingLetters.length === 0) {
          //Made it through, reset!
          remainingLetters = alphabet.split("");
          return {
            ...state,
            lastLetter: "",
            target:
              remainingLetters[
                Math.floor(Math.random() * remainingLetters.length)
              ],
            message: "Great job! You made it through all the letters!",
            lettersLeft: remainingLetters
          };
        }
        return {
          ...state,
          lastLetter: "",
          target:
            remainingLetters[
              Math.floor(Math.random() * remainingLetters.length)
            ],
          message: "Great job! You typed the right letter and it matched!",
          lettersLeft: remainingLetters
        };
      } else {
        return {
          ...state,
          message: "Not quite. Try again!"
        };
      }
    } else {
      // He says it doesn't match... does it really not?
      if (state.lastLetter === state.target) {
        return {
          ...state,
          message: "Not quite. Try again!"
        };
      } else {
        return {
          ...state,
          lastLetter: "",
          message: "Great job! You typed the wrong letter and noticed!"
        };
      }
    }
  }
  return {
    ...state
  };
};

export default function App() {
  const letters = alphabet.split("");
  const [state, dispatch] = React.useReducer(reducer, {
    form: "",
    lastLetter: "",
    target: letters[Math.floor(Math.random() * letters.length)],
    message: "",
    lettersLeft: letters
  });
  const inputRef = React.useRef();
  const yesRef = React.useRef();
  React.useEffect(() => {
    if (state.lastLetter === "") {
      // Focus box
      inputRef.current && inputRef.current.focus();
    } else {
      // Focus the yes button
      yesRef.current && yesRef.current.focus();
    }
  }, [state]);
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontSize: "3rem",
          margin: "0",
          color: state.message.includes("Not quite") ? "#0074ec" : "#006557"
        }}
      >
        {state.message}
      </p>
      <DescriptionText>Find the letter:</DescriptionText>
      <SingleLetter positive={true}>{state.target}</SingleLetter>
      {state.lastLetter ? (
        <>
          <DescriptionText>You typed:</DescriptionText>
          <SingleLetter positive={false}>{state.lastLetter}</SingleLetter>
          <DescriptionText>Does it match?</DescriptionText>
          <MatchButton
            ref={yesRef}
            positive={true}
            onClick={() => dispatch({ didMatch: true })}
          >
            Yes
          </MatchButton>
          <MatchButton
            positive={false}
            onClick={() => dispatch({ didMatch: false })}
          >
            No
          </MatchButton>
        </>
      ) : (
        <input
          ref={inputRef}
          style={{
            marginTop: "1rem",
            fontSize: "3rem",
            marginLeft: "auto",
            marginRight: "auto",
            width: "2ch",
            padding: "1ch"
          }}
          value={state.form}
          onChange={event => {
            const letter = event.target.value;
            dispatch({ letter });
          }}
        />
      )}
    </div>
  );
}
