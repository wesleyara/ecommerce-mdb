let profile = '';

function getActiveProfile(): string {
  if (profile) {
    return profile;
  }
  /* istanbul ignore next */
  profile = process.env.NODE_ENV || 'development';
  return profile;
}

function getEnvFilePath() {
  return ['.env'];
}

function isDev() {
  return getActiveProfile() === 'development';
}

function isProd(): boolean {
  return getActiveProfile() === 'production';
}

function isTest(): boolean {
  return getActiveProfile() === 'test';
}

export const Profile = {
  getActiveProfile,
  getEnvFilePath,
  isDev,
  isProd,
  isTest,
};
