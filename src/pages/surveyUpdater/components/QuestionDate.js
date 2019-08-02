import React, { Component } from 'react';
import DateTime from 'react-datetime';
import moment from 'moment';

import '../../../../node_modules/react-datetime/css/react-datetime.css';

class QuestionDate extends Component {
    constructor(props){
        super(props);
        this.state = {
            dateInterval: this.props.dateInterval,
            dateMin: this.props.dateMin,
            dateMax: this.props.dateMax,
        };
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            dateInterval: newProps.dateInterval,
            dateMin: newProps.dateMin,
            dateMax: newProps.dateMax,
        });
    };

    onChange = (event) => {
        switch(event.target.name){
            case `dateInterval`:
                this.setState((previousState) => {
                    return({
                        dateInterval: !previousState.dateInterval
                    });
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `dateInterval`,
                    this.state.dateInterval
                ));
                break;
            case `dateMin`:
                this.setState({
                    dateMin: `Aucune`,
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `dateMin`,
                    this.state.dateMin
                ));
                break;
            case `dateMax`:
                this.setState({
                    dateMax: `Aucune`,
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `dateMax`,
                    this.state.dateMax
                ));
                break;
            default:
                break;
        }
    }

    onChangeDateMax = (date) => {
        let dateMin = moment.utc(this.state.dateMin, `DD-MM-YYYY HH:mm`);
        let dateMax = date.format(`DD-MM-YYYY HH:mm`);
        if(date.isBefore(dateMin)) return;
        else {
            this.setState({
                dateMax: dateMax,
            }, () => this.props.updateQuestion(
                this.props.index,
                this.props.sectionIndex,
                `dateMax`,
                this.state.dateMax
            ));
        }
    };

    onChangeDateMin = (date) => {
        let dateMax = moment.utc(this.state.dateMax, `DD-MM-YYYY HH:mm`);
        let dateMin = date.format(`DD-MM-YYYY HH:mm`);
        if(date.isAfter(dateMax)) return;
        else {
            this.setState({
                dateMin: dateMin,
            }, () => this.props.updateQuestion(
                this.props.index,
                this.props.sectionIndex,
                `dateMin`,
                this.state.dateMin
            ));
        }
    };
    
    render = () => {
        let removeDateMin = this.state.dateMin === `Aucune` ?
            null:
            <button 
                className={`InputDateRemover`} 
                name={`dateMin`} 
                onClick={(event) => this.onChange(event)} 
                title={`Cliquez pour supprimer la date`}
            >
                {`x`}
            </button>;
        let removeDateMax = this.state.dateMax === `Aucune` ?
            null:
            <button 
                className={`InputDateRemover`} 
                name={`dateMax`} 
                onClick={(event) => this.onChange(event)} 
                title={`Cliquez pour supprimer la date`}
            >
                {`x`}
            </button>;
        
        return(
            <div className={`QuestionDateRoot`}>
                <div className={`InputCheckboxDiv`}>
                    <input 
                        name={`dateInterval`} 
                        type={`checkbox`}
                        checked={this.state.dateInterval}
                        onChange={(event) => this.onChange(event)}
                    />
                    {`Demander un intervalle de deux dates plutôt qu'une date simple`}
                </div>
                <div className={`InputDatesDiv`}>
                    {`Date minimum limite :`}
                    <DateTime
                        className={`InputDate`}
                        inputProps={{className: `InputDate`, readOnly: true,}}
                        dateFormat={`DD-MM-YYYY`}
                        timeFormat={`HH:mm`}
                        utc={true}
                        value={this.state.dateMin}
                        onChange={(date) => this.onChangeDateMin(date)}
                    />
                    {removeDateMin}
                    {`, date maximum limite :`}
                    <DateTime
                        className='InputDate'
                        inputProps={{className: `InputDate`, readOnly: true,}}
                        dateFormat={`DD-MM-YYYY`}
                        timeFormat={`HH:mm`}
                        utc={true}
                        value={this.state.dateMax}
                        onChange={(date) => this.onChangeDateMax(date)}
                    />
                    {removeDateMax}
                </div>
            </div>
        );
    }
} export default QuestionDate;