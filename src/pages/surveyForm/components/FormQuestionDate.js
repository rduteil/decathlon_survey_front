import React, { Component } from 'react';
import moment from 'moment';
import DateTime from 'react-datetime';

import '../styles/FormQuestionDate.css';

require('moment/locale/fr');

class FormQuestionDate extends Component {
    constructor(props){
        super(props);
        this.state = {
            answer: ['', ''],
        };
        this.onChange = this.onChange.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
    }

    onChange(event){
        let answer = this.state.answer.slice();
        switch(event.target.name){
            case 'firstDateRemover':
                answer[0] = '';
                this.setState({
                    answer: answer,
                }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
                break;
            case 'secondDateRemover':
                answer[1] = '';
                this.setState({
                    answer: answer,
                }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
                break;
            default:
                break;
        }
    }

    onChangeDate(event, isFirst){
        let answer = this.state.answer.slice();
        let dateMin = moment.utc(this.props.dateMin, 'DD-MM-YYYY HH:mm');
        let dateMax = moment.utc(this.props.dateMax, 'DD-MM-YYYY HH:mm');

        if(event.isBefore(dateMin) || event.isAfter(dateMax)){
            return;
        }
        else if(isFirst){
            let secondDate = moment.utc(answer[1], 'DD-MM-YYYY HH:mm');
            if(event.isAfter(secondDate)) return;
            answer[0] = event.format('DD-MM-YYYY HH:mm');
        }
        else {
            let firstDate = moment.utc(this.state.answer[0], 'DD-MM-YYYY HH:mm');
            if(event.isBefore(firstDate)) return;
            answer[1] = event.format('DD-MM-YYYY HH:mm');
        }           
        this.setState({
            answer: answer,
        }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
    }

    render(){
        let secondDate = null;
        if(this.props.dateInterval){
            secondDate = (
                <div className='FormQuestionDateDiv'>
                    <DateTime
                        className='FormQuestionDate'
                        name='secondDate'
                        inputProps={{className: 'FormQuestionDate', readOnly: true, value: this.state.answer[1]}}
                        dateFormat='DD-MM-YYYY'
                        timeFormat='HH:mm'
                        utc={true}
                        value={this.state.answer[1]}
                        onChange={(e) => this.onChangeDate(e, false)}
                    />
                    <button 
                        className='FormQuestionDateRemover' 
                        name='secondDateRemover'
                        title='Cliquez pour supprimer la date'
                        onClick={this.onChange}
                    >
                        x
                    </button>
                </div>
            );
        }

        let hint = ``;
        if(this.props.dateMin !== `Aucune`){
            hint = `Date minimum autorisée : ${this.props.dateMin}. `;
        }
        if(this.props.dateMax !== `Aucune`){
            hint = `${hint}Date maximum autorisée : ${this.props.dateMax}`;
        }


        return(
            <div className='FormQuestionDateRoot'>
                <div className='FormHint'>
                    {hint}
                </div>
                <div className='FormQuestionWrapper' style={{justifyContent: 'space-around'}}>
                    <div className='FormQuestionDateDiv'>
                        <DateTime
                            className='FormQuestionDate'
                            name='firstDate'
                            inputProps={{className: 'FormQuestionDate', readOnly: true, value: this.state.answer[0]}}
                            dateFormat='DD-MM-YYYY'
                            timeFormat='HH:mm'
                            utc={true}
                            value={this.state.answer[0]}
                            onChange={(event) => this.onChangeDate(event, true)}
                        />
                        <button 
                            className='FormQuestionDateRemover' 
                            name='firstDateRemover'
                            title='Cliquez pour supprimer la date'
                            onClick={this.onChange}
                        >
                            x
                        </button>
                    </div>
                    {secondDate}
                </div>
            </div>
        );
    }
}

export default FormQuestionDate;