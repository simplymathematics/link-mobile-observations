package kinesis;


import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.util.List;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;

import com.amazonaws.services.kinesis.clientlibrary.lib.worker.ShutdownReason;
import models.implicits;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.amazonaws.services.kinesis.clientlibrary.exceptions.InvalidStateException;
import com.amazonaws.services.kinesis.clientlibrary.exceptions.ShutdownException;
import com.amazonaws.services.kinesis.clientlibrary.exceptions.ThrottlingException;
import com.amazonaws.services.kinesis.clientlibrary.interfaces.IRecordProcessor;
import com.amazonaws.services.kinesis.clientlibrary.interfaces.IRecordProcessorCheckpointer;

import com.amazonaws.services.kinesis.model.Record;

/**
 * Processes records and checkpoints progress.
 */
public class RecordProcessor implements IRecordProcessor {

    private final Log log = LogFactory.getLog(getClass());
    private String kinesisShardId;

    // Backoff and retry settings
    private static final long BACKOFF_TIME_IN_MILLIS = 3000L;
    private static final int NUM_RETRIES = 10;

    // Checkpoint about once a minute
    private static final long CHECKPOINT_INTERVAL_MILLIS = 60000L;
    private long nextCheckpointTimeInMillis;

    private final CharsetDecoder decoder = Charset.forName("UTF-8").newDecoder();

    /**
     * {@inheritDoc}
     */
    @Override
    public void initialize(String shardId) {
        log.info("Initializing record processor for shard: " + shardId);
        this.kinesisShardId = shardId;
    }


    public static void decompress(ByteBuffer array){
        Inflater inflater = new Inflater();
        inflater.setInput(array.array());
        byte[] ba = new byte[array.array().length * 4];

        try {
            int i = inflater.inflate(ba);
            inflater.end();
            String neVal = new String(ba, 0, i, "UTF-8");


//            System.out.println(" String "+ ba + " " + i);
//            System.out.println(" String "+ ba[0]+ba[1]+ba[2]+ba[3]+ba[4]);
//            System.out.println(" String #"+ neVal + "#");
            implicits.parse(neVal);

        } catch (DataFormatException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

//        val decompressedData = new Array[Byte](array.size * 2)
//        val resultLength: Int = decompresser.inflate(decompressedData)
//        decompresser.end()
//
//        val outputString = new String(decompressedData, 0, resultLength, "UTF-8")
//        System.out.println("Deflated String:" + outputString)
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void processRecords(List<Record> records, IRecordProcessorCheckpointer checkpointer) {
        log.info("Processing " + records.size() + " records from " + kinesisShardId);

        // Process records and perform all exception handling.
        processRecordsWithRetries(records);

        // Checkpoint once every checkpoint interval.
        if (System.currentTimeMillis() > nextCheckpointTimeInMillis) {
            checkpoint(checkpointer);
            nextCheckpointTimeInMillis = System.currentTimeMillis() + CHECKPOINT_INTERVAL_MILLIS;
        }
    }

    /**
     * Process records performing retries as needed. Skip "poison pill" records.
     *
     * @param records Data records to be processed.
     */
    private void processRecordsWithRetries(List<Record> records) {
        for (Record record : records) {
            boolean processedSuccessfully = false;
            for (int i = 0; i < NUM_RETRIES; i++) {
                try {
                    //
                    // Logic to process record goes here.
                    //
                    processSingleRecord(record);

                    processedSuccessfully = true;
                    break;
                } catch (Throwable t) {
                    log.warn("Caught throwable while processing record " + record, t);
                }

                // backoff if we encounter an exception.
                try {
                    Thread.sleep(BACKOFF_TIME_IN_MILLIS);
                } catch (InterruptedException e) {
                    log.debug("Interrupted sleep", e);
                }
            }

            if (!processedSuccessfully) {
                log.error("Couldn't process record " + record + ". Skipping the record.");
            }
        }
    }

    /**
     * Process a single record.
     *
     * @param record The record to be processed.
     */
    private void processSingleRecord(Record record) {
        // TODO Add your own record processing logic here

//        System.out.println("record : "+ record.getData() );
//        System.out.println("");

        decompress(record.getData());
//        String data = null;
//        try {
//          //   For this app, we interpret the payload as UTF-8 chars.
//            data = decoder.decode(record.getData()).toString();
///     //        Assume this record came from AmazonKinesisSample and log its age.
//            long recordCreateTime = new Long(data.substring("testData-".length()));
//            long ageOfRecordInMillis = System.currentTimeMillis() - recordCreateTime;
//
//            log.info(record.getSequenceNumber() + ", " + record.getPartitionKey() + ", " + data + ", Created "
//                    + ageOfRecordInMillis + " milliseconds ago.");
//        } catch (NumberFormatException e) {
//            log.info("Record does not match sample record format. Ignoring record with data; " + data);
//        } catch (CharacterCodingException e) {
//            log.error("Malformed data: " + data, e);
//        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void shutdown(IRecordProcessorCheckpointer checkpointer, ShutdownReason reason) {
        log.info("Shutting down record processor for shard: " + kinesisShardId);
        // Important to checkpoint after reaching end of shard, so we can start processing data from child shards.
        if (reason == ShutdownReason.TERMINATE) {
            checkpoint(checkpointer);
        }
    }

    /**
     * Checkpoint with retries.
     *
     * @param checkpointer
     */
    private void checkpoint(IRecordProcessorCheckpointer checkpointer) {
        log.info("Checkpointing shard " + kinesisShardId);
        for (int i = 0; i < NUM_RETRIES; i++) {
            try {
                checkpointer.checkpoint();
                break;
            } catch (ShutdownException se) {
                // Ignore checkpoint if the processor instance has been shutdown (fail over).
                log.info("Caught shutdown exception, skipping checkpoint.", se);
                break;
            } catch (ThrottlingException e) {
                // Backoff and re-attempt checkpoint upon transient failures
                if (i >= (NUM_RETRIES - 1)) {
                    log.error("Checkpoint failed after " + (i + 1) + "attempts.", e);
                    break;
                } else {
                    log.info("Transient issue when checkpointing - attempt " + (i + 1) + " of "
                            + NUM_RETRIES, e);
                }
            } catch (InvalidStateException e) {
                // This indicates an issue with the DynamoDB table (check for table, provisioned IOPS).
                log.error("Cannot save checkpoint to the DynamoDB table used by the Amazon Kinesis Client Library.", e);
                break;
            }
            try {
                Thread.sleep(BACKOFF_TIME_IN_MILLIS);
            } catch (InterruptedException e) {
                log.debug("Interrupted sleep", e);
            }
        }
    }
}