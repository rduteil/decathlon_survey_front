import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

/** QUERIES POUR USERS */
export const FindUsers = graphql(
	gql`query FindUsers {
		users {
			id
			username
			email
			roles
			service {
				id
				name
			}
		}
	}`,
	{
		name: 'FindUsers'
	}
);

export const FindUser = gql`query FindUser($id: ID!){
	user(id: $id){
		id
		username
		email
		roles
		service {
			id
			name
		}
	}
}`;

/** MUTATIONS POUR USERS */
export const AddUser = graphql(
	gql`mutation AddUser($input: UserInput!){
			addUser(input: $input){
				id
				username
				email
				roles
				service {
					id
					name
				}
			}
	}`,
	{
		name: 'AddUser'
	}
);

export const RemoveUser = graphql(
	gql`mutation RemoveUser($id: ID!){
			removeUser(id: $id)
	}`,
	{
		name: 'RemoveUser'
	}
);

export const UpdateUser = graphql(
	gql`mutation UpdateUser($id: ID!, $input: UserInput!){
			updateUser(id: $id, input: $input){
				id
				username
				email
				roles
				service {
					id
					name
				}
			}
	}`,
	{
		name: 'UpdateUser'
	}
);

/** QUERIES POUR SERVICES */
export const FindServices = graphql(
	gql`query FindServices {
		services {
			id
			name
			lastUpdate
			users {
				id
				username
				email
				roles
				lastUpdate
			}
		}
	}`,
	{
		name: 'FindServices'
	}
);

export const FindServicesUnnamed = gql`query FindServices {
	services {
		id
		name
		lastUpdate
		users {
			id
			username
			email
			roles
			lastUpdate
		}
	}
}`;

export const FindService = graphql(
	gql`query FindService($id: ID!){
		service(id: $id){
			id
			name
			users {
				id
				username
				email
				roles
			}
		}
	}`,
	{
		name: 'FindService'
	}
);

/** MUTATIONS POUR SERVICES */
export const AddService = graphql(
	gql`mutation AddService($input: ServiceInput!){
		addService(input: $input){
			id
			name
		}
	}`,
	{
		name: 'AddService'
	}
);

export const RemoveService = graphql(
	gql`mutation RemoveService($id: ID!){
		removeService(id: $id)
	}`,
	{
		name: 'RemoveService'
	}
);

export const UpdateService = graphql(
	gql`mutation UpdateService($id: ID!, $input: ServiceInput!){
		updateService(id: $id, input: $input){
			id
			name
		}
	}`,
	{
		name: 'UpdateService'
	}
);

/** QUERIES POUR FOLDERS */
export const FindFoldersFromUsername = gql`query FoldersFromUsername($username: String!){
	foldersFromUsername(username: $username) {
		id
		name
		isRoot
		lastUpdate
		folder {
		  	id
		  	name
		}
		surveys {
		  	id
			name
			reference
			hangout
			link
			lastUpdate
			folder {
				id
			}
			surveyAnswers{
				id
				hangout
			}
		}
	}
}`;

/** MUTATIONS POUR FOLDERS */
export const AddFolder = graphql(
	gql`mutation AddFolder($username: String!, $input: FolderInput!){
		addFolder(username: $username, input: $input){
			id
		}
	}`,
	{
		name: 'AddFolder'
	}
);

export const UpdateFolder = graphql(
	gql`mutation UpdateFolder($id: ID!, $folderId: Int!, $name: String!){
		updateFolder(id: $id, folderId: $folderId, name: $name){
			id
		}
	}`,
	{
		name: 'UpdateFolder'
	}
);

export const RemoveFolder = graphql(
	gql`mutation RemoveFolder($id: ID!){
		removeFolder(id: $id)
	}`,
	{
		name: 'RemoveFolder'
	}
);

/** QUERIES POUR SURVEYS */
export const FindSurvey = gql`query FindSurvey($id: ID!){
	survey(id: $id){
		id
		name
		link
		reference
		image
		description
		hangout
		activationDate
		deactivationDate
		activationKey
		language
		lastUpdate
		sections {
			id
			name
			index
			image
			description
			hangout
			questions {
				id
				name
				index
				description
				hangout
				mandatory
				type
				askFor
				linesNumber
				columnsNumber
				linesLabels
				columnsLabels
				linesImages
				columnsImages
				numberOfAnswers
				valuesAsImages
				numberOfValues
				values
				topLabel
				bottomLabel
				fileTypes
				commentary
				scaleMin
				scaleMax
				step
				labelsValues
				selectedValue
				graduation
				gradient
				gradientType
				dateInterval
				dateMin
				dateMax
			}
		}
		questions {
			id
			name
			index
			description
			hangout
			mandatory
			type
			askFor
			linesNumber
			columnsNumber
			linesLabels
			columnsLabels
			linesImages
			columnsImages
			numberOfAnswers
			valuesAsImages
			numberOfValues
			values
			topLabel
			bottomLabel
			fileTypes
			commentary
			scaleMin
			scaleMax
			step
			labelsValues
			selectedValue
			graduation
			gradient
			gradientType
			dateInterval
			dateMin
			dateMax
		}
	}
}`;

