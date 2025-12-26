import { getUncachableGitHubClient } from './github-util';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

async function run() {
    const projectName = "smart-facilities-ops"; // Specific project name
    console.log(`Starting upload for project: ${projectName}`);

  try {
    // 1. Initialize Git and Commit
    console.log('Initializing local git repository...');
    await execPromise('git init');
    await execPromise('git add .');
    // Check if there are changes to commit
    try {
      await execPromise('git commit -m "Initial commit from Replit"');
    } catch (e) {
      console.log('No changes to commit or already committed.');
    }

    // 2. Create GitHub Repository
    console.log('Creating remote repository on GitHub...');
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);

    let repo;
    try {
      const { data } = await octokit.repos.createForAuthenticatedUser({
        name: projectName,
        private: true, // Default to private for safety
        auto_init: false,
      });
      repo = data;
      console.log(`Repository created: ${repo.html_url}`);
    } catch (e: any) {
      if (e.status === 422) {
        console.log('Repository already exists, attempting to push to existing.');
        repo = { html_url: `https://github.com/${user.login}/${projectName}.git` };
      } else {
        throw e;
      }
    }

    // 3. Push to GitHub
    console.log('Pushing code to GitHub...');
    const accessToken = await (async () => {
      // Re-triggering the same logic to get token for git CLI
      // This is a bit hacky but works for a quick CLI push
      const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
      const xReplitToken = process.env.REPL_IDENTITY || process.env.WEB_REPL_RENEWAL;
      const res = await fetch(`https://${hostname}/api/v2/connection?include_secrets=true&connector_names=github`, {
        headers: { 'X_REPLIT_TOKEN': 'repl ' + xReplitToken }
      });
      const data = await res.json();
      return data.items?.[0]?.settings?.access_token || data.items?.[0]?.settings?.oauth?.credentials?.access_token;
    })();

    const remoteUrl = `https://x-access-token:${accessToken}@github.com/${user.login}/${projectName}.git`;
    
    await execPromise('git remote remove origin').catch(() => {});
    await execPromise(`git remote add origin ${remoteUrl}`);
    await execPromise('git branch -M main');
    await execPromise('git push -u origin main');

    console.log('Successfully pushed to GitHub!');
  } catch (error) {
    console.error('Error during GitHub upload:', error);
    process.exit(1);
  }
}

run();
