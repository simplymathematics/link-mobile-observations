package modules

import java.util.Date

import actors.CalculateKMeans
import akka.actor.{ActorRef, ActorSystem}
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain
import com.amazonaws.services.kinesis.clientlibrary.interfaces.{IRecordProcessor, IRecordProcessorFactory}
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.{KinesisClientLibConfiguration, Worker}
import com.google.inject.AbstractModule
import javax.inject.{Inject, Named}
import kinesis._
import models.{Observation, Ping}
import play.api.cache.AsyncCacheApi
import play.api.libs.concurrent.AkkaGuiceSupport
import play.api.{Configuration, Environment, Logger}

import scala.language.postfixOps
import scala.concurrent.{Await, ExecutionContext}
import scala.concurrent.duration._

class KinesisModule(environment: Environment, configuration: Configuration) extends AbstractModule with AkkaGuiceSupport {

  override def configure() = {
    bind(classOf[Test]).asEagerSingleton
  }
}


class ProcessorFactory(proxyActor: ActorRef) extends IRecordProcessorFactory {

  override def createProcessor(): IRecordProcessor = {
    println("init ProcessorFactory ")
    new Processor(proxyActor)
  }
}

class Test @Inject()(system: ActorSystem,
                     @Named("proxyActor") proxyActor: ActorRef,
//                     @Named("kActor") kActor: ActorRef,
                     cache: AsyncCacheApi,
                     configuration: Configuration)(implicit ec: ExecutionContext) {

  Await.result(cache.set("means", List[(Observation,Int)]()), 10 seconds )
  Await.result(cache.set("observations", List[Observation]()), 10 seconds)

  val env = configuration.get[String]("environment")
  //  val hostname: String = InetAddress.getLocalHost.getHostName
  val logger = Logger(getClass)

  system.scheduler.schedule(90.milli, 30.seconds) {
    Logger("ping").info("pinging")
    proxyActor ! Ping(System.currentTimeMillis())
  }

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
    case "local" => s"link-programmatic-uda-observations-${InetAddress.getLocalHost.getCanonicalHostName}"
    case default => s"link-programmatic-uda-observations-${env}-${UUID.randomUUID}"
  }

  try {
    val cp = new DefaultAWSCredentialsProviderChain
    val workerId: String = InetAddress.getLocalHost.getCanonicalHostName + ":" + UUID.randomUUID
    val kinesisClientLibConfiguration: KinesisClientLibConfiguration = new KinesisClientLibConfiguration(
      app_table,
      s"programmatic-uda-${kinesisStream}-observations",
      cp,
      workerId)

    val since = new Date(System.currentTimeMillis() - 2.days.toMillis)
    logger.info(s"since $since")
    kinesisClientLibConfiguration.withTimestampAtInitialPositionInStream( since )

    val recordProcessorFactory = new ProcessorFactory(proxyActor)
    val worker = new Worker(recordProcessorFactory, kinesisClientLibConfiguration)

    logger.info(s"Running ${workerId} to process stream.")

    var exitCode: Int = 0

    new Thread(worker).start()

    logger.info(s"Running system in $env  ")
    logger.info(s"Kinesis stream  'programmatic-uda-${kinesisStream}-observations' ")
    logger.info(s"app table: ${app_table} ")

  } catch {
    case t: Throwable =>
      System.err.println("Caught throwable while processing data.")
      t.printStackTrace()
      logger.error("Ex with KCL", t)
    //      exitCode = 1
  }


}