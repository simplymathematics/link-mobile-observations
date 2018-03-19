package controllers

import javax.inject.Inject

import models.Observations._
import models.Observation

import play.api.cache.AsyncCacheApi
import play.api.libs.json.Json
import play.api.mvc.InjectedController

import scala.concurrent.{ExecutionContext, Future}


class IndexController @Inject()(cache: AsyncCacheApi)(implicit ec: ExecutionContext) extends InjectedController {

  val observations = "observations"

  def index = Action.async { _ =>
    Future {
      Ok(views.html.index())
    }

  }

  def json = Action.async {
    cache.get[List[Observation]](observations).map {
      case Some(obs) =>
        println(s"getting data ${obs}")
        Ok( Json.toJson(obs))
      case None =>
        Ok("No data")
    }
  }

  def list = Action.async { _ =>
    //      println(s"getting data ${cache.sync.c}")
    cache.get[List[Observation]](observations).map {
      case Some(obs) =>
        println(s"getting data ${obs}")
        Ok(views.html.list(obs))
      case None =>
        println(s"no data")
        Ok("No data")
    }
  }

}