# just_BI_api
face regnognition idk

# awscli
configure awscli

    aws configure

list all buckets and objetcts

    aws s3 ls

list all buckets and objetcts in specific target

    aws s3 ls s3://awsnode.actualit.info/

Create bucket

    aws s3 mb s3://awsnode.actualit.info

Delete buckets

    aws s3 rb s3://awsnode.actualit.info

Upload object

    aws s3 cp awstest.txt s3://awsnode.actualit.info/example/
    // pour renommer en même temps, enlever le / de fin

Delete object

    aws s3 rm s3://awsnode.actualit.info/example/filename.txt