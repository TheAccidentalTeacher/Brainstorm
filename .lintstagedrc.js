module.exports = {
  // Frontend files
  'src/frontend/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  'src/frontend/**/*.{json,css,scss,md}': [
    'prettier --write',
  ],
  
  // Backend files
  'src/backend/**/*.{js,ts}': [
    'eslint --fix',
    'prettier --write',
  ],
  'src/backend/**/*.{json,md}': [
    'prettier --write',
  ],
  
  // Shared files
  'src/shared/**/*.{js,ts}': [
    'eslint --fix',
    'prettier --write',
  ],
  'src/shared/**/*.{json,md}': [
    'prettier --write',
  ],
  
  // Root files
  '*.{json,md,yml,yaml}': [
    'prettier --write',
  ],
};