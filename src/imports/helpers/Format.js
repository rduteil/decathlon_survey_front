export function formatToQuestion(questionToFormat){
    return {
        name: questionToFormat.name,
        index: questionToFormat.index,
        description: questionToFormat.description,
        mandatory: questionToFormat.mandatory,
        type: questionToFormat.type,
        hangout: questionToFormat.hangout,
        askFor: questionToFormat.askFor,
        linesNumber: questionToFormat.linesNumber,
        columnsNumber: questionToFormat.columnsNumber,
        linesLabels: questionToFormat.linesLabels,
        columnsLabels: questionToFormat.columnsLabels,
        linesImages: questionToFormat.linesImages,
        columnsImages: questionToFormat.columnsImages,
        numberOfAnswers: questionToFormat.numberOfAnswers,
        valuesAsImages: questionToFormat.valuesAsImages,
        numberOfValues: questionToFormat.numberOfValues,
        values: questionToFormat.values,
        topLabel: questionToFormat.topLabel,
        bottomLabel: questionToFormat.bottomLabel,
        fileTypes: questionToFormat.fileTypes,
        commentary: questionToFormat.commentary,
        scaleMin: questionToFormat.scaleMin,
        scaleMax: questionToFormat.scaleMax,
        step: questionToFormat.step,
        labelsValues: questionToFormat.labelsValues,
        selectedValue: questionToFormat.selectedValue,
        graduation: questionToFormat.graduation,
        gradient: questionToFormat.gradient,
        gradientType: questionToFormat.gradientType,
        dateInterval: questionToFormat.dateInterval,
        dateMin: questionToFormat.dateMin,
        dateMax: questionToFormat.dateMax,
    };
}

export function formatToSection(sectionToFormat){
    return {
        name: sectionToFormat.name,
        index: sectionToFormat.index,
        image: sectionToFormat.image,
        description: sectionToFormat.description,
        hangout: sectionToFormat.hangout,
    };
}

export function formatToQuestionAnswer(answerToFormat){
    let answer = undefined;
    switch(answerToFormat.type){
        case 'QUESTION_VALUE':
            answer = {
                questionName: answerToFormat.name,
                questionIndex: answerToFormat.globalIndex,
                questionType: answerToFormat.type,
                value: answerToFormat.answer,
                choice: null,
                rank: null,
                file: null,
                scale: null,
                date: null,
            }
            break;
        case 'QUESTION_CHOICE':
            answer = {
                questionName: answerToFormat.name,
                questionIndex: answerToFormat.globalIndex,
                questionType: answerToFormat.type,
                value: null,
                choice: answerToFormat.answer,
                rank: null,
                file: null,
                scale: null,
                date: null,
            }
            break;
        case 'QUESTION_RANK':
        answer = {
            questionName: answerToFormat.name,
            questionIndex: answerToFormat.globalIndex,
            questionType: answerToFormat.type,
            value: null,
            choice: null,
            rank: answerToFormat.answer,
            file: null,
            scale: null,
            date: null,
        }
            break;
        case 'QUESTION_FILE':
        answer = {
            questionName: answerToFormat.name,
            questionIndex: answerToFormat.globalIndex,
            questionType: answerToFormat.type,
            value: null,
            choice: null,
            rank: null,
            file: answerToFormat.answer,
            scale: null,
            date: null,
        }
            break;
        case 'QUESTION_SCALE':
        answer = {
            questionName: answerToFormat.name,
            questionIndex: answerToFormat.globalIndex,
            questionType: answerToFormat.type,
            value: null,
            choice: null,
            rank: null,
            file: null,
            scale: +(answerToFormat.answer),
            date: null,
        }
            break;
        case 'QUESTION_DATE':
        answer = {
            questionName: answerToFormat.name,
            questionIndex: answerToFormat.globalIndex,
            questionType: answerToFormat.type,
            value: null,
            choice: null,
            rank: null,
            file: null,
            scale: null,
            date: answerToFormat.answer,
        }
            break;
        default:
            break;
    }
    return answer;
}

