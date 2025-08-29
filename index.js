const inquirer = require('inquirer');
const { exec } = require('child_process');

const commands = async () => {
    console.log('Willkommen beim Git Branch Helper!');
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Was möchten Sie tun?',
            choices: [
                'Branches auflisten',
                'Branch erstellen',
                'Branch löschen',
                'Branch umbenennen',
                'Beenden',
            ],
        },
    ]);

    switch (action) {
        case 'Branches auflisten':
            listBranches();
            break;
        case 'Branch erstellen':
            createBranch();
            break;
        case 'Branch löschen':
            deleteBranch();
            break;
        case 'Branch umbenennen':
            renameBranch();
            break;
        case 'Beenden':
            console.log('Auf Wiedersehen!');
            process.exit();
            break;
    }
};

const listBranches = () => {
    exec('git branch -a', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(`Branches:\n${stdout}`);
        commands();
    });
};

const createBranch = async () => {
    const { branchName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'branchName',
            message: 'Geben Sie den Namen des neuen Branches ein:',
        },
    ]);

    exec(`git checkout -b ${branchName}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(`Branch erstellt: ${stdout}`);
        commands();
    });
};

const deleteBranch = async () => {
    const { branchName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'branchName',
            message: 'Geben Sie den Namen des zu löschenden Branches ein:',
        },
    ]);

    // Check if the branch exists before trying to delete it
    exec(`git branch --list ${branchName}`, (err, stdout) => {
        if (err) {
            console.error(`Error checking branch existence: ${err.message}`);
            commands();
            return;
        }
        if (stdout.trim() === '') {
            console.error(`Branch '${branchName}' existiert nicht.`);
            commands();
            return;
        }

        exec(`git branch -d ${branchName}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error deleting branch: ${stderr}`);
                return;
            }
            console.log(`Branch gelöscht: ${stdout}`);
            commands();
        });
    });
};

const renameBranch = async () => {
    const { oldBranchName, newBranchName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'oldBranchName',
            message: 'Geben Sie den aktuellen Branch-Namen ein:',
        },
        {
            type: 'input',
            name: 'newBranchName',
            message: 'Geben Sie den neuen Branch-Namen ein:',
        },
    ]);

    // Check if the old branch exists before renaming
    exec(`git branch --list ${oldBranchName}`, (err, stdout) => {
        if (err) {
            console.error(`Error checking branch existence: ${err.message}`);
            commands();
            return;
        }
        if (stdout.trim() === '') {
            console.error(`Branch '${oldBranchName}' existiert nicht.`);
            commands();
            return;
        }

        exec(`git branch -m ${oldBranchName} ${newBranchName}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error renaming branch: ${stderr}`);
                return;
            }
            console.log(`Branch umbenannt: ${stdout}`);
            commands();
        });
    });
};

commands();