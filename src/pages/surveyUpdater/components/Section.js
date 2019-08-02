import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';

import ImagePlaceholder from '../../../imports/images/image.png';

import '../styles/Section.css';

class Section extends Component {
    constructor(props){
        super(props);
        this.state = {
            index: this.props.section.index,
            name: this.props.section.name,
            image: this.props.section.image,
            description: this.props.section.description,

            formerIndex: this.props.section.index,
        };
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            index: newProps.section.index,
            name: newProps.section.name,
            image: newProps.section.image,
            description: newProps.section.description,

            formerIndex: newProps.section.index,
        });
        if(
            newProps.section.name !== this.props.section.name ||
            newProps.section.index !== this.props.section.index ||
            newProps.showHangout !== this.props.showHangout
        ){
            newProps.storeScrollingMethod(
                true,
                newProps.section.index,
                0,
                newProps.section.hangout,
                this.scrollToSection
            );
        }
    };

    componentDidMount = () => {
        this.props.storeScrollingMethod(
            true,
            this.props.section.index,
            0,
            this.props.section.hangout,
            this.scrollToSection
        );
    };

    scrollToSection = () => {
        let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        window.scrollTo(0, rect.top + window.scrollY - 90); 
    };

    onChange = (event) => {
        switch(event.target.name){
            case `index`:
                this.setState({
                    index: +event.target.value,
                });
                break;
            case `name`:
                this.setState({
                    name: event.target.value,
                });
                break;
            case `description`:
                this.setState({
                    description: event.target.value,
                });
                break;
            case `image`:
                event.stopPropagation();
                this.setState({
                    image: '',
                }, 
                () => this.props.updateSection(
                    this.props.section.index,
                    `image`,
                    this.state.image
                ));
                break;
            default:
                break;
        }
    };

    onInput = (event) =>  {
        this.props.updateSection(
            this.props.section.index,
            `index`,
            event.target.value
        );        
    };

    onDrop = (acceptedFiles, rejectedFiles) => {
        if(acceptedFiles.length < 1) return;
        let self = this;
        let reader = new FileReader();
        let image = this.state.image;
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onloadend = function() {
            image = reader.result;
            self.setState({
                image: image,
            }, () => self.props.updateSection(
                self.props.section.index,
                `image`,
                self.state.image
            ));
        }        
    };

    onBlur = (event) => {
        switch(event.target.name){
            case `index`:
                this.props.updateSection(
                    this.props.section.index,
                    `index`,
                    this.state.index
                );
                break;
            case `name`:
                this.props.updateSection(
                    this.props.section.index,
                    `name`,
                    this.state.name
                );
                break;
            case `description`:
                this.props.updateSection(
                    this.props.section.index,
                    `description`,
                    this.state.description
                );
                break;
            default:
                break;
        }
    };

    render = () => {
        return(
            <div className={`SectionRoot`}>
                <div className={`SectionRow`}>
                    <div className={`SectionLeftBlock`}>
                        {`Section`}
                        <input
                            className={`InputNumber`}
                            type={`number`}
                            name={`index`}
                            value={this.state.index}
                            onChange={(event) => this.onChange(event)}
                            onBlur={(event) => this.onBlur(event)}
                            onInput={(event) => this.onInput(event)}
                        />
                        {`:`}
                    </div>
                    <div className={`SectionRightBlock`}>
                        <button 
                            className={`SectionRemoveButton`}
                            onClick={() => this.props.removeSection(this.props.section.index, this.props.section.name)}
                            title={`Cliquez pour supprimer la section`}
                        >
                            {`Supprimer la section`}
                        </button>
                    </div>
                </div>
                {`Nom de la section :`}
                <input 
                    className={`SectionName`} 
                    type={`text`}
                    placeholder={`Entrez le nom de la section...`}
                    name={`name`}
                    value={this.state.name}
                    onChange={(event) => this.onChange(event)}
                    onBlur={(event) => this.onBlur(event)}
                />
                {`Description de la section :`}
                <textarea
                    className={`SectionDescription`}
                    rows={3} 
                    placeholder={`Entrez des informations complémentaires (facultatif)...`}
                    name={`description`} 
                    value={this.state.description}
                    onChange={(event) => this.onChange(event)}
                    onBlur={(event) => this.onBlur(event)}
                />
                <div className={`SectionImageWrapper`}>
                    <Dropzone
                        className={`SectionImage`}
                        accept={`image/*`}
                        name={`image`}
                        onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
                        multiple={false}
                        title={`Cliquez pour importer ou déposez directement une image pour l'afficher`}
                    >
                        {this.state.image === `` ?
                            null:
                            <button 
                                className={`SectionImageRemover`} 
                                name={`image`}
                                title={`Cliquez pour supprimer l'image`}
                                onClick={(event) => this.onChange(event)}
                            >
                                {`x`}
                            </button>
                        }
                        {this.state.image === `` ? 
                            <img
                                className={`SectionImagePlaceholder`}
                                src={ImagePlaceholder}
                                role={`presentation`}
                            />:
                            <img
                                className={`SectionImageDisplayer`} 
                                src={this.state.image}
                                role={`presentation`}
                            />
                        }
                    </Dropzone>
                </div>
                {React.Children.map(this.props.children, (child) => {return child;})}
                <div className={`SectionNewRowDiv`}>
                    <button
                        className={`SectionNewRow NewQuestion`}
                        onClick={() => this.props.addFreshQuestion(this.props.section.index)}
                    >
                        {`NOUVELLE QUESTION`}
                    </button>
                    <button
                        className={`SectionNewRow NewQuestion`}
                        onClick={() => this.props.addLibraryQuestion(this.props.section.index)}
                    >
                        {`BIBLIOTHEQUE`}
                    </button>
                </div>
            </div>
        );
    };
} export default Section;