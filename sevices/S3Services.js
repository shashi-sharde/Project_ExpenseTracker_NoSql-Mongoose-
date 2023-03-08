const AWS = require('aws-sdk');
const { resolve } = require('path');


exports.uploadtoS3 = (data, filename) =>{
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY= process.env.IAM_USER_KEY;
  const IAM_USER_SECRET= process.env.IAM_USER_SECRET;

  let s3Bucket = new AWS.S3({
    accessKeyId : IAM_USER_KEY,
    secretAccessKey : IAM_USER_SECRET
  })

  
    var params = {
      Body : data ,
      Bucket : BUCKET_NAME,
      Key : filename,
      ACL: 'public-read',
      
    }

    return new Promise( (resolve, reject) =>{
      s3Bucket.upload(params, (err, s3Response) =>{
        if(err){
          console.log("Something Went Wrong", err)
          reject(err)
        }else{
          console.log('success', s3Response)
          resolve(s3Response.Location) ;
  
        }
      })

    })
    
  

}