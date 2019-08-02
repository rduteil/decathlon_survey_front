import React, { Component } from 'react';
import '../styles/ColumnHeaderS.css';

class ColumnHeaderS extends Component {
    constructor(props){
		super(props);
		this.handleSort = this.handleSort.bind(this);
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
                className={this.props.currentSort.column === this.props.column ? 'ColumnHeaderSRoot Clicked' : 'ColumnHeaderSRoot' }
				onClick={this.handleSort}
				style={{width: `${this.props.width}%`}}
            >
				<div className='ColumnHeaderSName'>
					{this.props.column}
				</div>
				<div className='ColumnHeaderSSymbol'>
					{symbol}
				</div>
			</div>
        );
    }
}

export default ColumnHeaderS;