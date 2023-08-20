import "./App.css";
import data from "./qcm.json";
import React from "react";

class Question extends React.Component {
    constructor(props) {
        super(props);
        let questions = data.data;
        questions.map((elem, index) => {
            elem.id = index;
            elem.score = 0;
            elem.alreadyGuess = false;
            return elem;
        });
        questions.forEach((elem) => {
            elem.reponses.map((elem, index) => (elem.id = index));
        });
        let random = Math.floor(Math.random() * questions.length);
        let question = JSON.parse(JSON.stringify(questions[random]));
        question.reponses.map((e) => (e.selected = false));
        this.state = {
            selectedResponses: [],
            questions: data.data,
            question: question,
            check: false,
            random: random,
        };
        this.handleButton = this.handleButton.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.getClassName = this.getClassName.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
    }
    getQuestion() {
        let random = Math.random();
        let randomIndex = 0;
        let questions = this.state.questions;
        let proba = [];
        let sum = questions.reduce((acc, elem) => acc + elem.score, 0);
        for (let i = 0; i < questions.length; i++) {
            let prob =
                (proba[i - 1] ? proba[i - 1] : 0) + questions[i].score / sum;
            proba.push(Math.min(1, prob));
        }
        console.log(proba, random);
        for (let i = 0; i < proba.length; i++) {
            if (proba[i] > random) {
                randomIndex = i;
                break;
            }
        }
        let question = JSON.parse(
            JSON.stringify(this.state.questions[randomIndex])
        );
        question.reponses.map((e) => (e.selected = false));
        return { question: question, random: randomIndex };
    }
    getClassName(correct, selected) {
        let className = "btn-responses";
        if (selected && !this.state.check) className += " response-selected";
        if (this.state.check) {
            if (selected && correct) className += " correct";
            else if (selected) className += " incorrect";
            if (correct) className += " valid";
        }
        return className;
    }
    renderResponse(responses) {
        if (!responses) return null;
        let responsesList = responses.map((elem, index) => (
            <button
                className={this.getClassName(elem.correct, elem.selected)}
                onClick={(e) => this.handleButton(e, index)}
                key={elem.id}
            >
                {elem.text}
            </button>
        ));
        return <div className="div-responses">{responsesList}</div>;
    }
    handleButton(e, index) {
        let question = this.state.question;
        question.reponses[index].selected = !question.reponses[index].selected;
        let selectedResponses = question.reponses.filter(
            (elem) => elem.selected
        );
        this.setState({
            question: question,
            selectedResponses: selectedResponses,
        });
    }
    handleValidation() {
        this.setState({ check: true });
        let correct =
            2 *
                this.state.selectedResponses.filter((elem) => elem.correct)
                    .length -
                this.state.question.reponses.filter((elem) => elem.correct)
                    .length -
                this.state.selectedResponses.length ===
            0;
        let newQuestions = this.state.questions;
        let alreadyGuess = false;
        for (let i = 0; i < newQuestions.length; i++) {
            if (this.state.random === i && correct) {
                newQuestions[i].score = 0;
                alreadyGuess = newQuestions[i].alreadyGuess;
                newQuestions[i].alreadyGuess = true;
            } else newQuestions[i].score = newQuestions[i].score + 2;
        }
        setTimeout(() => {
            this.setState({ check: false, questions: newQuestions });
            if (correct) this.props.updateScore(5);
            else this.props.updateScore(-10);
            if (!alreadyGuess && correct) this.props.updateCorrect();
            let newQuestion = this.getQuestion();
            this.setState({
                question: newQuestion.question,
                random: newQuestion.random,
                selectedResponses: [],
            });
        }, 1000);
    }
    render() {
        return (
            <div className="div-question">
                <div className="div-question-txt">
                    <p>{this.state.question.question}</p>
                </div>
                <div className="separator"></div>
                {this.renderResponse(this.state.question.reponses)}
                <button className="btn-send" onClick={this.handleValidation}>
                    Valider
                </button>
            </div>
        );
    }
}

class Score extends React.Component {
    render() {
        return (
            <div className="div-score">
                <p>
                    Score : {this.props.score} ({this.props.correct}/160)
                </p>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { score: 0, correct: 0 };
        this.updateScore = this.updateScore.bind(this);
        this.updateCorrect = this.updateCorrect.bind(this);
    }
    updateScore(n) {
        this.setState({ score: this.state.score + n });
    }
    updateCorrect() {
        this.setState({ correct: this.state.correct + 1 });
    }
    render() {
        return (
            <div>
                <Score
                    score={this.state.score}
                    correct={this.state.correct}
                ></Score>
                <Question
                    updateScore={this.updateScore}
                    updateCorrect={this.updateCorrect}
                ></Question>
            </div>
        );
    }
}

export default App;