export function makeSectionWritable(sectionToSet){
    let sectionToReturn = {};
    Object.defineProperties(sectionToReturn, {
        id: {
            value: sectionToSet.id,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        name: {
            value: sectionToSet.name,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        index: {
            value: sectionToSet.index,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        image: {
            value: sectionToSet.image,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        description: {
            value: sectionToSet.description,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        hangout: {
            value: sectionToSet.hangout,
            writable: true,
            configurable: true,
            enumerable: true,
        }
    });
    return sectionToReturn;
}

export function makeQuestionWritable(questionToSet){
    let questionToReturn = {};
    Object.defineProperties(questionToReturn, {
        id: {
            value: questionToSet.id,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        name: {
            value: questionToSet.name,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        index: {
            value: questionToSet.index,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        description: {
            value: questionToSet.description,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        hangout: {
            value: questionToSet.hangout,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        mandatory: {
            value: questionToSet.mandatory,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        type: {
            value: questionToSet.type,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        askFor: {
            value: questionToSet.askFor,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        linesNumber: {
            value: questionToSet.linesNumber,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        columnsNumber: {
            value: questionToSet.columnsNumber,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        linesLabels: {
            value: questionToSet.linesLabels,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        columnsLabels: {
            value: questionToSet.columnsLabels,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        linesImages: {
            value: questionToSet.linesImages,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        columnsImages: {
            value: questionToSet.columnsImages,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        numberOfAnswers: {
            value: questionToSet.numberOfAnswers,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        valuesAsImages: {
            value: questionToSet.valuesAsImages,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        numberOfValues: {
            value: questionToSet.numberOfValues,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        values: {
            value: questionToSet.values,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        topLabel: {
            value: questionToSet.topLabel,
            writable: true,
            configurable: true,
            enumerable: true,

        },
        bottomLabel: {
            value: questionToSet.bottomLabel,
            writable: true,
            configurable: true,
            enumerable: true,

        },
        fileTypes: {
            value: questionToSet.fileTypes,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        commentary: {
            value: questionToSet.commentary,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        scaleMin: {
            value: questionToSet.scaleMin,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        scaleMax: {
            value: questionToSet.scaleMax,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        step: {
            value: questionToSet.step,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        labelsValues: {
            value: questionToSet.labelsValues,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        selectedValue: {
            value: questionToSet.selectedValue,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        graduation: {
            value: questionToSet.graduation,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        gradient: {
            value: questionToSet.gradient,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        gradientType: {
            value: questionToSet.gradientType,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        dateInterval: {
            value: questionToSet.dateInterval,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        dateMin: {
            value: questionToSet.dateMin,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        dateMax: {
            value: questionToSet.dateMax,
            writable: true,
            configurable: true,
            enumerable: true,
        }
    });
    return questionToReturn;
}

export function makeQuestionLibraryWritable(questionLibraryToSet){
    let questionLibraryToReturn = {};
    Object.defineProperties(questionLibraryToReturn, {
        id: {
            value: questionLibraryToSet.id,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        name: {
            value: questionLibraryToSet.name,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        description: {
            value: questionLibraryToSet.description,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        type: {
            value: questionLibraryToSet.type,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        username: {
            value: questionLibraryToSet.username,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        postDate: {
            value: questionLibraryToSet.postDate,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        askFor: {
            value: questionLibraryToSet.askFor,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        linesNumber: {
            value: questionLibraryToSet.linesNumber,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        columnsNumber: {
            value: questionLibraryToSet.columnsNumber,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        linesLabels: {
            value: questionLibraryToSet.linesLabels,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        columnsLabels: {
            value: questionLibraryToSet.columnsLabels,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        linesImages: {
            value: questionLibraryToSet.linesImages,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        columnsImages: {
            value: questionLibraryToSet.columnsImages,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        numberOfAnswers: {
            value: questionLibraryToSet.numberOfAnswers,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        valuesAsImages: {
            value: questionLibraryToSet.valuesAsImages,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        numberOfValues: {
            value: questionLibraryToSet.numberOfValues,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        values: {
            value: questionLibraryToSet.values,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        topLabel: {
            value: questionLibraryToSet.topLabel,
            writable: true,
            configurable: true,
            enumerable: true,

        },
        bottomLabel: {
            value: questionLibraryToSet.bottomLabel,
            writable: true,
            configurable: true,
            enumerable: true,

        },
        fileTypes: {
            value: questionLibraryToSet.fileTypes,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        commentary: {
            value: questionLibraryToSet.commentary,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        scaleMin: {
            value: questionLibraryToSet.scaleMin,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        scaleMax: {
            value: questionLibraryToSet.scaleMax,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        step: {
            value: questionLibraryToSet.step,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        labelsValues: {
            value: questionLibraryToSet.labelsValues,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        selectedValue: {
            value: questionLibraryToSet.selectedValue,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        graduation: {
            value: questionLibraryToSet.graduation,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        gradient: {
            value: questionLibraryToSet.gradient,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        gradientType: {
            value: questionLibraryToSet.gradientType,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        dateInterval: {
            value: questionLibraryToSet.dateInterval,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        dateMin: {
            value: questionLibraryToSet.dateMin,
            writable: true,
            configurable: true,
            enumerable: true,
        },
        dateMax: {
            value: questionLibraryToSet.dateMax,
            writable: true,
            configurable: true,
            enumerable: true,
        }
    });
    return questionLibraryToReturn;
}
