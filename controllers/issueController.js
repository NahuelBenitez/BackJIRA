const axios = require('axios');
require('dotenv').config();

const JIRA_HOST = process.env.JIRA_HOST;
const DOMAIN = process.env.DOMAIN
const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY; // Clave del proyecto de Jira

const auth = {
  username: JIRA_USERNAME,
  password: JIRA_API_TOKEN
};

const createIssue = async (summary, description, issueType,labels) => {
  try {
    const response = await axios.post(`${JIRA_HOST}/rest/api/2/issue`, {
      fields: {
        project: {
          key: JIRA_PROJECT_KEY 
        },
        summary: summary,
        description: description,
        issuetype: {
          name: issueType,
        },
       
        labels: labels || []
      }
    }, {
      auth: {
        username: JIRA_USERNAME,
        password: JIRA_API_TOKEN
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al crear la issue:', error.response.data);
    throw error;
  }
};

async function getIssues() {

  try {

    const baseUrl = 'https://' + DOMAIN + '.atlassian.net';

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/search',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}

module.exports = {
  createIssue,
  getIssues
};
