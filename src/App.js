import "./App.css";
import data from "./qcm.json";
import React from "react";

class Question extends React.Component {
    constructor(props) {
        super(props);
        let questions = data.data;
        questions.map((elem, index) => (elem.id = index));
        questions.forEach((elem) => {
            elem.reponses.map((elem, index) => (elem.id = index));
        });
        let question = JSON.parse(
            JSON.stringify(
                questions[Math.floor(Math.random() * questions.length)]
            )
        );
        question.reponses.map((e) => (e.selected = false));
        this.state = {
            selectedResponses: [],
            questions: data.data,
            question: question,
            check: false,
        };
        this.handleButton = this.handleButton.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.getClassName = this.getClassName.bind(this);
    }
    getQuestion() {
        let question = JSON.parse(
            JSON.stringify(
                this.state.questions[
                    Math.floor(Math.random() * this.state.questions.length)
                ]
            )
        );
        question.reponses.map((e) => (e.selected = false));
        return question;
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
        setTimeout(() => {
            this.setState({ check: false });
            if (correct) this.props.updateScore(100);
            else this.props.updateScore(-200);
            this.setState({
                question: this.getQuestion(),
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
                <p>Score : {this.props.score}</p>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { score: 0 };
        this.updateScore = this.updateScore.bind(this);
    }
    updateScore(n) {
        this.setState({ score: this.state.score + n });
    }
    render() {
        return (
            <div>
                <Score score={this.state.score}></Score>
                <Question updateScore={this.updateScore}></Question>
            </div>
        );
    }
}

export default App;
