#!/bin/bash
# Rebuild, copy, commit then upload gh-pages branch.

# Exit immediately on error.
set -e

echo -e "\033[0;32mDeploying Github Pages...\033[0m"

# Check that there are no uncommited files in master.
status=$(git status --short)
if [ $(echo "$status" | wc -w) -gt 0 ]; then
  echo "FAILED: There are uncommited changes."
  echo "$status"
  exit 1
fi

# Rebild application.
webpack

# Copy built files to gh-pages.
cp -p ./build/* ./gh-pages/

cd ./gh-pages/

# Add changes to git.
git add .

# Commit changes.
msg="Rebuild Github Pages."
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push to Github Pages.
git push origin gh-pages

cd ..
