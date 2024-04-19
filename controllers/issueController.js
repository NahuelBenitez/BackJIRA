const axios = require('axios');
require('dotenv').config();

const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY; // Clave del proyecto de Jira

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

module.exports = {
  createIssue
};
