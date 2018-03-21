package kinesis

import java.nio.charset.Charset
import java.util
import java.util.zip.Inflater
import javax.inject.{Inject, Named}

import akka.actor.ActorRef
import com.amazonaws.services.kinesis.clientlibrary.exceptions.{InvalidStateException, ShutdownException, ThrottlingException}
import com.amazonaws.services.kinesis.clientlibrary.interfaces.{IRecordProcessor, IRecordProcessorCheckpointer}
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.ShutdownReason
import com.amazonaws.services.kinesis.model.Record
import models.{ObservationHolder, UpdateMessage}
import play.api.Logger

import scala.collection.JavaConverters._

class Processor(proxyActor: ActorRef) extends IRecordProcessor {

  val logger = Logger(getClass)
  var kinesisShardId = ""

  // Backoff and retry settings
  val BACKOFF_TIME_IN_MILLIS = 3000L
  val NUM_RETRIES = 10

  // Checkpoint about once a minute
  val CHECKPOINT_INTERVAL_MILLIS = 60000L
  var nextCheckpointTimeInMillis = 0L

  val decoder = Charset.forName("UTF-8").newDecoder


  def decompress(inData: Array[Byte]): Array[Byte] = {
    val inflater = new Inflater()
    inflater.setInput(inData)
    val decompressedData = new Array[Byte](inData.size * 2)
    var count = inflater.inflate(decompressedData)
    var finalData = decompressedData.take(count)
    while (count > 0) {
      count = inflater.inflate(decompressedData)
      finalData = finalData ++ decompressedData.take(count)
    }
    inflater.end()

    val value = new String(finalData, "UTF-8")
    val observations: List[ObservationHolder] = models.Observations.parse(value)
//    println(s" -> #: ${observations.size} ${proxyActor}")
    observations.foreach { obs =>
      proxyActor ! UpdateMessage(obs.body.observation)
    }

    return finalData
  }


  override def processRecords(records: util.List[Record], checkpointer: IRecordProcessorCheckpointer): Unit = {
    println(s" processRecords")
    logger.info("Processing " + records.size + " records from " + kinesisShardId)

    // Process records and perform all exception handling.
    records.asScala.foreach { record =>

      decompress(record.getData.array())


    }

    // Checkpoint once every checkpoint interval.
    if (System.currentTimeMillis > nextCheckpointTimeInMillis) {
      checkpoint(checkpointer)
      nextCheckpointTimeInMillis = System.currentTimeMillis + CHECKPOINT_INTERVAL_MILLIS
    }
  }

  override def initialize(shardId: String): Unit = {
    logger.info("Initializing record processor for shard: " + shardId)
    kinesisShardId = shardId
  }

  override def shutdown(checkpointer: IRecordProcessorCheckpointer, reason: ShutdownReason): Unit = {

  }


  private def checkpoint(checkpointer: IRecordProcessorCheckpointer): Unit = {
    logger.info("Checkpointing shard " + kinesisShardId)
    var i = 0
    while (i < NUM_RETRIES) {
      try {
        checkpointer.checkpoint()
      } catch {
        case se: ShutdownException =>
          // Ignore checkpoint if the processor instance has been shutdown (fail over).
          logger.info("Caught shutdown exception, skipping checkpoint.", se)
        case e: ThrottlingException =>
          // Backoff and re-attempt checkpoint upon transient failures
          if (i >= (NUM_RETRIES - 1)) {
            logger.error("Checkpoint failed after " + (i + 1) + "attempts.", e)
          }
          else logger.info("Transient issue when checkpointing - attempt " + (i + 1) + " of " + NUM_RETRIES, e)
        case e: InvalidStateException =>
          // This indicates an issue with the DynamoDB table (check for table, provisioned IOPS).
          logger.error("Cannot save checkpoint to the DynamoDB table used by the Amazon Kinesis Client Library.", e)
      }
      try
        Thread.sleep(BACKOFF_TIME_IN_MILLIS)
      catch {
        case e: InterruptedException =>
          logger.debug("Interrupted sleep", e)
      }

      i += 1

    }
  }
}
