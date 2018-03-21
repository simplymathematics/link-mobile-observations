package controllers

import javax.inject.Inject

import controllers.test.obs
import models.Observations._
import models.{Location, Observation, Response, TypeId}
import play.api.cache.AsyncCacheApi
import play.api.libs.json.Json
import play.api.mvc.InjectedController

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}


class IndexController @Inject()(cache: AsyncCacheApi)(implicit ec: ExecutionContext) extends InjectedController {

  val observations = "observations"

  def index = Action.async { _ =>
    Future {
      Ok(views.html.index())
    }

  }

  private def process(obs: List[Observation], k: Boolean = false): Response = {
    if (k) {
      val means: List[(Observation, Int)] = Try {
        val k = 2
        val clusters: Map[Int, List[Observation]] =
          obs.zipWithIndex.groupBy(
            x => x._2 % k) transform (
            (i: Int, p: List[(Observation, Int)]) => for (x <- p) yield x._1)

        IndexController.iterate(clusters, obs)
      } match {
        case Failure(ex) => ex.printStackTrace(); List[(Observation, Int)]()
        case Success(m) => m
      }
      Response.build(obs, means)
    } else {
      Response.build(obs, List[(Observation, Int)]())
    }

  }


  def json2 = Action.async {
    cache.get[List[Observation]](observations).map {
      case Some(obs) =>
        Ok(Json.toJson(process(obs,true)))
      case None =>
        Ok("No data")
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
        Ok(views.html.list(process(obs)))
      case None =>
        println(s"no data")
        Ok("No data")
    }
  }


}

object IndexController {

  def iterate(clusters: Map[Int, List[Observation]], points: List[Observation]): List[(Observation, Int)] = {
    val unzippedClusters = (clusters: Iterator[(Observation, Int)]) => clusters.map(cluster => cluster._1)

    // find cluster means
    val means =
      (clusters: Map[Int, List[Observation]]) =>
        for (clusterIndex <- clusters.keys)
          yield clusterMean(clusters(clusterIndex))

    // find the closest index
    def closest(p: Observation, means: Iterable[Observation]): Int = {
      val distances = for (center <- means) yield p.dist(center)
      return distances.zipWithIndex.min._2
    }

    // assignment step
    val newClusters: Map[Int, List[Observation]] =
      points.groupBy(
        (p: Observation) => closest(p, means(clusters)))

    render(newClusters)

    newClusters.mapValues(list => (clusterMean(list), list.size)).values.toList
  }

  def clusterMean(points: List[Observation]): Observation = {
    val cumulative = points.reduceLeft((a: Observation, b: Observation) =>
      new Observation(ts = 0, id = TypeId("", ""), location = Location(lon = a.location.lon + b.location.lon, lat = a.location.lat + b.location.lat, horizontal_accuracy = 0)))

    return new Observation(ts = 0, id = TypeId("", ""), location = Location(lon = cumulative.location.lon / points.length, lat = cumulative.location.lat / points.length, horizontal_accuracy = 0))
  }

  def render(points: Map[Int, List[Observation]]) {
    for (clusterNumber <- points.keys.toSeq.sorted) {
      System.out.println("  Cluster " + clusterNumber)

      val meanPoint = clusterMean(points(clusterNumber))
      System.out.println("  Mean: " + meanPoint)

      //      for (j <- 0 to points(clusterNumber).length - 1) {
      //        System.out.println("    " + points(clusterNumber)(j) + ")")
      //      }

      System.out.println("XXXX")
    }
  }

}

object test extends App {
  val k: Int = 2
  val obs = List(Observation(10, TypeId("", ""), Location(0, 0, 0)), Observation(11, TypeId("", ""), Location(10, 10, 0)))
  val clusters: Map[Int, List[Observation]] =
    obs.zipWithIndex.groupBy(
      x => x._2 % k) transform (
      (i: Int, p: List[(Observation, Int)]) => for (x <- p) yield x._1)

  //  System.out.println("Initial State: ")
  //  IndexController.render(clusters)
  IndexController.iterate(clusters, obs)
}