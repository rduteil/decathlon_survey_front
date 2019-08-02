import React, { Component } from 'react';

import FormSection from '../components/FormSection';
import FormQuestion from '../components/FormQuestion';

import { makeSectionWritable, makeQuestionWritable } from '../../../imports/helpers/Format';

import '../styles/SurveyFormBody.css';

class SurveyFormBody extends Component {
    sortByIndex = (rowA, rowB) => {
        return(rowA.index - rowB.index);
    };

    displayRows = () => {
        let temporaryRows = [];
        for(let i = 0; i < this.props.sections.length; i++){
            if(this.props.sections[i].hangout === this.props.showHangout){
                temporaryRows.push(Object.assign(makeSectionWritable(this.props.sections[i]), {isSection: true, questions: [],}));
                for(let j = 0; j < this.props.sections[i].questions.length; j++){
                    temporaryRows[temporaryRows.length - 1].questions.push(Object.assign(makeQuestionWritable(this.props.sections[i].questions[j]), {isSection: false, sectionIndex: this.props.sections[i].index}));
                    temporaryRows[temporaryRows.length - 1].questions.sort(this.sortByIndex);
                }
            }
        }
        for(let i = 0; i < this.props.questions.length; i++){
            if(this.props.questions[i].hangout === this.props.showHangout){
                temporaryRows.push(Object.assign(makeQuestionWritable(this.props.questions[i]), {isSection: false, sectionIndex: 0}));
            }
        }
        temporaryRows.sort(this.sortByIndex);

        let globalIndex = 0;
        let rows = [];
        for(let i = 0; i < temporaryRows.length; i++){
            if(temporaryRows[i].isSection){
                rows.push(
                    <FormSection
                        key={`section.${i}`}
                        section={temporaryRows[i]}
                    >
                        {this.displayChildren(temporaryRows[i], globalIndex)}
                    </FormSection>
                );
                globalIndex += temporaryRows[i].questions.length;
            }
            else {
                rows.push(
                    <FormQuestion
                        key={`question.${i}`}
                        question={temporaryRows[i]}
                        globalIndex={++globalIndex}
                        handleChangeAnswer={this.props.handleChangeAnswer}
                        handleChangeFile={this.props.handleChangeFile}
                    />
                );
            }
        }
        return(
            <div className={`SurveyFormBodyQuestions`}>
                <div className={`SurveyFormBodyHint`}>
                    {`Ce questionnaire ${this.props.showHangout ? 'de sortie': 'encadré'} est composé de ${globalIndex} questions :`}
                </div>
                {rows}
            </div>
        );
    };

    displayChildren = (section, globalIndex) => {
        let children = [];
        for(let i = 0; i < section.questions.length; i++){
            children.push(
                <FormQuestion
                    key={`subquestion.${i}`}
                    question={section.questions[i]}
                    globalIndex={++globalIndex}
                    handleChangeAnswer={this.props.handleChangeAnswer}
                    handleChangeFile={this.props.handleChangeFile}
                />                        
            );
        }
        return children;
    };

    render = () => {
        let leftButtonStyle = this.props.showHangout ?
            {}:
            {backgroundColor: `#ffffff`, color: `#191919`, cursor: `default`};

        let rightButtonStyle = this.props.showHangout ?
            {backgroundColor: `#ffffff`, color: `#191919`, cursor: `default`}:
            {};

        let toggleDiv = this.props.hangout ? 
            <div className={`SurveyFormBodyToggleHangoutDiv`}>
                <button
                    className={`SurveyFormBodyToggleHangoutButton`}
                    onClick={() => this.props.toggleShowHangout(false)}
                    style={leftButtonStyle}
                >
                    {`Répondre au questionnaire encadré`}
                </button>
                <button
                    className={`SurveyFormBodyToggleHangoutButton`}
                    onClick={() => this.props.toggleShowHangout(true)}
                    style={rightButtonStyle}
                >
                    {`Répondre au questionnaire de sortie`}
                </button>
            </div>:
            null;

        return(
            <div className={`SurveyFormBodyRoot`}>
                {toggleDiv}
                {this.displayRows()}
            </div>
        );
    };
} export default SurveyFormBody;