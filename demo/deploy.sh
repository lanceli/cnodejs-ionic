#!/bin/bash

MASTER_DIR=$PWD
PAGES_DIR=$MASTER_DIR/_demo
GH_ORIGIN=git@github.com:lanceli/cnodejs-ionic.git
CODING_ORIGIN=git@coding.net:lanceli/cnodejs-ionic.git

# delete gh-pages branch if it exists
git branch | grep gh-pages && git branch -D gh-pages
rm -rf $PAGES_DIR
git clone . $PAGES_DIR
cd $PAGES_DIR
git checkout --orphan gh-pages
git rm -rf .
git remote rm origin
git remote rm coding
git remote add origin $GH_ORIGIN
git remote add coding $CODING_ORIGIN
cd $MASTER_DIR
cp $MASTER_DIR/demo/demo.html $MASTER_DIR/app/index.html
cp $MASTER_DIR/demo/index.html $PAGES_DIR/index.html
grunt compress
git checkout $MASTER_DIR/app/index.html
cp -R $MASTER_DIR/www $PAGES_DIR
cp $MASTER_DIR/resources/ios/icons/Icon@2x.png $PAGES_DIR/logo.png
cd $PAGES_DIR
git add --all
git commit -m "Content creation"

# Push quietly so the token isn't seen in the CI output
git push -fq origin gh-pages
git push -fq coding gh-pages
cd ..
rm -rf _demo
