import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { DragSource } from 'react-dnd';

import { DraggableTypes } from '../../../imports/helpers/Constants';
import SurveyIcon from '../../../imports/images/survey.png';
import HangoutIcon from '../../../imports/images/hangout.png';
import '../../../imports/styles/TableRow.css';

const SurveyDragRowSource = {
    beginDrag(props){
        return {
            isSurvey: true,
            id: props.survey.id,
            name: props.survey.name,
            parentId: props.survey.folder.id,
        };
    }
};
  
function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

class SurveyDragRow extends Component {
    constructor(props){
        super(props);
        this.state = {
            placeholder: `placeholder`,
        };
    }

    static propTypes = {
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired,
    };

    onChange = (event) => {
        switch(event.target.value){
            case `open`:
                this.props.history.push(`/forms/${this.props.survey.link}`);
                break;
            case `update`:
                this.props.history.push(`/surveys/${this.props.survey.id}`);
                break;
            case `remove`:
                this.props.removeSurvey(this.props.survey.id, this.props.survey.name);
                break;
            case `duplicate`:
                this.props.duplicateSurvey(this.props.survey.id);
                break;
            case `share`:
                this.props.shareSurvey(this.props.survey.id);
                break;
            case `download`:
                this.props.history.push(`/answers/${this.props.survey.id}`);
                break;
            default:
                break;
        }
        this.setState({
            placeholder: `placeholder`,
        });
    };

    render = () => {
        const {connectDragSource} = this.props;

        let downloadHint = '';
        if(this.props.survey.hangout){
            let hangoutAnswers = 0;
            let noHangoutAnswers = 0;
            for(let i = 0; i < this.props.survey.surveyAnswers.length; i++){
                if(this.props.survey.surveyAnswers[i].hangout) hangoutAnswers++;
                else noHangoutAnswers++;
            }
            downloadHint = `${noHangoutAnswers} réponse(s), ${hangoutAnswers} sortie(s)`;

        }
        else {
            downloadHint = `${this.props.survey.surveyAnswers.length} réponse(s)`;
        }

        return connectDragSource(
            <div 
                className={`TableRowRoot`}
                onClick={() => this.props.history.push(`/surveys/${this.props.survey.id}`)}
                title={`Cliquez pour modifier le questionnaire`}
            >
                {this.props.survey.hangout ?
                    <div className={`TableRowCell`} style={{width: `15%`}}>
                        <img className={`TableRowIcon`} src={HangoutIcon} role={`presentation`}/>
                        {`Questionnaire longue durée`}
                    </div>:
                    <div className={`TableRowCell`} style={{width: `15%`}}>
                        <img className={`TableRowIcon`} src={SurveyIcon} role={`presentation`}/>
                        {`Questionnaire encadré`}
                    </div>
                }
                <div className={`TableRowCell`} style={{width: `30%`}}>
                    {this.props.survey.name}
                </div>
                <div className={`TableRowCell`} style={{width: `15%`}}>
                    {this.props.survey.reference}
                </div>
                <div className={`TableRowCell`} style={{width: `15%`}}>
                    {this.props.survey.lastUpdate}
                </div>
                <div className={`TableRowCell`} style={{width: `15%`}}>
                        {downloadHint}
                </div>
                <div
                    className={`TableRowActionCell`}
                    onClick={(event) => event.stopPropagation()}
                    style={{width: `10%`}}
                    title={`Cliquez pour voir les actions`}
                >
                    <select
                        className={`TableRowActionSelect`}
                        onChange={(event) => this.onChange(event)}
                        value={this.state.placeholder}
                    >
                        <option value={`placeholder`} disabled hidden>
                            {`≡`}
                        </option>
                        <option value={`update`}>
                            {`Modifier`}
                        </option>
                        <option value={`open`}>
                            {`Aperçu`}
                        </option>
                        <option value={`remove`}>
                            {`Supprimer`}
                        </option>
                        <option value={`duplicate`}>
                            {`Dupliquer`}
                        </option>
                        <option value={`share`}>
                            {`Partager`}
                        </option>
                        <option value={`download`}>
                            {`Télécharger les réponses`}
                        </option>
                    </select>
                </div>
            </div>
        );
    };
} export default DragSource(DraggableTypes.DRAGGABLE_ROW, SurveyDragRowSource, collect)(withRouter(SurveyDragRow));