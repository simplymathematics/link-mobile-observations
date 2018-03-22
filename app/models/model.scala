package models

import java.text.SimpleDateFormat
import java.util.Date

import org.apache.commons.lang3.StringUtils
import play.api.libs.functional.syntax.{unlift, _}
import play.api.libs.json.{Format, JsObject, JsPath, Json}

import scala.util.Try

object Observations {

  lazy implicit val typeIdFormat = Json.format[TypeId]
  lazy implicit val locationFormat = Json.format[Location]
  lazy implicit val observationFormat = Json.format[Observation]
  lazy implicit val observationWFormat = Json.format[ObservationWrapper]
  lazy implicit val observationBodyFormat = Json.format[ObservationHolder]
  lazy implicit val pingFormat = Json.format[Ping]
  lazy implicit val responseFormat = Json.format[Response]

  def parse(input: String) = {
    Json.parse(input).as[List[ObservationHolder]]
  }

}

case class TypeId(`type`: String, value: String)

case class Location(lon: Double, lat: Double, horizontal_accuracy: Float)

case class ObservationWrapper(provider_id: String, observation: Observation)

case class Observation(ts: Long, id: TypeId, location: Location) {
  val sdf = new SimpleDateFormat("dd/MM/yy HH:mm:ss")

  def str() = s"${id.`type`}-${id.value}"

  def toDate() = sdf.format(new Date(ts * 1000))

  def t() = id.`type`

  def dist(p: Observation): Double = {
    (location.lon - p.location.lon) * (location.lon - p.location.lon) +
      (location.lat - p.location.lat) * (location.lat - p.location.lat)
  }
}


case class ObservationHolder(ts: Long, body: ObservationWrapper)

case class Response(observations: List[Observation], means: List[(Observation, Int)], total: Long, idAds: Map[String, Int], idAdType: Map[String, Int] = Map())

object Response {
  def empty = Response(List(), List(), 0 , Map())

  def build(list: List[Observation], means: List[(Observation, Int)], k: Boolean = false) = {
    if (k)
      Response(list, means, list.size, list.groupBy(_.id.value).mapValues(_.size), list.groupBy(_.id.`type`).mapValues(_.size))
    else
      Response(list.take(1000), means, list.size, list.groupBy(_.id.value).mapValues(_.size), list.groupBy(_.id.`type`).mapValues(_.size))

  }
}