import React, { Component } from 'react';

import Section from '../components/Section';
import Question from '../components/Question';

import '../styles/SurveyBody.css';
import '../styles/Inputs.css';

class SurveyBody extends Component{
    constructor(props){
        super(props);
        let rows = [];
        for(let i = 0; i < this.props.sections.length; i++){
            if(this.props.sections[i].hangout === this.props.showHangout){
                rows.push(Object.assign(this.props.sections[i], {isSection: true,}));
            }
        }
        for(let i = 0; i < this.props.questions.length; i++){
            if(this.props.questions[i].hangout === this.props.showHangout){
                rows.push(Object.assign(this.props.questions[i], {isSection: false,}));
            }
        }
        rows.sort(this.sortByIndex);

        this.state = {
            rows: rows,
            resizing: false,
            previousX: 0,
            dx: 0,
        };
    }

    componentWillReceiveProps = (newProps) => {
        let rows = [];
        for(let i = 0; i < newProps.sections.length; i++){
            if(newProps.sections[i].hangout === newProps.showHangout){
                newProps.sections[i].questions.sort(this.sortByIndex);
                rows.push(Object.assign(newProps.sections[i], {isSection: true,}));
            }
        }
        for(let i = 0; i < newProps.questions.length; i++){
            if(newProps.questions[i].hangout === newProps.showHangout){
                rows.push(Object.assign(newProps.questions[i], {isSection: false,}));
            }
        }
        rows.sort(this.sortByIndex);

        this.setState({
            rows: rows,
        });
    };

    sortByIndex = (rowA, rowB) => {
        return(rowA.index - rowB.index);
    };

    displayRows = () => {
        let displayRows = [];
        for(let i = 0; i < this.state.rows.length; i++){
            if(this.state.rows[i].isSection){
                displayRows.push(
                    <Section
                        key={`${i}.s`}
                        section={this.state.rows[i]}
                        updateSection={this.props.updateSection}
                        removeSection={this.props.removeSection}
                        addLibraryQuestion={this.props.addLibraryQuestion}
                        addFreshQuestion={this.props.addFreshQuestion}
                        storeScrollingMethod={this.props.storeScrollingMethod}
                        showHangout={this.props.showHangout}
                    >
                        {this.displayChildren(this.state.rows[i].questions, this.state.rows[i].index)}
                    </Section>
                );
            }
            else {
                displayRows.push(
                    <Question
                        key={`${i}.q`}
                        question={this.state.rows[i]}
                        sectionIndex={0}
                        updateQuestion={this.props.updateQuestion}
                        removeQuestion={this.props.removeQuestion}
                        addQuestionToLibrary={this.props.addQuestionToLibrary}
                        storeScrollingMethod={this.props.storeScrollingMethod}
                        showHangout={this.props.showHangout}
                    />
                );
            }
        }
        return displayRows;
    };

    displayChildren = (questions, sectionIndex) => {
        let displayChildren = [];
        for(let i = 0; i < questions.length; i++){
            displayChildren.push(
                <Question
                    key={`${i}.q`}
                    question={questions[i]}
                    sectionIndex={sectionIndex}
                    updateQuestion={this.props.updateQuestion}
                    removeQuestion={this.props.removeQuestion}
                    addQuestionToLibrary={this.props.addQuestionToLibrary}
                    storeScrollingMethod={this.props.storeScrollingMethod}
                    showHangout={this.props.showHangout}
                />
            );
        }
        return displayChildren;
    };

    render = () => {
        let leftButtonStyle = this.props.showHangout ?
            {}:
            {backgroundColor: '#ffffff', color: '#191919', cursor: 'default'};

        let rightButtonStyle = this.props.showHangout ?
            {backgroundColor: '#ffffff', color: '#191919', cursor: 'default'}:
            {};

        let toggleDiv = this.props.hangout ? 
            <div className={`SurveyBodyToggleHangoutDiv`}>
                <button
                    className={`SurveyBodyToggleHangoutButton`}
                    onClick={this.props.handleToggleHangout}
                    value={false}
                    style={leftButtonStyle}
                >
                    {`Questionnaire encadré`}
                </button>
                <button
                    className={`SurveyBodyToggleHangoutButton`}
                    onClick={this.props.handleToggleHangout}
                    value={true}
                    style={rightButtonStyle}
                >
                    {`Questionnaire de sortie`}
                </button>
            </div>:
            null;

        return(
            <div className={`SurveyBodyRoot`}>
                <div className={`SurveyBodyTitle`}>
                    {`CORPS DU QUESTIONNAIRE`} 
                </div>
                <div className='SurveyBodyNewRowDiv'>
                    <button
                        className={`SurveyBodyNewRow NewSection`}
                        onClick={() => this.props.addSection()}
                    >
                        {`NOUVELLE SECTION`}
                    </button>
                    <button
                        className={`SurveyBodyNewRow NewQuestion`}
                        onClick={() => this.props.addFreshQuestion(0)}
                    >
                        {`NOUVELLE QUESTION`}
                    </button>
                    <button
                        className={`SurveyBodyNewRow NewQuestion`}
                        onClick={() => this.props.addLibraryQuestion(0)}
                    >
                        {`BIBLIOTHEQUE`}
                    </button>
                </div>
                <div className={`SurveyBodyQuestions`}>
                    {toggleDiv}
                    {this.displayRows()}
                </div>
            </div>
        );
    };
} export default SurveyBody;