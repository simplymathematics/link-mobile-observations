import { Map, OrderedMap, fromJS } from 'immutable';

export default {
    "data": Map({
        "mappings": fromJS({
            "writtenFiles": {
                "name": "WrittenFileMapping",
                "filterTypes": [],
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
                        "displayName": "Date Generated",
                        "path": "$.writtenAt",
                        "type": "DATE",
                        "searchable": true,
                        "columnWidth": 120
                    },
                    {
                        "displayName": "No. of Records",
                        "path": "$.records.length",
                        "columnWidth": 120
                    },
                    {
                        "displayName": "No. of Pending Records",
                        "path": "$.pendingRecordsCount",
                        "columnWidth": 120
                    },
                    {
                        "displayName": "View Records",
                        "path": "",
                        "columnWidth": 140
                    }
                ]
            },
            "writtenFileRecords": {
                "name": "WrittenFileRecordMapping",
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
                        "searchable": true,
                        "columnWidth": 40,
                        "flexGrow": 2
                    },
                    {
                        "displayName": "RNO",
                        "path": "$.rno",
                        "searchable": true,
                        "columnWidth": 40,
                        "flexGrow": 2
                    },
                    {
                        "displayName": "ONO",
                        "path": "$.ono",
                        "searchable": true,
                        "columnWidth": 40,
                        "flexGrow": 2
                    }
                ]
            }
        }),
        "orders": OrderedMap({
            "/tmp/nfs/vfuk/vfukmnp01/SK201701121108VF005.REQ,EE": {
                "entityId": {
                    "absoluteFilePath": "/tmp/nfs/vfuk/vfukmnp01/SK201701121108VF005.REQ",
                    "targetNetworkOperatorCode": "EE"
                },
                "eventCount": 1,
                "status": "COMPLETED",
                "lastEventAt": "2017-05-31T12:22:31.32+01:00[Europe/London]",
                "writtenAt": "2017-05-31T12:22:31.32+01:00[Europe/London]",
                "fileType": "REQ",
                "pendingRecordsCount": 1,
                "records": [
                    {
                        "transactionNumber": "TRANS1"
                    }
                ]
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