echo "Copying README.md to claire-docs"
cp README.md claire-docs/docs/index.md
echo "Entering claire-docs directory"
cd claire-docs
echo "Building CLaiRE documentation"
mkdocs build
echo "Deploying CLaiRE documentation to gh-pages"
mkdocs gh-deploy
echo "Checking in changed files"
git add docs/ site/
echo "Committing updated documentation"
git commit -m "Rebuilt CLaiRE documentation"
echo "Entering main directory"
cd ..
echo "Adding CNAME to gh-pages"
git checkout gh-pages
echo "docs.claire.ac" > CNAME
git add CNAME
git commit -m "CNAME"
git checkout main
echo "Finished updating, building, and deploying documentation"