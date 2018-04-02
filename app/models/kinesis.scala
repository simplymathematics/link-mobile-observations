package models

case class WatchMessageEvents(eventType: String)

case class UnwatchMessageEvents()

case class UpdateMessageList(observations: Set[Observation])
case class UpdateMessage(observations: List[Observation])

case class Ping(ping: Long)

