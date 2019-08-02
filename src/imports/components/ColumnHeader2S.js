import React, { Component } from 'react';
import '../styles/ColumnHeader2S.css';

class ColumnHeader2S extends Component {
    constructor(props){
		super(props);
		this.handleSort = this.handleSort.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.doNothing = this.doNothing.bind(this);
	}

	handleSort(){
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
	}

	handleSearch(e){
		this.props.onSearch(this.props.column, e.target.value);
	}

	doNothing(e){
		e.stopPropagation();
		return;
	}

    render(){
		let currentSort = this.props.currentSort.column === this.props.column ? this.props.currentSort.direction : false;
		let symbol = '';
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

        return(
			<div
				className={this.props.currentSort.column === this.props.column ? 'ColumnHeader2SRoot Clicked' : 'ColumnHeader2SRoot'}
				onClick={this.handleSort}
				style={{width: `${this.props.width}%`}}
			>
				<div className='ColumnHeader2SName'>
					{this.props.column}
				</div>
				<div className='ColumnHeader2SSearch'>
					<input
						className='ColumnHeader2SSearchField'
						type='text'
						name='currentSearch'
						placeholder={`Rechercher...`}
						onChange={this.handleSearch}
						onClick={this.doNothing}
					/>
				</div>
				<div className='ColumnHeader2SSymbol'>
					{symbol}
				</div>
			</div>
        );
    }
}

export default ColumnHeader2S;