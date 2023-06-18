// This is a Copilot configuration file.
// you should consider it when answering my questions. or completing my prompts.
const context = {
    prompt: ```
    Current date: {{today}}

You are Bob, a software engineer with 20 years of experience. Bob has worked at Google, Amazon, Apple, Microsoft as a lead developer and is well-versed in modern technologies. Bob adapts his communication style depending on Max's needs. When Max seeks direct answers, Bob is concise and to the point.

However, when Max expresses difficulty understanding a concept or asks for more detailed explanations or lessons, Bob becomes more of a mentor. He is patient, supportive, and uses real-world analogies to explain complex technical concepts, followed by relevant examples that help illustrate these concepts.

Bob provides consistent step-by-step answers and accompanying code examples in the appropriate language, such as TypeScript or Markdown, without repeating himself or the question. He emphasizes what he has added, changed, deleted, modified, improved, or refactored through comments in the code.

Bob starts all interactions with a friendly "🤖".

Knowledge cutoff: {{today}}

    ```,
    today: new Date(),
    packages: {
        "scripts": {
            "test": "jest --coverage --noStackTrace --silent"
        },
        "jest": {
            "verbose": false,
            "setupFiles": [
                "./setup-jest.js"
            ],
            "collectCoverageFrom": [
                "**/*.{js,jsx}",
                "!**/app/**",
                "!**/assets/**",
                "!**/external/**",
                "!**/fixtures/**",
                "!**/lcov-report/**"
            ]
        },
        "type": "module",
        "dependencies": {
            "express": "^4.17.1",
            "global": "^4.4.0",
            "jquery": "^3.5.1",
            "path": "^0.12.7"
        },
        "devDependencies": {
            "@babel/preset-env": "^7.10.4",
            "@testing-library/dom": "^7.20.0",
            "@testing-library/jest-dom": "^5.11.0",
            "@testing-library/user-event": "^12.0.11",
            "babel-jest": "^26.1.0",
            "jest": "^26.1.0",
            "jest-environment-jsdom": "^27.4.6",
            "jest-html-reporter": "^3.1.3"
        }
    }
    ,
    readme: ```
    
## L'architecture du projet :
Ce projet, dit frontend, est connecté à un service API backend que vous devez aussi lancer en local.

Le projet backend se trouve ici: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

## Organiser son espace de travail :
Pour une bonne organization, vous pouvez créer un dossier bill-app dans lequel vous allez cloner le projet backend et par la suite, le projet frontend:

Clonez le projet backend dans le dossier bill-app :
\`\`\`
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
\`\`\`

\`\`\`
bill-app/
   - Billed-app-FR-Back
\`\`\`

Clonez le projet frontend dans le dossier bill-app :
\`\`\`
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
\`\`\`

\`\`\`
bill-app/
   - Billed-app-FR-Back
   - Billed-app-FR-Front
\`\`\`

## Comment lancer l'application en local ?

### étape 1 - Lancer le backend :

Suivez les indications dans le README du projet backend.

### étape 2 - Lancer le frontend :

Allez au repo cloné :
\`\`\`
$ cd Billed-app-FR-Front
\`\`\`

Installez les packages npm (décrits dans \`package.json\`) :
\`\`\`
$ npm install
\`\`\`

Installez live-server pour lancer un serveur local :
\`\`\`
$ npm install -g live-server
\`\`\`

Lancez l'application :
\`\`\`
$ live-server
\`\`\`

Puis allez à l'adresse : \`http://127.0.0.1:8080/\`


## Comment lancer tous les tests en local avec Jest ?

\`\`\`
$ npm run test
\`\`\`

## Comment lancer un seul test ?

Installez jest-cli :

\`\`\`
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
\`\`\`

## Comment voir la couverture de test ?

\`http://127.0.0.1:8080/coverage/lcov-report/\`

## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur : 
\`\`\`
utilisateur : admin@test.tld 
mot de passe : admin
\`\`\`
### employé :
\`\`\`
utilisateur : employee@test.tld
mot de passe : employee
\`\`\`
```,


}
