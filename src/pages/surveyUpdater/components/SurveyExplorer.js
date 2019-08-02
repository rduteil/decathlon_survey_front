import React, { Component } from 'react';

import SurveyExplorerDropzone from '../components/SurveyExplorerDropzone';

import '../styles/SurveyExplorer.css'

class SurveyExplorer extends Component {
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

    resize = (down, up, event) => {
        if(down){
            this.setState({
                resizing: true,
                previousX: event.clientX,
            });
        }
        else if(up){
            this.setState({
                resizing: false,
                previousX: 0,
            });
        }
        else {
            if(this.state.resizing){
                let previousX = event.clientX;
                let dx = this.state.previousX === 0 ? 0: event.clientX - this.state.previousX;
                this.setState((previousState) => {
                    if((previousState.dx + dx) < 0) dx = 0;
                    else if((screen.window / 4) < dx) dx = screen.window / 4;
                    return({
                        previousX: previousX,
                        dx: (previousState.dx + dx) < 0 ? 0: previousState.dx + dx,
                    })
                }, () => this.props.resize(this.state.dx));
            }
        }
    };

    displayRows = () => {
        let displayRows = [];
        for(let i = 0; i < this.state.rows.length; i++){
            displayRows.push(
                <SurveyExplorerDropzone
                    key={`${i}.${this.props.showHangout}`}
                    row={this.state.rows[i]}
                    sectionIndex={0}
                    addSection={this.props.addSection}
                    removeSection={this.props.removeSection}
                    addLibraryQuestion={this.props.addLibraryQuestion}
                    addFreshQuestion={this.props.addFreshQuestion}
                    removeQuestion={this.props.removeQuestion}
                    addQuestionToLibrary={this.props.addQuestionToLibrary}
                    dropSurveyExplorerRow={this.props.dropSurveyExplorerRow}
                    scrollToRow={this.props.scrollToRow}
                />
            );
            if(this.state.rows[i].isSection){
                for(let j = 0; j < this.state.rows[i].questions.length; j++){
                    displayRows.push(
                        <SurveyExplorerDropzone
                            key={`${i}.${j}.${this.props.showHangout}`}
                            row={Object.assign(this.state.rows[i].questions[j], {isSection: false,})}
                            sectionIndex={this.state.rows[i].index}
                            addSection={this.props.addSection}
                            removeSection={this.props.removeSection}
                            addLibraryQuestion={this.props.addLibraryQuestion}
                            addFreshQuestion={this.props.addFreshQuestion}
                            removeQuestion={this.props.removeQuestion}
                            addQuestionToLibrary={this.props.addQuestionToLibrary}
                            dropSurveyExplorerRow={this.props.dropSurveyExplorerRow}
                            scrollToRow={this.props.scrollToRow}
                        />
                    );
                }
            }
        }
        return displayRows;
    };

    render = () => {
        let leftButtonStyle = this.props.showHangout ?
            {}:
            {backgroundColor: '#ffffff', color: '#191919', cursor: 'default'};

        let rightButtonStyle = this.props.showHangout ?
            {backgroundColor: '#ffffff', color: '#191919', cursor: 'default'}:
            {};

        let toggleDiv = this.props.hangout ? 
            <div className='SurveyExplorerToggleHangoutDiv'>
                <button
                    className='SurveyExplorerToggleHangoutButton'
                    onClick={this.props.handleToggleHangout}
                    value={false}
                    style={leftButtonStyle}
                >
                    {`Questionnaire encadré`}
                </button>
                <button
                    className='SurveyExplorerToggleHangoutButton'
                    onClick={this.props.handleToggleHangout}
                    value={true}
                    style={rightButtonStyle}
                >
                    {`Questionnaire de sortie`}
                </button>
            </div>:
            <div className={`SurveyExplorerToggleHangoutDiv`}>
            </div>;

        return(
            <div
                className={`SurveyExplorerRoot`}
                style={{width: `calc(25% + ${this.state.dx}px`, cursor: this.state.resizing? `col-resize`: null}}
                onMouseLeave={(event) => this.resize(false, true, event)}
                onMouseUp={(event) => this.resize(false, true, event)}
                onMouseMove={(event) => this.resize(false, false, event)}
            >
                <div className={`SurveyExplorerWrapper`}>
                    <div className='SurveyExplorerTitle'>
                        {`ORGANISER`}
                    </div>
                    <div className='SurveyExplorerNewRowDiv'>
                        <button
                            className={`SurveyExplorerNewSection`}
                            onClick={() => this.props.addSection()}
                        >
                            {`NOUVELLE SECTION`}
                        </button>
                        <button
                            className={`SurveyExplorerNewQuestion`}
                            onClick={() => this.props.addFreshQuestion(0)}
                        >
                            {`NOUVELLE QUESTION`}
                        </button>
                        <button
                            className={`SurveyExplorerNewQuestion`}
                            onClick={() => this.props.addLibraryQuestion(0)}
                        >
                            {`BIBLIOTHEQUE`}
                        </button>    
                    </div>
                    <div className={`SurveyExplorerTable`}>
                        {toggleDiv}
                        <div className={`SurveyExplorerHeader`}>
                            <div className={`SurveyExplorerCell`} style={{width: '15%'}}>
                                {`Index`}
                            </div>
                            <div className={`SurveyExplorerCell`} style={{width: '25%'}}>
                                {`Type`}
                            </div>
                            <div className={`SurveyExplorerCell`} style={{width: '40%'}}>
                                {`Nom`}
                            </div>
                            <div className={`SurveyExplorerCell`} style={{width: '20%'}}>
                                {`Action`}
                            </div>
                        </div>
                        <div className={`SurveyExplorerRows`}>
                            {this.displayRows()}
                        </div>
                    </div>
                </div>
                <div
                    className={`SurveyExplorerResizer`}
                    onMouseDown={(event) => this.resize(true, false, event)}
                />
            </div>
        );
    };
} export default SurveyExplorer;