export const FindSurveyFromLink = gql`query FindSurveyFromLink($link: String!){
	surveyFromLink(link: $link){
		id
		name
		link
		reference
		image
		description
		hangout
		activationDate
		deactivationDate
		activationKey
		language
		lastUpdate
		sections {
			id
			name
			index
			image
			description
			hangout
			questions {
				id
				name
				index
				description
				hangout
				mandatory
				type
				askFor
				linesNumber
				columnsNumber
				linesLabels
				columnsLabels
				linesImages
				columnsImages
				numberOfAnswers
				valuesAsImages
				numberOfValues
				values
				topLabel
				bottomLabel
				fileTypes
				commentary
				scaleMin
				scaleMax
				step
				labelsValues
				selectedValue
				graduation
				gradient
				gradientType
				dateInterval
				dateMin
				dateMax
			}
		}
		questions {
			id
			name
			index
			description
			hangout
			mandatory
			type
			askFor
			linesNumber
			columnsNumber
			linesLabels
			columnsLabels
			linesImages
			columnsImages
			numberOfAnswers
			valuesAsImages
			numberOfValues
			values
			topLabel
			bottomLabel
			fileTypes
			commentary
			scaleMin
			scaleMax
			step
			labelsValues
			selectedValue
			graduation
			gradient
			gradientType
			dateInterval
			dateMin
			dateMax
		}
	}
}`;

/** MUTATIONS POUR SURVEYS */
export const RemoveSurvey = graphql(
	gql`mutation RemoveSurvey($id: ID!){
    		removeSurvey(id: $id)
		}`,
	{
		name: 'RemoveSurvey'
	}
);

export const DuplicateSurvey = graphql(
	gql`mutation DuplicateSurvey($id: ID!){
    		duplicateSurvey(id: $id){
        		id
			}
		}`,
	{
		name: 'DuplicateSurvey'
	}
);

export const ShareSurvey = graphql(
	gql`mutation ShareSurvey($surveyId: ID!, $serviceId: ID!){
		shareSurvey(surveyId: $surveyId, serviceId: $serviceId){
			id
		}
	}`,
	{
		name: 'ShareSurvey'
	}
);

export const AddSurvey = graphql(
	gql`mutation AddSurvey($input: SurveyInput!) {
		addSurvey(input: $input){
			id
		}
	}`,
	{
		name: 'AddSurvey'
	}
);

export const UpdateSurvey = graphql(
	gql`mutation UpdateSurvey($id: ID!, $input: SurveyInput!) {
		updateSurvey(id: $id, input: $input){
			id
		}
	}`,
	{
		name: 'UpdateSurvey'
	}
);

export const ChangeSurveyFolder = graphql(
	gql`mutation ChangeSurveyFolder($id: ID!, $folderId: ID!){
		changeSurveyFolder(id: $id, folderId: $folderId){
			id
		}
	}`,
	{
		name: 'ChangeSurveyFolder'
	}
);

/** QUERIES POUR SURVEYANSWERS */
export const SurveyAnswers = gql`query FindSurvey($id: ID!){
	survey(id: $id){
		id
		name
		description
		image
		hangout
		sections {
			id
			name
			index
			hangout
			questions {
				id
				name
				index
				hangout
				mandatory
				type
				askFor
				linesNumber
				columnsNumber
				linesLabels
				columnsLabels
				linesImages
				columnsImages
				numberOfAnswers
				valuesAsImages
				numberOfValues
				values
				topLabel
				bottomLabel
				fileTypes
				commentary
				scaleMin
				scaleMax
				step
				labelsValues
				selectedValue
				graduation
				gradient
				gradientType
				dateInterval
				dateMin
				dateMax
			}
		}
		questions {
			id
			name
			index
			hangout
			mandatory
			type
			askFor
			linesNumber
			columnsNumber
			linesLabels
			columnsLabels
			linesImages
			columnsImages
			numberOfAnswers
			valuesAsImages
			numberOfValues
			values
			topLabel
			bottomLabel
			fileTypes
			commentary
			scaleMin
			scaleMax
			step
			labelsValues
			selectedValue
			graduation
			gradient
			gradientType
			dateInterval
			dateMin
			dateMax
		}
		surveyAnswers {
			id
			hangout
			lastUpdate
			questionAnswers {
				questionName
				questionIndex
				questionType
				value
				choice
				rank
				file
				scale
				date
			}
		}
	}
}`;

/** MUTATIONS POUR SURVEYANSWERS */
export const AddSurveyAnswer = graphql(
	gql`mutation AddSurveyAnswer($input: SurveyAnswerInput!){
			addSurveyAnswer(input: $input){
				id
				lastUpdate
				survey {
					id
					name
				}
			}
		}`,
	{
		name: 'AddSurveyAnswer'
	}
);

/** QUERIES POUR QUESTIONLIBRARIES */
export const QuestionLibraries = gql`query FindQuestionLibraries {
	questionLibraries {
		id
		name
		description
		type
		username
		postDate
		askFor
		linesNumber
		columnsNumber
		linesLabels
		columnsLabels
		linesImages
		columnsImages
		numberOfAnswers
		valuesAsImages
		numberOfValues
		values
		topLabel
		bottomLabel
		fileTypes
		commentary
		scaleMin
		scaleMax
		step
		labelsValues
		selectedValue
		graduation
		gradient
		gradientType
		dateInterval
		dateMin
		dateMax
	}
}`;

/** MUTATIONS POUR QUESTIONLIBRARIES */
export const AddQuestionLibrary = graphql(
	gql`mutation AddQuestionLibrary($input: QuestionLibraryInput!){
		addQuestionLibrary(input: $input){
			id
		}
	}`,
	{
		name: `AddQuestionLibrary`
	}
);

export const RemoveQuestionLibrary = graphql(
	gql`mutation RemoveQuestionLibrary($id: ID!){
		removeQuestionLibrary(id: $id)
	}`,
	{
		name: `RemoveQuestionLibrary`
	}
);