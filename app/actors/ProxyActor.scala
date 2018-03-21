package actors

import javax.inject.Inject

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.event.LoggingReceive
import com.google.inject.Singleton
import models._
import play.api.cache.AsyncCacheApi

import scala.collection.immutable.HashSet
import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._

@Singleton
class ProxyActor @Inject()(cache: AsyncCacheApi)(implicit ec: ExecutionContext) extends Actor with ActorLogging {

  protected[this] var watchers: Map[String, HashSet[ActorRef]] = Map[String, HashSet[ActorRef]]()

  val observations = "observations"

  def receive = LoggingReceive {

    case Ping(_) =>
      watchers.foreach{ w =>
          w._2.foreach{ actor =>
            actor ! Ping(1)
          }
      }
    case UpdateMessage(observation) =>

      cache.get[List[Observation]](observations).flatMap{
        case None =>
          cache.set(observations,List[Observation](observation))
        case Some(list)  =>
          cache.set(observations,  observation :: list)
      }



      val key = s"${observation.ts}-${observation.id.value}"
      cache.set(key, observation)

      watchers.foreach{
        w => println(s"UpdateMessage ${observation.ts}...")
              w._2.foreach{ actor =>
                log.info(s"Actor ${actor}")
                actor ! observation
              }
      }



    case WatchMessageEvents(eventType) =>
      // send the event history to the user
//      sendMessage(Observation(2210, TypeId("1", "UUID"), Location(40, 75, 10)), sender)

      // add the watcher to the list
      val hashmap = watchers.getOrElse(eventType, HashSet.empty)
      watchers = watchers + (eventType -> (hashmap + sender))
      log.info(s"Adding new user to watches ${watchers.size} ")

    case UnwatchMessageEvents() =>
      watchers.foreach { case (_, v) => v - sender }
    case _ =>
  }


  def sendMessage(observation: Observation, v: ActorRef) = {
    v ! observation
  }
}
