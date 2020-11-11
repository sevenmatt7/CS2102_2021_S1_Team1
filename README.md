# CS2102 Project AY20/21 Team 1 Repository

## 📝 Table of Contents
- [Team](#info)
- [About](#about)
- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [Acknowledgments](#acknowledgement)

## 👨‍💻  Team <a name = "info"></a>
- Matthew Nathanael Sugiri *A0183805B*
- Joshua Tam *A0190309H*
- Tan Guan Yew *A0183464Y*
- Sean Lim *A0187123H*
- Glen Wong *A0188100N*

## 🧐 About <a name = "about"></a>
THE WEBSITE IS LIVE AT [AT THIS LINK!!!](https://petsocietyof2102.herokuapp.com/)
Please find the **project report** [here](https://github.com/sevenmatt7/CS2102_2021_S1_Team1/blob/master/CS2102%20Team%201%20Final%20Project%20Report.pdf), preliminary constraints [here](proj_docs/prelim_constraints.md) and the ER diagram [here](proj_docs/Final_ER_Diagram.pdf)

 ## 🏁 Getting Started <a name = "getting_started"></a>
The instructions below will help to get you set up to develop the project on your local machine.

### Prerequisites
You will need to have:
- NodeJS
- PostgreSQL
- npm 
installed on your system


### Setting up and installing
1. Clone the repo
2. Run the command below inside both in the **/client** directory and the root directory.

```javascript
npm install
```

3. Start up your psql shell and then copy all the code from the **database.sql** file in the root directory
and paste it in the shell to run the code to create the tables and functions for our schema.
```sql
psql -U postgres
```
6. Create .env file in the root directory and fill it with the 4 variables listed below and assign the corresponding values to them
```
jwtSecret
PG_USER
PG_HOST
PG_PASSWORD
PG_PORT
PG_DATABASE
```

## Running the project

### Front end
Make sure you are in the **/client** directory and run the command below.
```javascript
npm start // This will start the front end in development mode.
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Back end
Make sure you are in the root directory and run the command below.
```javascript
node index // Run nodemon dev server.
```

## 🎈 Usage <a name="usage"></a>
Add notes about how to use the system.

## 🚀 Deployment <a name = "deployment"></a>
Add additional notes about how to deploy this on a live system.
 --> 
## ⛏️ Built Using <a name = "built_using"></a>
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [ReactJS](https://reactjs.org/) - Frontend 
- [NodeJS](https://nodejs.org/en/) - Server Environment


## 🎉 Acknowledgements <a name = "acknowledgement"></a>
- README inspiration from [here](https://github.com/kylelobo/The-Documentation-Compendium)

<!-- ## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify -->
