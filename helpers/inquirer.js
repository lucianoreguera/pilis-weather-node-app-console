const inquirer = require('inquirer');
require('colors');


const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
];

const inquirerMenu = async () => {
    console.clear();

    console.log('==========================='.green);
    console.log('   Selecciona una opción'.white);
    console.log('==========================='.green);

    const {option} = await inquirer.prompt(questions);

    return option;
};

const pause = async () => {
    const question = {
        type: 'input',
        name: 'enter',
        message: `Presione ${'ENTER'.green} para continuar`,
    };

    console.log('\n');
    await inquirer.prompt(question);
};

const readInput = async (message) => {
    const question = {
        type: 'input',
        name: 'description',
        message,
        validate(value) {
            if (value.length === 0) return 'Por favor ingrese una ciudad';

            return true;
        }
    };

    const { description } = await inquirer.prompt(question);

    return description;
};

const listCities = async (cities = []) => {
    const choices = cities.map((city, index) => {
        const i = `${index+1}.`.green;

        return {
            value: city.id,
            name: `${i} ${city.name}`
        };
    });
    
    choices.unshift({
        value: 0,
        name: '0.'.green + 'Cancelar'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione ciudad:',
            choices
        }
    ];

    const { id } = await inquirer.prompt(questions);

    return id;
};

const confirm = async (message) => {
    const question = {
        type: 'confirm',
        name: 'ok',
        message
    };

    const { ok } = await inquirer.prompt(question);

    return ok;
};

const listChecklist = async (tasks = []) => {
    const choices = tasks.map((task, index) => {
        const i = `${index+1}.`.green;

        return {
            value: task.id,
            name: `${i} ${task.description}`,
            checked: (task.completed) ? true : false
        };
    });

    const questions = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ];

    const { ids } = await inquirer.prompt(questions);

    return ids;
};

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listCities,
    // confirm,
    // listChecklist
};