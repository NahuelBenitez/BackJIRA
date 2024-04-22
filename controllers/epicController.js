const axios = require('axios');
require('dotenv').config();

const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const createEpic = async (summary, description) => {
  try {
    const response = await axios.post(`${JIRA_HOST}/rest/api/2/epic`, {
      fields: {
        project: {
          key: 'PRB' // Cambia esto por la clave de tu proyecto en Jira
        },
        summary: summary,
        description: description,
        issuetype: {
          name: 'Epic'
        }
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
    console.error('Error al crear el epic:', error.response.data);
    throw error;
  }
};

module.exports = {
  createEpic
};
