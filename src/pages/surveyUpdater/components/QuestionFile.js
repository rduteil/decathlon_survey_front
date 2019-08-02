import React, { Component } from 'react';

class QuestionFile extends Component {
    constructor(props){
        super(props);
        this.state = {
            fileTypes: this.props.fileTypes,
            commentary: this.props.commentary,
        }
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            fileTypes: newProps.fileTypes,
            commentary: newProps.commentary,
        });
    };

    onChange = (event) => {
        switch(event.target.name){
            case `fileTypes`:
                let fileTypes = this.state.fileTypes.slice();
                fileTypes[event.target.id] = !fileTypes[event.target.id];
                this.setState({
                    fileTypes: fileTypes,
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `fileTypes`,
                    this.state.fileTypes
                ));
                break;
            case `commentary`:
                this.setState((previousState) => {
                    return({
                        commentary: !previousState.commentary,
                    });
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `commentary`,
                    this.state.commentary
                ));
                break;
            default:
                break;
        }
    };

    render = () => {
        return(
            <div className={`QuestionFileRoot`}>
                <div className={`InputCheckboxDiv`}>
                    {`Autoriser les fichiers de type :`}
                    <input 
                        name={`fileTypes`} 
                        id={0}
                        type={`checkbox`}
                        checked={this.state.fileTypes === undefined ? false : this.state.fileTypes[0]}
                        onChange={(event) => this.onChange(event)}
                    />
                    {`Image`}
                    <input
                        name={`fileTypes`} 
                        id={1}
                        type={`checkbox`}
                        checked={this.state.fileTypes === undefined ? false : this.state.fileTypes[1]}
                        onChange={(event) => this.onChange(event)}
                    />
                    {`Vidéo`}
                </div>
                <div className={`InputCheckboxdiv`}>
                    <input
                            name={`commentary`}
                            type={`checkbox`}
                            checked={this.state.commentary}
                            onChange={(event) => this.onChange(event)}
                        />
                        {`Demander un commentaire avec le fichier`}
                </div>
            </div>
        );
    };
} export default QuestionFile;