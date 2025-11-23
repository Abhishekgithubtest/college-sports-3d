import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  
  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function main() {
  try {
    const token = await getAccessToken();
    const octokit = new Octokit({ auth: token });

    // Get authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const username = user.login;
    console.log(`Authenticated as: ${username}`);

    // Create repository
    const repoName = 'college-sports-3d';
    try {
      const { data: existingRepo } = await octokit.rest.repos.get({
        owner: username,
        repo: repoName,
      });
      console.log(`Repository ${repoName} already exists`);
    } catch (error) {
      if (error.status === 404) {
        console.log(`Creating new repository: ${repoName}`);
        const { data: newRepo } = await octokit.rest.repos.createForAuthenticatedUser({
          name: repoName,
          description: 'College Sports Scoring & Live Update Management System with 3D Visualizations',
          private: false,
          auto_init: false,
        });
        console.log(`Repository created: ${newRepo.html_url}`);
      } else {
        throw error;
      }
    }

    // Clean up git lock file if it exists
    const lockFile = '/home/runner/workspace/.git/index.lock';
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
      console.log('Removed git lock file');
    }

    // Initialize git if needed
    try {
      await execAsync('git -C /home/runner/workspace rev-parse --git-dir');
    } catch {
      console.log('Initializing git repository...');
      await execAsync('git -C /home/runner/workspace init');
    }

    // Configure git
    await execAsync('git -C /home/runner/workspace config user.email "replit@example.com"');
    await execAsync('git -C /home/runner/workspace config user.name "Replit Agent"');

    // Add all files
    console.log('Adding files to git...');
    await execAsync('git -C /home/runner/workspace add -A');

    // Commit
    console.log('Creating commit...');
    try {
      await execAsync('git -C /home/runner/workspace commit -m "Initial commit: College Sports 3D Platform with PostgreSQL, Photo Uploads, and Analytics Dashboard"');
    } catch (error) {
      if (!error.stdout.includes('nothing to commit')) {
        throw error;
      }
      console.log('No changes to commit');
    }

    // Add remote and push
    const remoteUrl = `https://github.com/${username}/${repoName}.git`;
    console.log(`Adding remote: ${remoteUrl}`);
    
    try {
      await execAsync(`git -C /home/runner/workspace remote remove origin`);
    } catch {
      // Remote doesn't exist, that's fine
    }

    await execAsync(`git -C /home/runner/workspace remote add origin ${remoteUrl}`);

    console.log('Pushing to GitHub...');
    await execAsync(`git -C /home/runner/workspace push -u origin master`, {
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'Replit Agent',
        GIT_AUTHOR_EMAIL: 'replit@example.com',
        GIT_COMMITTER_NAME: 'Replit Agent',
        GIT_COMMITTER_EMAIL: 'replit@example.com',
      }
    });

    console.log('\n✅ Success! Your code has been pushed to GitHub!');
    console.log(`📚 Repository: ${remoteUrl}`);
    console.log(`👁️ View: https://github.com/${username}/${repoName}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
