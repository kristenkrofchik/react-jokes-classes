import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) { 
    super(props);
    this.state = { jokes:[] };
    this.getJokes = this.getJokes.bind(this);
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.resetVotes = this.resetVotes.bind(this);
    this.vote = this.vote.bind(this);
  };

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  async getJokes() {
    try {
      let jokes = this.state.jokes;
      let jokeVotes = JSON.parse(
        window.localStorage.getItem("jokeVotes") || "{}");
      let seenJokes = new Set(jokes.map(j => j.id));
      
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...joke } = res.data;
  
        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokeVotes[joke.id] = jokeVotes[joke.id] || 1;
          jokes.push({ ...joke, votes: jokeVotes[joke.id] });
        } else {
          console.error("Duplicate Found!");
        }
      }
      this.setState({ jokes });
    } catch (e) {
      console.log(e);
    }
  }

  generateNewJokes() {
    this.setState({ jokes: [] });
  }

  resetVotes() {
    window.localStorage.setItem("jokeVotes", "{}");
    this.setState(st => ({
      jokes: st.jokes.map(joke => ({ ...joke, votes: 0 }))
    }));
  }

  vote(id, delta) {
    this.setState(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  if (jokes.length) {
    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

}

}


export default JokeList;
