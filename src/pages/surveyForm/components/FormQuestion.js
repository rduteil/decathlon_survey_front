import React, { Component } from 'react';

import FormQuestionValue from '../components/FormQuestionValue';
import FormQuestionChoice from '../components/FormQuestionChoice';
import FormQuestionRank from '../components/FormQuestionRank';
import FormQuestionFile from '../components/FormQuestionFile';
import FormQuestionScale from '../components/FormQuestionScale';
import FormQuestionDate from '../components/FormQuestionDate';

import '../styles/FormQuestion.css';

class FormQuestion extends Component {
    render(){
        let body = null;
        switch(this.props.question.type){
            case 'QUESTION_VALUE':
                body = (<FormQuestionValue
                    id={this.props.question.id}
                    askFor={this.props.question.askFor}
                    handleChangeAnswer={this.props.handleChangeAnswer}
                />);
                break;
            case 'QUESTION_CHOICE':
                body = (<FormQuestionChoice
                    id={this.props.question.id}
                    linesNumber={this.props.question.linesNumber}
                    columnsNumber={this.props.question.columnsNumber}
                    linesLabels={this.props.question.linesLabels}
                    columnsLabels={this.props.question.columnsLabels}
                    linesImages={this.props.question.linesImages}
                    columnsImages={this.props.question.columnsImages}
                    numberOfAnswers={this.props.question.numberOfAnswers}
                    handleChangeAnswer={this.props.handleChangeAnswer}
                />);
                break;
            case 'QUESTION_RANK':
                body = (<FormQuestionRank
                    id={this.props.question.id}
                    valuesAsImages={this.props.question.valuesAsImages}
                    numberOfValues={this.props.question.numberOfValues}
                    values={this.props.question.values}
                    topLabel={this.props.question.topLabel}
                    bottomLabel={this.props.question.bottomLabel}
                    handleChangeAnswer={this.props.handleChangeAnswer}
                />);
                break;
            case 'QUESTION_FILE':
                body = (<FormQuestionFile
                    id={this.props.question.id}
                    fileTypes={this.props.question.fileTypes}
                    commentary={this.props.question.commentary}
                    handleChangeAnswer={this.props.handleChangeAnswer}
                    handleChangeFile={this.props.handleChangeFile}
                />);
                break;
            case 'QUESTION_SCALE':
                body = (<FormQuestionScale
                    id={this.props.question.id}
                    scaleMin={this.props.question.scaleMin}
                    scaleMax={this.props.question.scaleMax}
                    step={this.props.question.step}
                    labelsValues={this.props.question.labelsValues}
                    selectedValue={this.props.question.selectedValue}
                    graduation={this.props.question.graduation}
                    gradient={this.props.question.gradient}
                    gradientType={this.props.question.gradientType}
                    handleChangeAnswer={this.props.handleChangeAnswer}
                />);
                break;
            case 'QUESTION_DATE':
                body =  (<FormQuestionDate
                    id={this.props.question.id}
                    dateInterval={this.props.question.dateInterval}
                    dateMin={this.props.question.dateMin}
                    dateMax={this.props.question.dateMax}
                    handleChangeAnswer={this.props.handleChangeAnswer}
                />);
                break;
            default:
                break;
        }
        return(
            <div className='FormQuestionRoot'>
                <div className='FormQuestionHeader'>
                    <div className='FormQuestionTitle'>
                        <div className='FormQuestionIndex'>
                            {`Question ${this.props.globalIndex}`}
                        </div>
                        <div className='FormQuestionMandatory'>
                            {this.props.question.mandatory ? '* Obligatoire': null}
                        </div>
                    </div>
                    <div className='FormQuestionName'>
                        {this.props.question.name}
                    </div>
                </div>
                <div className='FormQuestionDescription'>
                    {this.props.question.description}
                </div>
                {body}
            </div>
        );
    }
}

export default FormQuestion;