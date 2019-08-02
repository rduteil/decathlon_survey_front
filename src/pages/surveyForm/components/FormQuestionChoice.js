import React, { Component } from 'react';

import '../styles/FormQuestionChoice.css';

class FormQuestionChoice extends Component {
    constructor(props){
        super(props);

        let checkedCases = [];
        let answer = [];
        for(let i = 0; i < this.props.linesNumber; i++){
            let checkedLine = [];
            for(let j = 0; j < this.props.columnsNumber; j++){
                checkedLine.push({name: i + ':' + j, checked: false,});
                answer.push(false);
            }
            checkedCases.push(checkedLine);
        }

        this.state = {
            checkedCases: checkedCases,
            answer: answer,
        };
    }

    onChange = (event) => {
        let checkedCases = this.state.checkedCases.slice();
        let answer = this.state.answer.slice();
        let positionClicked = (+event.target.name.split(',')[1] * this.props.columnsNumber) + +event.target.id;

        if(this.props.numberOfAnswers > 1){
            if(checkedCases[Number(event.target.name.split(',')[1])][event.target.id].checked){
                checkedCases[Number(event.target.name.split(',')[1])][event.target.id].checked = false;
                answer[positionClicked] = false;
            }
            else {
                let checked = 0;
                for(let i = 0; i < checkedCases[Number(event.target.name.split(',')[1])].length; i++){
                    if(checkedCases[Number(event.target.name.split(',')[1])][i].checked === true){
                        checked ++;
                    }
                }
                if(checked < this.props.numberOfAnswers){
                    checkedCases[Number(event.target.name.split(',')[1])][event.target.id].checked = true;
                    answer[positionClicked] = true;
                }
            }
        }
        else {
            for(let i = 0; i < checkedCases[Number(event.target.name.split(',')[1])].length; i++){
                checkedCases[Number(event.target.name.split(',')[1])][i].checked = false;
                answer[(+event.target.name.split(',')[1] * this.props.columnsNumber)+ i] = false;
            }
            checkedCases[Number(event.target.name.split(',')[1])][event.target.id].checked = true;
            answer[positionClicked] = true;
        }
        this.setState({
            checkedCases: checkedCases,
            answer: answer,
        }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
    };

    render = () => {
        let table = null;       
        if(this.props.linesNumber === 1){
            let rows = [];
            for(let i = 0; i < this.props.columnsNumber; i++){
                rows.push(
                    <div className='FormQuestionLine' key={i}>
                        <div className='FormQuestionCell' style={{width: `${100 / (this.props.columnsNumber + 1)}%`, border: 'none', justifyContent: 'right'}}>
                            <input
                                name={this.props.id + ',0'}
                                id={i}
                                type={this.props.numberOfAnswers === 1 ? 'radio' : 'checkbox'}
                                onChange={this.onChange}
                                checked={this.state.checkedCases[0][i].checked}
                            />
                        </div>
                        <div className='FormQuestionCell' style={{width: `${100 / (this.props.columnsNumber + 1)}%`, border: 'none', justifyContent: 'left'}}>
                            {
                                this.props.columnsImages[i] === null || this.props.columnsImages[i] === undefined ? null: 
                                    <img className='FormQuestionCellImage' src={this.props.columnsImages[i]} alt=''/>
                            }
                            <div className='FormQuestionCellText'>
                                {this.props.columnsLabels[i]}
                            </div>
                        </div>
                    </div>
                );
            }
            table = (
                <div className='FormQuestionTable'>
                    {rows}
                </div>
            );
        }
        else {
            let lines = [];

            let header = [];
            header.push(<div className='FormQuestionCell' key={this.props.columnsNumber + 1} style={{width: `${100 / (this.props.columnsNumber + 1)}%`}}/>);
            for(let i = 0; i < this.props.columnsNumber; i++){
                header.push(
                    <div className='FormQuestionCell' key={i} style={{width: `${100 / (this.props.columnsNumber + 1)}%`}}>
                        {
                            this.props.columnsImages[i] === null || this.props.columnsImages[i] === undefined ? null: 
                                <img className='FormQuestionCellImage' src={this.props.columnsImages[i]} alt=''/>
                        }
                        <div className='FormQuestionCellText'>
                            {this.props.columnsLabels[i]}
                        </div>
                    </div>
                );
            }

            lines.push(
                <div className='FormQuestionRow' key={this.props.linesNumber + 1}>
                    {header}
                </div>
            );

            for(let i = 0; i < this.props.linesNumber; i++){
                let line = [];
                line.push(
                    <div className='FormQuestionCell' key={this.props.columnsNumber + 1} style={{width: `${100 / (this.props.columnsNumber + 1)}%`}}>
                        {
                            this.props.linesImages[i] === null || this.props.linesImages[i] === undefined ? null: 
                                <img className='FormQuestionCellImage' src={this.props.linesImages[i]} alt=''/>
                        }
                        <div className='FormQuestionCellText'>
                            {this.props.linesLabels[i]}
                        </div>
                    </div>
                );
                for(let j = 0; j < this.props.columnsNumber; j++){
                    line.push(
                        <div className='FormQuestionCell' key={j} style={{width: `${100 / (this.props.columnsNumber + 1)}%`}}>
                            <input
                                name={this.props.id + ',' + i}
                                id={j}
                                type={this.props.numberOfAnswers === 1 ? 'radio' : 'checkbox'}
                                onChange={this.onChange}
                                checked={this.state.checkedCases[i][j].checked}
                            />
                        </div>
                    );
                }
                lines.push(
                    <div className='FormQuestionRow' key={i}>
                        {line}
                    </div>
                );
            }
            table = (
                <div className='FormQuestionTable'>
                    {lines}
                </div>
            );
        }

        return(
            <div className='FormQuestionChoiceRoot'>
                <div className='FormHint'>
                    {`Nombre maximum de réponses${this.props.linesNumber > 1 ? ` par ligne`: ``} : ${this.props.numberOfAnswers}`}
                </div>
                <div className='FormQuestionWrapper'>
                    {table}
                </div>
            </div>
        );
    };
}

export default FormQuestionChoice;