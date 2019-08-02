import React, { Component } from 'react';

import '../../../imports/styles/PopUp.css';

class SharePopUp extends Component {
    constructor(props){
        super(props);
        this.state = {
            shareTo: [],
        };
    }

    onChange = (event) => {
        let shareTo = this.state.shareTo.slice();
        if(shareTo.indexOf(event.target.id) === -1){
            shareTo.push(event.target.id)
        }
        else {
            shareTo.splice(shareTo.indexOf(event.target.id), 1);
        }

        this.setState({
            shareTo: shareTo,
        });
    };

    render = () => {
        let services = [];
        for(let i = 0; i < this.props.services.length; i++){
            services.push(
                <div className={`SharePopUpRow`} key={i}>
                    <input
                        id={this.props.services[i].id}
                        type={`checkbox`}
                        onChange={(event) => this.onChange(event)}
                    />
                    {this.props.services[i].name}
                </div>
            );
        }
        return(
            <div className={`PopUpBackground`}>
                <div className={`PopUpRoot`}>
                    <div className={`PopUpBody`}>
                        <div className={`PopUpMessageDiv`}>
                            {`Avec quels services souhaitez vous partager le questionnaire ?`}
                            <div className={`PopUpChoice`}>
                                {services}
                            </div>
                        </div>
                        <div className={`PopUpButtonsDiv`}>
                            <button className={`PopUpButton`} onClick={() => this.props.handleConfirm(this.state.shareTo)}>
                                {this.props.confirmText}
                            </button>
                            <button className={`PopUpButton`} onClick={() => this.props.handleCancel()}>
                                {this.props.cancelText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
} export default SharePopUp;