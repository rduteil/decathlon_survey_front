import React, { Component } from 'react';

import ServicesTableRow from '../components/ServicesTableRow';
import ColumnHeader2S from '../../../imports/components/ColumnHeader2S';
import ColumnHeaderS from '../../../imports/components/ColumnHeaderS';
import ColumnHeader from '../../../imports/components/ColumnHeader';

import { HOST_ADDRESS } from '../../../imports/helpers/Constants';

import BackIconDisabled from '../../../imports/images/back_disabled.png';
import AddIcon from '../../../imports/images/add.png';
import '../styles/ServicesTable.css';

class ServicesTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            sort: {
				column: `Dernière modification`,
				direction: `Asc`,
			},
			search: {
				column: `Nom`,
				section: ``,
            },
            plusHovered: false,
            spaceComputated: false,
            remainingSpace: `Calcul de l'espace disque restant...`
        };
    }

    handleSort = (column, direction) => {
		this.setState({
			sort: {
				column: column,
				direction: direction,
			}
		});
	};

	handleSearch = (column, section) => {
		this.setState({
			search: {
				column: column,
				section: section,
			},
		});
    };

    sortServicesByColumn = (serviceA, serviceB) => {
		let isDesc = this.state.sort.direction === `Desc` ? 1 : -1;
		let [a, b] = [serviceA.name.toLowerCase(), serviceB.name.toLowerCase()];
		switch(this.state.sort.column){
			case `Nom`:
				break;
            case `Nombre d'utilisateurs`:
                [a, b] = [serviceA.users.length, serviceB.users.length]
                break;
			case `Dernière modification`:
				let format = /(\d{2})\-(\d{2})\-(\d{4})/;
				[a, b] = [new Date(serviceA.lastUpdate.replace(format,'$3-$2-$1')), new Date(serviceB.lastUpdate.replace(format,'$3-$2-$1'))];
                break;
			default:
				break;
		}
        
		if (a > b) {
			return 1 * isDesc;
		}
		if (a < b) {
			return -1 * isDesc;
		}
		return 0;
    };

    renderPath = () => {
        let pathPane = (
            <div className={`TablePathPane`}>
                <div className={`TablePathPaneBugFixer`}>
                    <img
                        className={`TablePathHoverableIcon`}
                        src={AddIcon}
                        role={`presentation`}
                    />
                </div>
                <div className={`TablePathPaneButton`} onClick={() => this.props.handleAdd(true)}>
                    {this.state.plusHovered ? `` : `Ajouter un service`}
                </div>
            </div>
        );

        return(
            <div className={`TablePath`}>
                <div className={`TablePathElementDisabled`}>
                    <img
                        className={`TablePathIcon`}
                        src={BackIconDisabled}
                        role={`presentation`}
                    />
                </div>
                {pathPane}
                <div className={`TablePathElementDisabled`}>
                    {`Liste des services`}
                </div>
            </div>
        );
    };

    renderHeader = () => {
        return(
            <div className={`TableHeader`}>
                <ColumnHeader2S
                    column={`Nom`}
                    currentSort={this.state.sort}
                    currentSearch={this.state.search}
                    onSort={this.handleSort}
                    onSearch={this.handleSearch}
                    width={40}
                />
                <ColumnHeaderS
                    column={`Nombre d'utilisateurs`}
                    currentSort={this.state.sort}
                    onSort={this.handleSort}
                    width={20}
                />
                <ColumnHeaderS
                    column={`Dernière modification`}
                    currentSort={this.state.sort}
                    onSort={this.handleSort}
                    width={30}
                />
                <ColumnHeader
                    column={`Actions`}
                    width={10}
                    borderRight={`none`}
                />
            </div>
        );
    };

    renderFooter = () => {
        if(!this.state.computatedSpace){
            fetch(`http://${HOST_ADDRESS.IP}/space`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                }
            }).then((response) => {
                response.text().then((response) => {
                    this.setState({
                        computatedSpace: true,
                        remainingSpace: response,
                    });
                }, (error) => {
                    this.setState({
                        computatedSpace: true,
                        remainingSpace: `Calcul de l'espace disque restant impossible`,
                    });
                });
            }, (error) => {
                this.setState({
                    computatedSpace: true,
                    remainingSpace: `Calcul de l'espace disque restant impossible`,
                });
            });
        }

        return(
            <div className={`TableFooter`}>
                <div className={`TableFooterText`}>
                    {`${this.props.services.length} service(s)`}
                </div>
                <div className={`TableFooterText`}>
                    {this.state.remainingSpace}
                </div>
            </div>
        );
    };

    render = () => {
        let rows = [];

        let servicesAsArray = Object.keys(this.props.services).map((pid) => this.props.services[pid]);
        servicesAsArray.sort(this.sortServicesByColumn);

        for(let i = 0; i < servicesAsArray.length; i++){
            if(servicesAsArray[i].name.indexOf(this.state.search.section) !== -1){
                    rows.push(<ServicesTableRow
                        key={i}
                        service={servicesAsArray[i]}
                        handleNavigation={this.props.handleNavigation}
                        handleRemove={this.props.handleRemove}
                        handleRename={this.props.handleRename}
                        toggleRename={this.props.toggleRename}
                        handleToggleRename={this.props.handleToggleRename}
                    />);
            }
        }

        return(
            <div className={`TableRoot`}>
                <div className={`HomeTableFixedTop`}>
                    {this.renderPath()}
                    {this.renderHeader()}
                </div>
				<div className={`TableBody`}>
					{rows}
				</div>
				<div className={`TableFixedBottom`}>
                    {this.renderFooter()}
				</div>
            </div>
        );
    };
} export default ServicesTable;