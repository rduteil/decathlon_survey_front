import React, { Component } from 'react';
import '../styles/ColumnHeaderSF.css';

class ColumnHeaderSF extends Component {
	
	handleSort = () => {
		let currentSort = this.props.currentSort.column === this.props.column ? this.props.currentSort.direction : false;
		switch(currentSort){
			case false:
				currentSort = 'Desc';
				break;
			case 'Asc':
				currentSort = 'Desc';
				break;
			case 'Desc':
				currentSort = 'Asc';
				break;
			default:
				currentSort = 'Desc';
				break;
		}
		this.props.onSort(this.props.column, currentSort);
    };
    
    handleFilter = (event) => {
		this.props.onFilter(this.props.column, Number(event.target.value));
    };

	doNothing = (event) => {
		event.stopPropagation();
		return;
	};

    render = () => {
		let currentSort = this.props.currentSort.column === this.props.column ? this.props.currentSort.direction : false;
		let symbol = '  ';
		switch(currentSort){
			case false:
				break;
			case 'Asc':
				symbol = '▼';
				break;
			case 'Desc':
				symbol = '▲';
				break;
			default:
				break;
		}

		let options = [];
		for(let i = 0; i < this.props.options.length; i++){
			options.push(
				<option key={i} value={i}>
					{this.props.options[i]}
				</option>
			);
		}

		let select = (
			<select 
				className='ColumnHeaderSFSelectField'
				value={this.props.currentFilter.condition}
				onChange={this.handleFilter}
				onClick={this.doNothing}
			>
				{options}
			</select>
		);

        return(
            <div  
                className={this.props.currentSort.column === this.props.column ? 'ColumnHeaderSFRoot Clicked' : 'ColumnHeaderSFRoot'}
				onClick={this.handleSort}
				style={{width: `${this.props.width}%`}}
            >
				<div className='ColumnHeaderSFName'>
					{this.props.column}
				</div>
				<div className='ColumnHeaderSFSelect'>
					{select}
				</div>
				<div className='ColumnHeaderSFSymbol'>
					{symbol}
				</div>
			</div>
        );
    };
} export default ColumnHeaderSF;