package modules

import javax.inject.Inject
import actors.{KmeansActor, ProxyActor, UserEventActor, UserEventFactoryActor}
import akka.actor.{Actor, ActorLogging}
import akka.event.LoggingReceive
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.google.inject.{AbstractModule, Singleton}
import play.api.libs.concurrent.AkkaGuiceSupport
import play.api.{Configuration, Environment}

class AwsClientsModule(environment: Environment, configuration: Configuration) extends AbstractModule with AkkaGuiceSupport {
  override def configure() = {
    val credentialsProviderChain = new DefaultAWSCredentialsProviderChain
    val dynamoDBClient = new AmazonDynamoDBClient(credentialsProviderChain)
    bind(classOf[AmazonDynamoDBClient]).toInstance(dynamoDBClient)

//    val s3Client = new AmazonS3Client(credentialsProviderChain)
//    bind(classOf[AmazonS3Client]).toInstance(s3Client)

    bindActor[UserEventFactoryActor]("userEventFactoryActor")
    bindActorFactory[UserEventActor, UserEventActor.Factory]
    bindActor[MyActor]("myActor")
    bindActor[ProxyActor]("proxyActor")
    bindActor[KmeansActor]("kActor")
  }

}

@Singleton
class MyActor @Inject()() extends Actor with ActorLogging {
  def receive = LoggingReceive {
    case m => log.info(s"message ${m}")
  }

}


