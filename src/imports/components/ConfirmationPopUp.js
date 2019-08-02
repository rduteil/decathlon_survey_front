import React, { Component } from 'react';
import '../styles/PopUp.css'

class ConfirmationPopUp extends Component{
    render = () => {
        return(
            <div className={`PopUpBackground`}>
                <div className={`PopUpRoot`}>
                    <div className={`PopUpBody`}>
                        <div className={`PopUpMessageDiv`}>
                            {this.props.message}
                        </div>
                        <div className={`PopUpButtonsDiv`}>
                            <button className={`PopUpButton`} onClick={() => this.props.handleConfirm()}>
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
} export default ConfirmationPopUp;