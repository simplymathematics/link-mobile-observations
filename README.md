# Mobile Link App

 This application handles the backend services for the mobile link app used for authentication within the WiFi spots.
 
 ## Authentication
   POST /signup
   JSON :
   ```json
   {
   "email":"id",
   "deviceId":"deviceId",
   "deviceOS":"deviceOS",
   "deviceModel":"model",
   "latitude":"lat",
   "longitude":"lon",
   "adID":"adid",
   "adIDType":"as"
   }
   ```

   A new credential will be created and stored for each email, deviceId pair.
   DeviceId is not the real DeviceId, is an unique identifier for the device derived within the device itself.
   
   ```
   {
     "username": "SSDSFGD",
     "password": "ASDwdw123ADFD"
   }
   ```  
   
   If those id and deviceId already exists, will return the original credentials (Idempotency) 
     
     
   Otherwise:
     404 Bad Request
   ```
      {
        "reason": "some error from stacktrace"
      }
   ``` 
  
 ## Get Links list
 URL: https://link-mobile-observations-dev.us-east-1.elasticbeanstalk.com/dwh
 returns: 
 ```
    [
        {
            "id":"mn-09-120436",
            "latitude":"40.827117",
            "longitude":"-73.949738",
            "address":"3560 BROADWAY",
            "status":"Link Active!"
         },
         {
            "id":"bx-05-119597",
            "latitude":"40.85187831",
            "longitude":"-73.90897566",
            "address":"1966 JEROME AVENUE",
            "status":"Link Active!"
         }
     ]
 ``` 
  
 ## Healthcheck
   URL : /healthcheck
   Return 204 (NoContent) if it is a healthy status.
   
 ## Status
 URL : /status
  Checks the status of: database
    Returns 200 if everything is connectionAlive
    ```
    {
     "name":"dynamoDB","connectionAlive":true,"message":""
    }
    ```
    
    Otherwise:
    Returns 400 (bad request) if everything is not connectionAlive 
    ```
    {
     "name":"dynamoDB","connectionAlive":false,"message":"some message" 
    }
    ```
 