import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import QuestionValue from '../components/QuestionValue';
import QuestionChoice from '../components/QuestionChoice';
import QuestionRank from '../components/QuestionRank';
import QuestionFile from '../components/QuestionFile';
import QuestionScale from '../components/QuestionScale';
import QuestionDate from '../components/QuestionDate';

import '../styles/Question.css';

class Question extends Component {
    constructor(props){
        super(props);
        this.state = {
            index: this.props.question.index,
            name: this.props.question.name,
            type: this.props.question.type,
            mandatory: this.props.question.mandatory,
            description: this.props.question.description,

            formerIndex: this.props.question.index,
        }
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            index: newProps.question.index,
            name: newProps.question.name,
            type: newProps.question.type,
            mandatory: newProps.question.mandatory,
            description: newProps.question.description,

            formerIndex: newProps.question.index,
        });
        if(
            newProps.question.index !== this.props.question.index ||
            newProps.sectionIndex !== this.props.sectionIndex ||
            newProps.showHangout !== this.props.showHangout
        ){
            this.props.storeScrollingMethod(
                false,
                newProps.question.index,
                newProps.sectionIndex,
                newProps.question.hangout,
                this.scrollToQuestion
            );
        }
    };

    componentDidMount = () => {
        this.props.storeScrollingMethod(
            false,
            this.props.question.index,
            this.props.sectionIndex,
            this.props.question.hangout,
            this.scrollToQuestion
        );
    };

    scrollToQuestion = () => {
        let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        window.scrollTo(0, rect.top + window.scrollY - 90); 
    };

    onChange = (event) => {
        switch(event.target.name){
            case `index`:
                this.setState({
                    index: +event.target.value,
                });
                break;
            case `name`:
                this.setState({
                    name: event.target.value,
                });
                break;
            case `type`:
                this.setState({
                    type: event.target.value,
                }, () => this.props.updateQuestion(
                    this.props.question.index,
                    this.props.sectionIndex,
                    `type`,
                    this.state.type
                ));
                break;
            case `mandatory`:
                this.setState((previousState) => {
                    return({
                        mandatory: !previousState.mandatory,
                    });
                }, () => this.props.updateQuestion(
                    this.props.question.index,
                    this.props.sectionIndex,
                    `mandatory`,
                    this.state.mandatory
                ));
                break;
            case `description`:
                this.setState({
                    description: event.target.value,
                });
                break;
            default:
                break;
        }
    };

    onInput = (event) => {
        this.props.updateQuestion(
            this.props.question.index,
            this.props.sectionIndex,
            `index`,
            event.target.value
        );        
    };

    onBlur = (event) => {
        switch(event.target.name){
            case `index`:
                this.props.updateQuestion(
                    this.props.question.index,
                    this.props.sectionIndex,
                    `index`,
                    this.state.index
                );
                break;
            case `name`:
                this.props.updateQuestion(
                    this.props.question.index,
                    this.props.sectionIndex,
                    `name`,
                    this.state.name
                );
                break;
            case `description`:
                this.props.updateQuestion(
                    this.props.question.index,
                    this.props.sectionIndex,
                    `description`,
                    this.state.description
                );
                break;
            default:
                break;
        }
    };

    render = () => {
        let questionBody = undefined;
        switch(this.state.type){
            case 'QUESTION_VALUE':
                questionBody = (
                    <QuestionValue
                        index={this.props.question.index}
                        sectionIndex={this.props.sectionIndex}
                        askFor={this.props.question.askFor}
                        updateQuestion={this.props.updateQuestion}
                    />
                );
                break;
            case 'QUESTION_CHOICE':
                questionBody = (
                    <QuestionChoice
                        index={this.props.question.index}
                        sectionIndex={this.props.sectionIndex}
                        linesNumber={this.props.question.linesNumber}
                        columnsNumber={this.props.question.columnsNumber}
                        linesLabels={this.props.question.linesLabels}
                        columnsLabels={this.props.question.columnsLabels}
                        linesImages={this.props.question.linesImages}
                        columnsImages={this.props.question.columnsImages}
                        numberOfAnswers={this.props.question.numberOfAnswers}
                        updateQuestion={this.props.updateQuestion}
                    />
                );
                break;
            case 'QUESTION_RANK':
                questionBody = (
                    <QuestionRank
                        index={this.props.question.index}
                        sectionIndex={this.props.sectionIndex}
                        valuesAsImages={this.props.question.valuesAsImages}
                        numberOfValues={this.props.question.numberOfValues}
                        values={this.props.question.values}
                        topLabel={this.props.question.topLabel}
                        bottomLabel={this.props.question.bottomLabel}
                        updateQuestion={this.props.updateQuestion}
                    />
                );
                break;
            case 'QUESTION_FILE':
                questionBody = (
                    <QuestionFile
                        index={this.props.question.index}
                        sectionIndex={this.props.sectionIndex}
                        fileTypes={this.props.question.fileTypes}
                        commentary={this.props.question.commentary}
                        updateQuestion={this.props.updateQuestion}
                    />
                );
                break;
            case 'QUESTION_SCALE':
                questionBody = (
                    <QuestionScale
                        index={this.props.question.index}
                        sectionIndex={this.props.sectionIndex}
                        scaleMin={this.props.question.scaleMin}
                        scaleMax={this.props.question.scaleMax}
                        step={this.props.question.step}
                        labelsValues={this.props.question.labelsValues}
                        selectedValue={this.props.question.selectedValue}
                        graduation={this.props.question.graduation}
                        gradient={this.props.question.gradient}
                        gradientType={this.props.question.gradientType}
                        updateQuestion={this.props.updateQuestion}
                    />
                );
                break;
            case 'QUESTION_DATE':
                questionBody = (
                    <QuestionDate
                        index={this.props.question.index}
                        sectionIndex={this.props.sectionIndex}
                        dateInterval={this.props.question.dateInterval}
                        dateMin={this.props.question.dateMin}
                        dateMax={this.props.question.dateMax}
                        updateQuestion={this.props.updateQuestion}
                    />
                );
                break;
            default:
                break;
        }

        return(
            <div className={`QuestionRoot`}>
                <div className={`QuestionRow`}>
                    <div className={`QuestionLeftBlock`}>
                        {`Question`}
                        <input
                            className={`InputNumber`}
                            type={`number`}
                            name={`index`}
                            value={this.state.index}
                            onChange={this.onChange}
                            onInput={this.onInput}
                            onBlur={this.onBlur}
                        />
                        {`:`}
                    </div>
                    <div className={`QuestionRightBlock`}>
                        <button 
                            className={`QuestionRemoveButton`}
                            onClick={() => this.props.removeQuestion(
                                this.props.question.index,
                                this.props.sectionIndex,
                                this.props.question.name
                            )}
                            title={`Cliquez pour supprimer la question`}
                        >
                            {`Supprimer`}
                        </button>
                        <button
                            className={`QuestionLibraryButton`}
                            onClick={() => this.props.addQuestionToLibrary(this.props.question)}
                            title={`Cliquez pour ajouter la question à la bibliothèque`}
                        >
                            {`Ajouter à la bibliothèque`}
                        </button>
                    </div>
                </div>
                <input 
                    className={`QuestionName`} 
                    type={`text`}
                    placeholder={`Entrez la question...`}
                    name={`name`}
                    value={this.state.name}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                />
                <div className={`QuestionRow`}>
                    <div className={`QuestionLeftBlock`}>
                        {`Question de type :`}
                        <select 
                            className={`QuestionType`}
                            name={`type`} 
                            value={this.state.type}
                            onChange={this.onChange}
                        >
                            <option value={`QUESTION_VALUE`}>
                                {`Saisie`}
                            </option>
                            <option value={`QUESTION_CHOICE`}>
                                {`Choix multiple`}
                            </option>
                            <option value={`QUESTION_RANK`}>
                                {`Classement`}
                            </option>
                            <option value={`QUESTION_FILE`}>
                                {`Média`}
                            </option>
                            <option value={`QUESTION_SCALE`}>
                                {`Echelle`}
                            </option>
                            <option value={`QUESTION_DATE`}>
                                {`Date`}
                            </option>
                        </select>
                    </div>
                    <div className={`QuestionRightBlock`}>
                        <input
                            name={`mandatory`} 
                            type={`checkbox`}
                            checked={this.state.mandatory}
                            onChange={this.onChange}
                        />
                        {`Obligatoire`}
                    </div>
                </div>
                <textarea
                    className={`QuestionDescription`}
                    rows={3} 
                    placeholder={`Entrez des informations complémentaires (facultatif)...`}
                    name={`description`} 
                    value={this.state.description}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                />
                <div className={`QuestionBodyDiv`}>
                    {questionBody}
                </div>
            </div>
        );
    };
} export default Question;