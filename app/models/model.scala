package models

import java.text.SimpleDateFormat
import java.util.Date

import org.apache.commons.lang3.StringUtils
import play.api.libs.functional.syntax.{unlift, _}
import play.api.libs.json.{Format, JsObject, JsPath, Json}

import scala.util.Try

object Observations {

  implicit val typeIdFormat = Json.format[TypeId]
  implicit val locationFormat = Json.format[Location]
  implicit val observationFormat = Json.format[Observation]
  implicit val observationWFormat = Json.format[ObservationWrapper]
  implicit val observationBodyFormat = Json.format[ObservationHolder]
  implicit val pingFormat = Json.format[Ping]

  def parse(input: String) = {
    Json.parse(input).as[List[ObservationHolder]]
  }

}

case class TypeId(`type`: String, value: String)

case class Location(lon: Double, lat: Double, horizontal_accuracy: Float)

case class ObservationWrapper(provider_id: String, observation: Observation)

case class Observation(ts: Long, id: TypeId, location: Location){
  val sdf = new SimpleDateFormat("dd/MM/yy HH:mm:ss")
  def str()= s"${id.`type`}-${id.value}"
  def toDate() =  sdf.format(new Date(ts * 1000))
  def t() = id.`type`
}

case class ObservationHolder(ts: Long, body: ObservationWrapper)

