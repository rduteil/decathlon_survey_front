import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

import { DraggableTypes } from '../../../imports/helpers/Constants';
import FolderIcon from '../../../imports/images/folder.png';
import '../../../imports/styles/TableRow.css';

const FolderDragRowSource = {
    beginDrag(props){
        return {
            isSurvey: false,
            id: props.folder.id,
            name: props.folder.name,
            parentId: props.folder.folder.id,
        };
    }
};
  
function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

class FolderDragRow extends Component {
    constructor(props){
        super(props);
        this.state = {
            placeholder: 'placeholder',
        };
    }

    static propTypes = {
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired,
    };

    onChange = (event) => {
        switch(event.target.value){
            case 'open':
                this.props.handleNavigation(this.props.folder.id, this.props.folder.name, true);
                break;
            case 'rename':
                this.props.toggleRenameFolder(this.props.folder.id);
                break;
            case 'remove':
                this.props.removeFolder(this.props.folder.id, this.props.folder.name);
                break;
            default:
                break;
        }
    };

    onKeyPressed = (event) => {
        if(event.key === 'Enter'){
            this.props.updateFolder(this.props.folder.id, this.props.folder.folder.id, event.target.value);
        }
    };

    render = () => {
        const {connectDragSource} = this.props;

        return connectDragSource(
            <div className={`TableRowRoot`} onClick={() => this.props.handleNavigation(this.props.folder.id, this.props.folder.name, true)}>
                <div className={`TableRowCell`} style={{width: `15%`}}>
                    <img className={`TableRowIcon`} src={FolderIcon} role={`presentation`}/>
                    {`Dossier`}
                </div>
                <div className='TableRowCell' style={{width: '30%'}}>
                    {this.props.toggleRenameId === this.props.folder.id ?
                        <input
                            className='TableRowInputName'
                            type='text' 
                            defaultValue={this.props.folder.name}
                            onClick={(event) => event.stopPropagation()}
                            onBlur={(event) => this.props.updateFolder(this.props.folder.id, this.props.folder.folder.id, event.target.value)}
                            onFocus={(event) =>  event.target.select()}
                            onKeyPress={(event) => this.onKeyPressed(event)}
                            autoFocus
                        />:
                        this.props.folder.name
                    }
                </div>
                <div className='TableRowCell' style={{width: '15%'}}/>
                <div className='TableRowCell' style={{width: '15%'}}>
                    {this.props.folder.lastUpdate}
                </div>
                <div className='TableRowCell' style={{width: '15%'}}/>
                <div className='TableRowActionCell' onClick={(event) => event.stopPropagation()} style={{width: '10%'}} title='Cliquez pour voir les actions'>
                    <select className='TableRowActionSelect' onChange={(event) => this.onChange(event)} value={this.state.placeholder}>
                        <option value='placeholder' disabled hidden> ≡ </option>
                        <option value='open'>Ouvrir</option>
                        <option value='rename'>Renommer</option>
                        <option value='remove'>Supprimer</option>
                    </select>
                </div>
            </div>
        );
    };

} export default DragSource(DraggableTypes.DRAGGABLE_ROW, FolderDragRowSource, collect)(FolderDragRow);