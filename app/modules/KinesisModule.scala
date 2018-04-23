package modules

import java.util.{Date, UUID}

import actors.{CalculateKMeans, SnapshotRequest}
import akka.actor.{ActorRef, ActorSystem}
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain
import com.amazonaws.services.elasticbeanstalk.AWSElasticBeanstalkClientBuilder
import com.amazonaws.services.elasticbeanstalk.model.DescribeEnvironmentsRequest
import com.amazonaws.services.kinesis.clientlibrary.interfaces.{IRecordProcessor, IRecordProcessorFactory}
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.{InitialPositionInStream, KinesisClientLibConfiguration, Worker}
import com.google.inject.AbstractModule
import javax.inject.{Inject, Named}
import kinesis._
import models.Observation
import play.api.cache.AsyncCacheApi
import play.api.libs.concurrent.AkkaGuiceSupport
import play.api.{Configuration, Environment, Logger}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext}
import scala.language.postfixOps
import scala.util.{Failure, Success, Try}

class KinesisModule(environment: Environment, configuration: Configuration) extends AbstractModule with AkkaGuiceSupport {

  override def configure() = {
    bind(classOf[Test]).asEagerSingleton
  }
}


class ProcessorFactory(proxyActor: ActorRef) extends IRecordProcessorFactory {
  val logger = Logger(getClass)

  override def createProcessor(): IRecordProcessor = {
    logger.info("init ProcessorFactory ")
    new Processor(proxyActor)
  }
}

class Test @Inject()(system: ActorSystem,
                     @Named("proxyActor") proxyActor: ActorRef,
                     @Named("kActor") kActor: ActorRef,
                     cache: AsyncCacheApi,
                     configuration: Configuration)(implicit ec: ExecutionContext) {
  val logger = Logger(getClass)

  Await.result(cache.set("means", List[(Observation, Int)]()), 10 seconds)
  Await.result(cache.set("observations", Set[Observation]()), 10 seconds)

  val env = configuration.get[String]("environment")


  Try {
    import scala.collection.JavaConverters._
    val client = AWSElasticBeanstalkClientBuilder.defaultClient() //.standard().build()
    val app = new DescribeEnvironmentsRequest().getApplicationName
    val ids = new DescribeEnvironmentsRequest().getEnvironmentIds.asScala.toList
    ids.foreach { id =>
      logger.info(id)
    }
    val req = new DescribeEnvironmentsRequest().withEnvironmentIds(ids:_*)
    val response = client.describeEnvironments(req)
    logger.info(s" Envs ${response}")
    response.getEnvironments.forEach(c => logger.info(c.toString))
  }

  match {
    case Failure(f) => f.printStackTrace()
    case Success(s) => logger.info(s"Ok with describe ${
      s
    }")

  }


  val uuid = UUID.randomUUID().toString
  logger.info(s"Node: ${
    uuid
  }")

  //  val hostname: String = InetAddress.getLocalHost.getHostName

  //  system.scheduler.scheduleOnce(10.seconds) {
  //    proxyActor ! SnapshotRequest(uuid)
  //  }

  //  system.scheduler.schedule( 10 minutes, 30 minutes) {
  //    Logger("means").info("kmeans")
  //    kActor ! CalculateKMeans()
  //  }


  import java.net.InetAddress
  import java.util.UUID

  val kinesisStream = env match {
    case "local" => "test"
    case "qa" => "test"
    case x: String => x
  }


  val app_table = env match {
    case "local" => s"link-programmatic-uda-observations-${
      InetAddress.getLocalHost.getCanonicalHostName
    }"
    case default => s"link-programmatic-uda-observations-${
      env
    }"
  }

  try {
    val cp = new DefaultAWSCredentialsProviderChain
    val workerId: String = InetAddress.getLocalHost.getCanonicalHostName + ":" + UUID.randomUUID
    val kinesisClientLibConfiguration: KinesisClientLibConfiguration = new KinesisClientLibConfiguration(
      app_table,
      s"programmatic-uda-${
        kinesisStream
      }-observations",
      cp,
      workerId)

    val since = new Date(System.currentTimeMillis() - 2.minutes.toMillis)
    logger.info(s"since $since")
    kinesisClientLibConfiguration.withTimestampAtInitialPositionInStream(since)

    //    kinesisClientLibConfiguration.withInitialPositionInStream(InitialPositionInStream.LATEST)
    val recordProcessorFactory = new ProcessorFactory(proxyActor)
    val worker = new Worker(recordProcessorFactory, kinesisClientLibConfiguration)

    logger.info(s"Running ${
      workerId
    } to process stream.")

    new Thread(worker).start()

    logger.info(s"Running system in $env  ")
    logger.info(s"Kinesis stream  'programmatic-uda-${
      kinesisStream
    }-observations' ")
    logger.info(s"app table: ${
      app_table
    } ")

  } catch {
    case t: Throwable =>
      logger.error("Ex with KCL", t)
  }


}
