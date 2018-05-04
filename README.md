# Mobile Link Observations

 This application reads all the observations from AWS Kinesis

# Access

  https://localhost:9000/list
  
  Change localhost accordingly.
  
  
# Docker Swarm deployment check

 run this script:
 > curl -k --header 'Host: link-mobile-observations.dev.swarm.linksvc.com' https://dev-elbc-831371918.us-east-1.elb.amazonaws.com/health    
 
 Change dev for any other env accordingly. 