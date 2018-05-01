package services

import javax.inject.{Inject, Singleton}

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import play.api.{Configuration, Logger}

@Singleton
class HealthCheckService @Inject()(client: AmazonDynamoDBClient, configuration: Configuration) {

  val logger = Logger(getClass)

  def healthyString(): String = {
    configuration.get[String]("healthresponse")
  }
}