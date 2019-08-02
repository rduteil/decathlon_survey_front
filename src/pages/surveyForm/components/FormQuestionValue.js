import React, { Component } from 'react';

class FormQuestionValue extends Component {
    constructor(props){
        super(props);
        this.state = {
            answer: '',
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        switch(e.target.name){
            case 'text':
                this.setState({
                    answer: e.target.value,
                }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
                break;
            case 'number':
                let value = 0;
                if(/^0$|^-?\d+(\.)?(\d+)?$/.test(e.target.value) || /^\-$/.test(e.target.value) || e.target.value === '') value = e.target.value;
                this.setState({
                    answer: value,
                }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
                break;
            default:
                break;
        }
    }

    render(){
        switch(this.props.askFor){
            case 'singleline':
                return(
                    <div className='FormQuestionValueRoot'>
                        <input
                            name='text'
                            className='FormText'
                            type='text'
                            placeholder='Votre réponse...'
                            value={this.state.answer}
                            onChange={this.onChange}
                        />
                    </div>
                );
            case 'paragraphe':
                return(
                    <div className='FormQuestionValueRoot'>
                        <textarea
                            name='text'
                            className='FormText'
                            rows='6'
                            placeholder='Votre réponse...'
                            value={this.state.answer}
                            onChange={this.onChange}
                        />
                    </div>
                );
            case 'number':
                return(
                    <div className='FormQuestionValueRoot'>
                        <input
                            name='number'
                            className='FormNumber'
                            type='text'
                            value={this.state.answer}
                            onChange={this.onChange}
                        />
                    </div>
                );
            default:
                break;
        }
    }
}

export default FormQuestionValue;