package controllers

import javax.inject.{Inject, Singleton}

import io.swagger.annotations.{Api, ApiResponse, ApiResponses}
import play.api.mvc.InjectedController
import services.HealthCheckService

import scala.concurrent.Future

@Api("/health")
@Singleton
class HealthController @Inject()(healthCheckService: HealthCheckService)
  extends InjectedController {

  @ApiResponses(value = Array(new ApiResponse(code = 200, message = "healthy", response = classOf[String])))
  def health = Action.async {
    val isHealthy = healthCheckService.healthyString
    Future.successful(Ok(isHealthy))
  }

}
