package modules

import java.net.InetAddress

import scala.concurrent.duration._
import com.amazonaws.services.kinesis.clientlibrary.exceptions.{InvalidStateException, ShutdownException, ThrottlingException}
import com.amazonaws.services.kinesis.clientlibrary.interfaces.{IRecordProcessor, IRecordProcessorCheckpointer, IRecordProcessorFactory}
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.KinesisClientLibConfiguration
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.InitialPositionInStream
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.Worker
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import javax.inject.{Inject, Named}

import akka.actor.{ActorRef, ActorSystem}
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain
import kinesis._
import com.google.inject.AbstractModule
import models.Ping
import play.api.libs.concurrent.AkkaGuiceSupport
import play.api.{Configuration, Environment, Logger}

import scala.concurrent.ExecutionContext

class KinesisModule(environment: Environment, configuration: Configuration) extends AbstractModule with AkkaGuiceSupport {

  override def configure() = {
    bind(classOf[Test]).asEagerSingleton


  }
}


class ProcessorFactory(proxyActor: ActorRef) extends IRecordProcessorFactory {

  override def createProcessor(): IRecordProcessor = new Processor(proxyActor)
}

class Test @Inject()(system: ActorSystem,
                     @Named("proxyActor") proxyActor: ActorRef,
                     configuration: Configuration)(implicit ec: ExecutionContext) {

  val env = configuration.get[String]("environment")
//  val hostname: String = InetAddress.getLocalHost.getHostName
  val logger = Logger(getClass)
  system.scheduler.schedule(90.milli, 30.seconds) {
    Logger("ping").info("pinging")
    proxyActor ! Ping(System.currentTimeMillis())
  }


  import java.net.InetAddress
  import java.util.UUID

  val kinesisStream = env match {
    case "qa" => "test"
    case x: String => x
  }

  try {
    val cp = new DefaultAWSCredentialsProviderChain
    val workerId: String = InetAddress.getLocalHost.getCanonicalHostName + ":" + UUID.randomUUID
    val kinesisClientLibConfiguration: KinesisClientLibConfiguration = new KinesisClientLibConfiguration(
      s"link-programmatic-uda-observations-${env}",
      s"programmatic-uda-${kinesisStream}-observations",
      cp,
      workerId)

    kinesisClientLibConfiguration.withInitialPositionInStream(InitialPositionInStream.LATEST)

    val recordProcessorFactory = new ProcessorFactory(proxyActor)
    val worker = new Worker(recordProcessorFactory, kinesisClientLibConfiguration)

    System.out.printf("Running %s to process stream %s as worker %s...\n", "SAMPLE_APPLICATION_NAME", "SAMPLE_APPLICATION_STREAM_NAME", workerId)

    var exitCode: Int = 0

    new Thread(worker).start()

    logger.info(s"Running system in $env  'programmatic-uda-${kinesisStream}-observations' ")
  } catch {
    case t: Throwable =>
      System.err.println("Caught throwable while processing data.")
      t.printStackTrace()
      logger.error("Ex with KCL", t)
    //      exitCode = 1
  }


}