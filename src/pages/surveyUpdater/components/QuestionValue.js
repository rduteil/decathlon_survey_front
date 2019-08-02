import React, { Component } from 'react';

class QuestionValue extends Component{
    constructor(props){
        super(props);
        this.state = {
            askFor: this.props.askFor,
        };
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            askFor: newProps.askFor,
        });
    };

    render = () => {
        return(
            <div className={`QuestionValueRoot`}>
                {`Type de réponse :`}
                <select 
                    className={`InputSelect`}
                    name={`askFor`}
                    value={this.state.askFor}
                    onChange={(event) => this.props.updateQuestion(
                        this.props.index,
                        this.props.sectionIndex,
                        `askFor`,
                        event.target.value
                    )}
                >
                    <option value={`singleline`}>
                        {`Réponse courte`}
                    </option>
                    <option value={`paragraphe`}>
                        {`Paragraphe`}
                    </option>
                    <option value={`number`}>
                        {`Nombre`}
                    </option>
                </select>
            </div>
        );
    };
} export default QuestionValue;