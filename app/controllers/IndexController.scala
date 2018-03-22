package controllers

//import cats.data.OptionT
//import cats.Monad
//import cats.instances.list._
//import cats.syntax.applicative._
//import cats.implicits._

import javax.inject.Inject
import models.{Observation, Response}
import play.api.Logger
import play.api.cache.AsyncCacheApi
import play.api.libs.json.Json
import play.api.mvc.InjectedController

import scala.concurrent.{Await, ExecutionContext, Future}


class IndexController @Inject()(cache: AsyncCacheApi)(implicit ec: ExecutionContext) extends InjectedController {

  val observations = "observations"
  val logger = Logger(getClass)

  def index = Action.async { _ =>
    Future {
      Ok(views.html.index())
    }

  }

  private def process(obs: List[Observation]) = {
    cache.get[List[(Observation, Int)]]("means") map {
      case Some(k) => Response.build(obs, k)
      case None => Response.build(obs, List[(Observation, Int)]())
    }
  }

//  def kk() = {
//    import cats.data.OptionT
//    val response: OptionT[Future, Response] = for {
//      obs <- OptionT(cache.get[List[Observation]](observations))
//      means <- OptionT(cache.get[List[(Observation, Int)]]("means"))
//    } yield Response.build(obs, means)
//    response
//    response.getOrElse( Response.empty).value
//    Json.toJson(response.getOrElse( Response.empty).value)
//  }

//  def json3 = Action.async {
//      kk() match {
//        case Some(o) => Ok(o.)
//      }
//    Future.successful( Ok(kk()) )
//  }

  def json2 = Action.async {
    val init = System.currentTimeMillis()
    cache.get[List[Observation]](observations).map {
      case Some(obs) =>
        Ok(Json.toJson(process(obs))).withHeaders("X-time-consumed" -> (System.currentTimeMillis() - init).toString)
      case None =>
        Ok("No data").withHeaders("X-time-consumed" -> (System.currentTimeMillis() - init).toString)
    }
  }

  def json = Action.async {
    cache.get[List[Observation]](observations).map {
      case Some(obs) =>
        Ok(Json.toJson(process(obs)))
      case None =>
        Ok("No data")
    }
  }

  def list = Action.async { _ =>
    cache.get[List[Observation]](observations).map {
      case Some(obs) =>
        import scala.concurrent.duration._
        val res = Await.result(process(obs), 5 minute)
        Ok(views.html.list(res))

      case None =>
        println(s"no data")
        Ok("No data")
    }
  }


}



