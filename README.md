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

Delete buckets (recursively)

    aws s3 rb s3://awsnode.actualit.info --force

Upload object

    aws s3 cp awstest.txt s3://awsnode.actualit.info/example/
    // to copy the file on example dir do not forget the /,  
    // without the / your copy rename awstest.txt into example

Delete object

    aws s3 rm s3://awsnode.actualit.info/example/filename.txt