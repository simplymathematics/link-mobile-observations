package controllers

import com.amazonaws.services.elasticbeanstalk.AWSElasticBeanstalkClientBuilder
import com.amazonaws.services.elasticbeanstalk.model.{ApplicationDescription, CheckDNSAvailabilityRequest, DescribeEnvironmentsRequest}

import scala.collection.JavaConverters._

object Runtime extends App {

 val cnma =AWSConfig.getCName("dev-a-af33a82")
  println(cnma)

}

object AWSConfig {

  private val client = AWSElasticBeanstalkClientBuilder.standard().build()
  private val req = new DescribeEnvironmentsRequest().withApplicationName("link-mobile-observations")
  private val res = client.describeEnvironments(req)

  private val map = res.getEnvironments.asScala.toList
    .foldLeft(Map[String, String]())((m, env) => m + (env.getEnvironmentName -> env.getCNAME))

  def getCName(env: String): String = {
    map.get(env).getOrElse("")
  }
}