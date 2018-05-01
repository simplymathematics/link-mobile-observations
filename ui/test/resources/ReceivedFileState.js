import {Map, OrderedMap, fromJS} from 'immutable';

export default {
    "data": Map({
        "mappings": fromJS({
            "receivedFileRecords": {
                "name": "ReceivedFileRecordMapping",
                "filterTypes": [],
                "mappings": [
                    {
                        "displayName": "MSISDN",
                        "path": "$.msisdn",
                        "searchable": true,
                        "columnWidth": 120
                    },
                    {
                        "displayName": "DNO",
                        "path": "$.dno",
                        "searchable": false,
                        "columnWidth": 40
                    },
                    {
                        "displayName": "RNO",
                        "path": "$.rno",
                        "searchable": true,
                        "columnWidth": 40
                    },
                    {
                        "displayName": "ONO",
                        "path": "$.ono",
                        "searchable": true,
                        "columnWidth": 40
                    },
                    {
                        "displayName": "Error Code",
                        "path": "$.failure.failureCode",
                        "searchable": true,
                        "columnWidth": 120,
                        "flexGrow": 2
                    },
                    {
                        "displayName": "Error Description",
                        "path": "$.failure.failureDescription",
                        "searchable": true,
                        "columnWidth": 180,
                        "flexGrow": 2
                    },
                    {
                        "displayName": "Original Record",
                        "path": "$.originalRecord",
                        "searchable": true,
                        "columnWidth": 100,
                        "flexGrow": 2
                    }
                ]
            },
            "receivedFileFailure": {
                "name": "ReceivedFileFailureMapping",
                "filterTypes": [],
                "mappings": [
                    {
                        "displayName": "Failed At",
                        "path": "$.failedAt",
                        "searchable": true,
                        "columnWidth": 120,
                        "flexGrow": 1
                    },
                    {
                        "displayName": "Failure Code",
                        "path": "$.failureCode",
                        "searchable": true,
                        "columnWidth": 120,
                        "flexGrow": 1
                    },
                    {
                        "displayName": "Failure Description",
                        "path": "$.failureDescription",
                        "searchable": true,
                        "columnWidth": 120,
                        "flexGrow": 1
                    },
                    {
                        "displayName": "Failure Type",
                        "path": "$.failureType",
                        "searchable": true,
                        "columnWidth": 120,
                        "flexGrow": 1
                    }
                ]
            },
            "receivedFiles": {
                "name": "ReceivedFileMapping",
                "filterTypes": [
                    "completed"
                ],
                "mappings": [
                    {
                        "displayName": "Filename",
                        "path": "$.entityId.absoluteFilePath",
                        "searchable": true,
                        "columnWidth": 300,
                        "flexGrow": 2,
                        "isKey": true
                    },
                    {
                        "displayName": "File Type",
                        "path": "$.fileType",
                        "searchable": true,
                        "columnWidth": 60
                    },
                    {
                        "displayName": "Date Received",
                        "path": "$.acceptedAt",
                        "type": "DATE",
                        "searchable": true,
                        "columnWidth": 120
                    },
                    {
                        "displayName": "MNO",
                        "path": "$.sourceNetworkOperator",
                        "searchable": true,
                        "columnWidth": 60
                    },
                    {
                        "displayName": "Status",
                        "path": "$.status",
                        "searchable": true,
                        "columnWidth": 180,
                        "flexGrow": 1
                    },
                    {
                        "displayName": "No. of Records",
                        "path": "$.numberOfRecords",
                        "columnWidth": 120
                    },
                    {
                        "displayName": "No. of Successful Records",
                        "path": "$.successfulRecords.length",
                        "columnWidth": 120
                    },
                    {
                        "displayName": "No. of Failed Records",
                        "path": "$.failedRecords.length",
                        "columnWidth": 120
                    },
                    {
                        "displayName": "View Failures",
                        "path": "",
                        "columnWidth": 140
                    }
                ]
            }
        }),
        "orders": OrderedMap({
            "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1291.RSP": {
                "entityId": {
                    "absoluteFilePath": "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1291.RSP"
                },
                "eventCount": 5,
                "status": "COMPLETED",
                "lastEventAt": "2017-06-01T10:07:30.603+01:00[Europe/London]",
                "acceptedAt": "2017-06-01T10:07:30.541+01:00[Europe/London]",
                "fileHeader": "HDR000001970010100000001CN201601131246SK001.REQCN201601131246SK001.REQ",
                "fileTrailer": "TRL000031970010100000001CN201601131246SK001.REQCN201601131246SK001.REQ",
                "numberOfRecords": 3,
                "fileType": "REQ",
                "sourceNetworkOperator": "CN",
                "successfulRecords": [
                    {
                        "hydraAcknowledgedAt": "2017-06-01T10:07:30.558+01:00[Europe/London]",
                        "responseDate": "20160113124600",
                        "ono": "CN",
                        "rno": "SK",
                        "dno": "CN",
                        "actionStatus": "FF",
                        "actionCode": "01",
                        "transactionNumber": "SK00000004",
                        "msisdn": "447985680896"
                    },
                    {
                        "hydraAcknowledgedAt": "2017-06-01T10:07:30.593+01:00[Europe/London]",
                        "responseDate": "20160113124600",
                        "ono": "CN",
                        "rno": "SK",
                        "dno": "CN",
                        "actionStatus": "FF",
                        "actionCode": "01",
                        "transactionNumber": "SK00000005",
                        "msisdn": "447985680899"
                    }
                ],
                "failedRecords": [
                    {
                        "originalRecord": "CORRUPT LINE",
                        "failure": {
                            "failedAt": "2017-06-01T10:07:30.568+01:00[Europe/London]",
                            "failureCode": "UNEXPECTED_BEHAVIOUR",
                            "failureDescription": "Unknown error. Unable to parse line 'CORRUPT LINE', reason: String index out of range: 24",
                            "failureType": "RECORD_FAILED_PROCESSING_FAILURE"
                        },
                        "ono": "CN",
                        "rno": "SK",
                        "dno": "TEST_UNSEARCHABLE_FIELD_VALUE",
                        "actionStatus": "FF",
                        "actionCode": "01",
                        "transactionNumber": "SK00000006",
                        "msisdn": "447985680876"
                    },
                    {
                        "originalRecord": "MANGOES",
                        "failure": {
                            "failedAt": "2017-06-01T10:07:30.568+01:00[Europe/London]",
                            "failureCode": "UNEXPECTED_BEHAVIOUR",
                            "failureDescription": "Unknown error. Unable to parse line 'MANGOES', reason: String index out of range: 24",
                            "failureType": "RECORD_FAILED_PROCESSING_FAILURE"
                        },
                        "ono": "CN",
                        "rno": "SK",
                        "dno": "TEST_UNSEARCHABLE_FIELD_VALUE",
                        "actionStatus": "FF",
                        "actionCode": "01",
                        "transactionNumber": "SK00000006",
                        "msisdn": "447985680876"
                    }
                ],
                "processedAt": "2017-06-01T10:07:30.603+01:00[Europe/London]"
            },
            "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1288.RSP": {
                "entityId": {
                    "absoluteFilePath": "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1288.RSP"
                },
                "eventCount": 1,
                "status": "REJECTED",
                "lastEventAt": "2017-05-30T11:58:25.61+01:00[Europe/London]",
                "acceptedAt": "2017-05-30T11:58:25.61+01:00[Europe/London]",
                "fileType": "REQ",
                "sourceNetworkOperator": "CN",
                "successfulRecords": [],
                "failedRecords": [],
                "failure": {
                    "failedAt": "2017-05-30T11:58:25.61+01:00[Europe/London]",
                    "failureCode": "INVALID_HEADER",
                    "failureDescription": "The header was malformed. It should start with an 'HDR' block. The actual header found was 'i am not a valid header'",
                    "failureType": "FILE_REJECTED_FAILURE"
                }
            },
            "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1292.RSP": {
                "entityId": {
                    "absoluteFilePath": "/tmp/nfs/vfuk/vfukmnp01/VF201601121246SK1292.RSP"
                },
                "eventCount": 5,
                "status": "COMPLETED",
                "lastEventAt": "2017-06-01T10:07:30.603+01:00[Europe/London]",
                "acceptedAt": "2017-06-01T10:07:30.541+01:00[Europe/London]",
                "fileHeader": "HDR000001970010100000001CN201601131246SK001.REQCN201601131246SK001.REQ",
                "fileTrailer": "TRL000031970010100000001CN201601131246SK001.REQCN201601131246SK001.REQ",
                "numberOfRecords": 3,
                "fileType": "REQ",
                "sourceNetworkOperator": "CN",
                "successfulRecords": [
                    {
                        "hydraAcknowledgedAt": "2017-06-01T10:07:30.558+01:00[Europe/London]",
                        "responseDate": "20160113124600",
                        "ono": "CN",
                        "rno": "SK",
                        "dno": "CN",
                        "actionStatus": "FF",
                        "actionCode": "01",
                        "transactionNumber": "SK00000004",
                        "msisdn": "447985680896"
                    },
                    {
                        "hydraAcknowledgedAt": "2017-06-01T10:07:30.593+01:00[Europe/London]",
                        "responseDate": "20160113124600",
                        "ono": "CN",
                        "rno": "SK",
                        "dno": "CN",
                        "actionStatus": "FF",
                        "actionCode": "01",
                        "transactionNumber": "SK00000005",
                        "msisdn": "447985680899"
                    }
                ],
                "failedRecords": [
                    {
                        "originalRecord": "CORRUPT LINE",
                        "failure": {
                            "failedAt": "2017-06-01T10:07:30.568+01:00[Europe/London]",
                            "failureCode": "UNEXPECTED_BEHAVIOUR",
                            "failureDescription": "Unknown error. Unable to parse line 'CORRUPT LINE', reason: String index out of range: 24",
                            "failureType": "RECORD_FAILED_PROCESSING_FAILURE"
                        },
                        "ono": "CN",
                        "rno": "SK",
                        "dno": "CN",
                        "actionStatus": "FF",
                        "actionCode": "01",
                        "transactionNumber": "SK00000006",
                        "msisdn": "447985680876"
                    }
                ],
                "processedAt": "2017-06-01T10:07:30.603+01:00[Europe/London]"
            }
        }),
        "summaries": Map({})
    }),
    "control": {
        "pageType": "receivedFiles",
        "shouldShowCompleted": false,
        "shouldShowOutstanding": true
    }
}