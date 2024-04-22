const axios = require('axios');
require('dotenv').config();

const JIRA_HOST = process.env.JIRA_HOST;
const DOMAIN = process.env.DOMAIN
const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY; // Clave del proyecto de Jira

async function createIssue( issue) {
  console.log(issue)
  try {
    const baseUrl = 'https://' + DOMAIN + '.atlassian.net';
    const data = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary: issue.summary,
        description: issue.description,
        issuetype: { name: issue.issueType },
        labels: issue.labels,
        parent: { key: issue.parent.key}
      }
    };
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: JIRA_USERNAME,
        password: JIRA_API_TOKEN
      }
    };
    const response = await axios.post(`${baseUrl}/rest/api/2/issue`, data, config);
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}


const createIssues = async (issues) => {

  try {
    // Mapear el array de issues para enviar solicitudes de creación en paralelo
    const responses = await Promise.all(issues.map(async (issue) => {
      console.log(issue.parent.key)
      const response = await axios.post(`${JIRA_HOST}/rest/api/2/issue`, {
        fields: {
          project: {
            key: JIRA_PROJECT_KEY
          },
          summary: issue.summary,
          description: issue.description,
          issuetype: {
            name: issue.issueType
          },
          labels: issue.labels || [],
          parent: {
            key: issue.parent.key
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
      console.log(issue);
      return response.data;
    }));

    return responses;
  } catch (error) {
    console.error('Error al crear las issues:', error.response.data);
    throw error;
  }
};
const getIssues = async () => {
  try {
    const response = await axios.get(`${JIRA_HOST}/rest/api/2/search`, {
      auth: {
        username: JIRA_USERNAME,
        password: JIRA_API_TOKEN
      },
      params: {
        jql: `project=${JIRA_PROJECT_KEY}`,
        fields: 'summary,description,issuetype,labels'
      }
    });
    return response.data.issues;
  } catch (error) {
    console.error('Error al obtener las issues:', error.response.data);
    throw error;
  }
};

module.exports = {
  createIssues,
  getIssues,
  createIssue
};
