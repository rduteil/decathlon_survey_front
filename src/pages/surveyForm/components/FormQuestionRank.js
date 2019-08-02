import React, { Component } from 'react';

import FormQuestionDropzone from '../components/FormQuestionDropzone';

import '../styles/FormQuestionRank.css';

class FormQuestionRank extends Component {
    constructor(props){
        super(props);
        let leftSide = [];
        for(let i = 0; i < this.props.numberOfValues; i++){
            leftSide.push({
                id: i + 1,
                label: this.props.values[i],
                image: this.props.values[i + 10],
            });
        }
        this.state = {
            leftSide: leftSide,
            rightSide: [],
            answer: [],
        };
    }

    sortElementsById = (elementA, elementB) => {
		return(elementA.id - elementB.id);
	};

    handleDropInZone = (element, fromLeft, toRight) => {
        if(fromLeft && toRight){
            let leftSide = this.state.leftSide.slice();
            for(let i = 0; i < leftSide.length; i++){
                if(leftSide[i].id === element.id){
                    leftSide.splice(i, 1);
                }
            }
            let rightSide = this.state.rightSide.slice();
            rightSide.push(element);

            let answer = this.state.answer.slice();
            answer.push(element.label);

            this.setState({
                leftSide: leftSide,
                rightSide: rightSide,
                answer: answer,
            }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
        }
        else if(!fromLeft && toRight){
            let rightSide = this.state.rightSide.slice();
            let answer = this.state.answer.slice();
            for(let i = 0; i < rightSide.length; i++){
                if(rightSide[i].id === element.id){
                    rightSide.splice(i, 1);
                    answer.splice(i, 1);
                }
            }
            rightSide.push(element);
            answer.push(element.label);
            this.setState({
                rightSide: rightSide,
                answer: answer,
            }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
        }
        else if(!fromLeft && !toRight){
            let rightSide = this.state.rightSide.slice();
            let answer = this.state.answer.slice();
            for(let i = 0; i < rightSide.length; i++){
                if(rightSide[i].id === element.id){
                    rightSide.splice(i, 1);
                    answer.splice(i, 1);
                }
            }
            let leftSide = this.state.leftSide.slice();
            leftSide.push(element);
            leftSide.sort(this.sortElementsById);
            this.setState({
                leftSide: leftSide,
                rightSide: rightSide,
                answer: answer,
            }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
        }
    };

    handleDropOnRow = (source, target, fromLeft) => {
        let leftSide = this.state.leftSide.slice();
        let rightSide = this.state.rightSide.slice();
        let answer = this.state.answer.slice();

        let newPosition = 0;

        for(let i = 0; i < rightSide.length; i++){
            if(rightSide[i].id === target.id){
                newPosition = i;
                rightSide.splice(i, 0, source);
                answer.splice(i, 0, source.label);
                break;
            }
        }

        if(fromLeft){
            for(let i = 0; i < leftSide.length; i++){
                if(leftSide[i].id === source.id){
                    leftSide.splice(i, 1);
                    break;
                }
            }
        }
        else {
            for(let i = 0; i < rightSide.length; i++){
                if(rightSide[i].id === source.id && i !== newPosition){
                    rightSide.splice(i, 1);
                    answer.splice(i, 1);
                    break;
                }
            }
        }

        this.setState({
            leftSide: leftSide,
            rightSide: rightSide,
            answer: answer,
        }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
    };

    render(){
        return(
            <div className={`FormQuestionRankRoot`}>
                <div className={`FormHint`}>
                    {`Classez les éléments de la colonne de gauche dans la colonne de droite :`} 
                </div>
                <div className={`FormQuestionRankLabel`}>
                    {this.props.topLabel}
                </div>
                <div className={`FormQuestionWrapper`}>
                        <FormQuestionDropzone
                            rows={this.state.leftSide}
                            handleDropInZone={this.handleDropInZone}
                            hideLabel={this.props.valuesAsImages}
                            leftSide={true}
                        />
                        <FormQuestionDropzone
                            rows={this.state.rightSide}
                            handleDropInZone={this.handleDropInZone}
                            handleDropOnRow={this.handleDropOnRow}
                            hideLabel={this.props.valuesAsImages}
                            leftSide={false}
                        />
                </div>
                <div className={`FormQuestionRankLabel`}>
                    {this.props.bottomLabel}
                </div>
            </div>
        );
    }
}

export default FormQuestionRank;