import React, { Component } from 'react';

import UsersTableRow from '../components/UsersTableRow';
import ColumnHeaderSF from '../../../imports/components/ColumnHeaderSF';
import ColumnHeader2S from '../../../imports/components/ColumnHeader2S';
import ColumnHeaderS from '../../../imports/components/ColumnHeaderS';
import ColumnHeader from '../../../imports/components/ColumnHeader';

import { HOST_ADDRESS } from '../../../imports/helpers/Constants';

import BackIcon from '../../../imports/images/back.png';
import AddIcon from '../../../imports/images/add.png';
import '../styles/ServicesTable.css';

class UsersTable extends Component {
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
			filter: {
				column: `Type`,
				condition: 0,
            },
            isPlusHovered: false,
            computatedSpace: false,
            remainingSpace: `Calcul de l'espace disque restant...`,
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

    handleFilter = (column, condition) => {
        this.setState({
            filter: {
                column: column,
                condition: condition,
            }
        });
    };

    sortUsersByColumn = (userA, userB) => {
        let isDesc = this.state.sort.direction === `Desc` ? 1 : -1;
        let [a, b] = [userA.username.toLowerCase(), userB.username.toLowerCase()];
        switch(this.state.sort.column){
            case `Nom`:
                break;
            case `Email`:
                [a, b] = [userA.email, userB.email]
                break;
            case `Dernière modification`:
                let format = /(\d{2})\-(\d{2})\-(\d{4})/;
                [a, b] = [new Date(userA.lastUpdate.replace(format,'$3-$2-$1')), new Date(userB.lastUpdate.replace(format,'$3-$2-$1'))];
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

    filterUsers = (users) => {
        let filteredUsers = [];
        let shouldBePushed = true;
        for(let i = 0; i < users.length; i++){
            shouldBePushed = true;
            /** Recherche par Nom ou par Email */
            if(this.state.search.column === `Nom` && users[i].username.indexOf(this.state.search.section) === -1) shouldBePushed = false;
            else if(this.state.search.column === `Email` && users[i].email.indexOf(this.state.search.section) === -1) shouldBePushed = false;
            /** Filtre par rôle */
            if(this.state.filter.condition === 1 && users[i].roles.indexOf(`ROLE_ADMIN`) === -1) shouldBePushed = false;
            else if(this.state.filter.condition === 2 && users[i].roles.indexOf(`ROLE_USER`) === -1) shouldBePushed = false;

            if(shouldBePushed) filteredUsers.push(users[i]);
        }
        return filteredUsers;
    };

    toggleHovering = (isHovered) => {
        this.setState({
            isPlusHovered: isHovered,
        });
    };

    renderPath = () => {
        let pathPane = (
            <div
                className={`TablePathPane`}
                onMouseOver={() => this.toggleHovering(true)}
                onMouseLeave={() => this.toggleHovering(false)}
            >
                <img
                    className={`TablePathHoverableIcon`}
                    src={AddIcon}
                    role={`presentation`}
                />
                <div className={`TablePathPaneButton`} onClick={() => this.props.handleAdd(false)}>
                    {`Ajouter un utilisateur`}
                </div>
            </div>
        );

        return(
            <div className={`TablePath`}>
                <div className={`TablePathElement`}>
                    <img
                        className={`TablePathIcon`}
                        src={BackIcon}
                        role={`presentation`}
                        onClick={() => this.props.handleNavigation(-1)}
                    />
                </div>
                {pathPane}
                <div className={`TablePathElementDisabled`}>
                    {`Liste des utilisateurs du service ${this.props.service.name}`}
                </div>
            </div>
        );
    };

    renderHeader = () => {
        return(
            <div className={`TableHeader`}>
                <ColumnHeaderSF
                    column={`Type`}
                    currentSort={this.state.sort}
                    currentFilter={this.state.filter}
                    options={['Tous', 'Administrateurs', 'Utilisateurs']}
                    onSort={this.handleSort}
                    onFilter={this.handleFilter}
                    width={15}
                />
                <ColumnHeader2S
                    column={`Nom`}
                    currentSort={this.state.sort}
                    currentSearch={this.state.search}
                    onSort={this.handleSort}
                    onSearch={this.handleSearch}
                    width={25}
                />
                <ColumnHeader2S
                    column={`Email`}
                    currentSort={this.state.sort}
                    currentSearch={this.state.search}
                    onSort={this.handleSort}
                    onSearch={this.handleSearch}
                    width={30}
                />
                <ColumnHeaderS
                    column={`Dernière modification`}
                    currentSort={this.state.sort}
                    onSort={this.handleSort}
                    width={20}
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
                    {`${this.props.service.users.length} utilisateur(s)`}
                </div>
                <div className={`TableFooterText`}>
                    {this.state.remainingSpace}
                </div>
            </div>
        );
    };

    render = () => {
        let rows = [];
        let usersAsArray = Object.keys(this.props.service.users).map((pid) => this.props.service.users[pid]);
        usersAsArray.sort(this.sortUsersByColumn); 
        usersAsArray = this.filterUsers(usersAsArray);

        for(let i = 0; i < usersAsArray.length; i++){
            rows.push(
                <UsersTableRow
                    key={i}
                    user={usersAsArray[i]}
                    handleRemove={this.props.handleRemove}
                />
            );
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
} export default UsersTable;