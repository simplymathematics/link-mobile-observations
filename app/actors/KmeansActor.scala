package actors

import akka.actor.{Actor, ActorLogging}
import javax.inject.Inject
import models.{Location, Observation, TypeId}
import play.api.Logger
import play.api.cache.AsyncCacheApi

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success, Try}
import com.google.inject.Singleton


case class CalculateKMeans()

@Singleton
class KmeansActor @Inject()(cache: AsyncCacheApi)(implicit ec: ExecutionContext) extends Actor with ActorLogging {

  override def receive: Receive = {
    case CalculateKMeans() =>
      cache.get[List[Observation]]("observation") map {
        case Some(obs) =>
          val k = KMeans.process(obs)
          cache.set("observation", k)
        case None => log.warning("No observations to calculate")
      }

    case m => log.error(s"Unexpected message ${m}")

  }
}


object KMeans {

  val logger = Logger(getClass)
  def process(obs: List[Observation]) = {
    val means: List[(Observation, Int)] = Try {
      val k = 2
      val clusters: Map[Int, List[Observation]] =
        obs.zipWithIndex.groupBy(
          x => x._2 % k) transform (
          (i: Int, p: List[(Observation, Int)]) => for (x <- p) yield x._1)

      iterate(clusters, obs)

    } match {
      case Failure(ex) => ex.printStackTrace(); List[(Observation, Int)]()
      case Success(m) => m
    }

  }

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
      logger.info("  Cluster " + clusterNumber)

      val meanPoint = clusterMean(points(clusterNumber))
      logger.info("  Mean: " + meanPoint)
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

  KMeans.iterate(clusters, obs)
}