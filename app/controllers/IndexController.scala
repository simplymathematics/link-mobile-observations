package controllers

import cats.data.OptionT
import cats.instances.future._
//import cats.implicits._

import javax.inject.Inject
import models.{Observation, Response}
import models.implicits._
import play.api.Logger
import play.api.cache.AsyncCacheApi
import play.api.libs.json.Json
import play.api.mvc.{InjectedController, Result}

import scala.concurrent.{Await, ExecutionContext, Future}


class IndexController @Inject()(cache: AsyncCacheApi)(implicit ec: ExecutionContext) extends InjectedController {

  val observations = "observations"
  val logger = Logger(getClass)

  def index = Action.async { _ =>
    Future {
      Ok(views.html.index())
    }

  }


  def data(): OptionT[Future, Result] = {
    cache.get[List[Observation]](observations).map(p => println(s"Obs ${p.size}") )
    cache.get[List[(Observation,Int)]]("means").map(p => println(s"Km ${p}") )
    for {
      obs2 <- OptionT(cache.get[List[Observation]](observations))
      means2 <- OptionT(cache.get[List[(Observation, Int)]]("means"))
      res <- OptionT.some( Ok(Json.toJson(Response.build(obs2, means2))))
    } yield {
      println(s" obs ${obs2.size}")
      println(s" k-m ${means2.size}")
      res
    }
  }


//    response.getOrElseF( Future {Ok("no data")})



  def json = Action.async {
    data().getOrElseF( Future {Ok("no data")})
  }


  def list = Action.async {
    val result = for {
      obs2 <- OptionT(cache.get[List[Observation]](observations))
      means2 <- OptionT(cache.get[List[(Observation, Int)]]("means"))
      res <- OptionT.some( Response.build(obs2, means2) )
    } yield Ok(views.html.list(res))

    result.getOrElse(Ok("No data"))
  }




}



