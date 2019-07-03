#! /bin/bash

BUCKET=$1
echo "Sync files to $BUCKET"
aws s3 sync build/ s3://$BUCKET/ --delete