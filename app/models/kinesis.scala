package models

case class WatchMessageEvents(eventType: String)

case class UnwatchMessageEvents()

case class UpdateMessageList(observations: List[Observation])
case class UpdateMessage(observations: Observation)

case class Ping(ping: Long)

