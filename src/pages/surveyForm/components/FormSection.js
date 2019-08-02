import React, { Component } from 'react';

import '../styles/FormSection.css';

class FormSection extends Component {
    render = () => {
        return(
            <div className={`FormSectionRoot`}>
                <div className={`FormSectionHeader`}>
                    <div className={`FormSectionName`}>
                        {this.props.section.name}
                    </div>
                    <div className={`FormSectionDescription`}>
                        {this.props.section.description}
                    </div>
                    {this.props.section.image === `` ?
                        null:
                        <div className={`FormSectionImageWrapper`}>
                            <img className={`FormSectionImage`} src={this.props.section.image} role={`presentation`}/>
                        </div>
                    }
                </div>
                {React.Children.map(this.props.children, (child) => {return child;})}
            </div>
        );
    };
} export default FormSection;