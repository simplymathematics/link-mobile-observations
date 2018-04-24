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

import scala.concurrent.{ExecutionContext, Future}


class IndexController @Inject()(cache: AsyncCacheApi)(implicit ec: ExecutionContext) extends InjectedController {

  val observations = "observations"
  val logger = Logger(getClass)

  def index = Action.async { _ =>
    Future {
      Ok(views.html.index())
    }

  }

  def cleanup() = {
    import scala.concurrent.duration._
    def twoDaysAgo() = System.currentTimeMillis() - 2.days.toMillis

    cache.get[List[Observation]](observations).map {
      case Some(list) =>
        logger.info(s"cleaning up ${list.size}")
        if( list.size > 1000) {
          val cleanedup = list.filter(_.ts > (twoDaysAgo()))
          logger.info(s"cleaning up ${cleanedup.size}")
          cache.set(observations, cleanedup)
        }
      case None => logger.info("ole")
    }

  }

  def data(): OptionT[Future, Result] = {
    for {
      obs2 <- OptionT(cache.get[List[Observation]](observations))
      means2 <- OptionT(cache.get[List[(Observation, Int)]]("means"))
      res <- OptionT.some(Ok(Json.toJson(Response.build(obs2, means2))))
    } yield {
      res
    }
  }


  def json = Action.async {
    data().getOrElseF(Future {
      Ok("no data")
    })
  }


  def list = Action.async {
    val result: OptionT[Future, Result] = for {
      obs2 <- OptionT(cache.get[List[Observation]](observations))
      means2 <- OptionT(cache.get[List[(Observation, Int)]]("means"))
      res <- OptionT.some(Response.build(obs2, means2))
      _ <- OptionT.some( Future(cleanup()))
    } yield Ok(views.html.list(res))


    result.getOrElse(Ok("No data"))
  }

  def filter(id: String) = Action.async {
    val result = for {
      obs2 <- OptionT(cache.get[List[Observation]](observations))
      means2 <- OptionT(cache.get[List[(Observation, Int)]]("means"))
      res <- OptionT.some(Response.build(obs2.filter(_.id.value.contains(id)), means2))
    } yield Ok(views.html.list(res))

    result.getOrElse(Ok("No data"))
  }

  def filterByType(typeId: String) = Action.async {
    val result = for {
      obs2 <- OptionT(cache.get[List[Observation]](observations))
      means2 <- OptionT(cache.get[List[(Observation, Int)]]("means"))
      res <- OptionT.some(Response.build(obs2.filter(_.id.`type`.contains(typeId)), means2))
    } yield Ok(views.html.list(res))

    result.getOrElse(Ok("No data"))
  }


}



