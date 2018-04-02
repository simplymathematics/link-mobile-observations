package actors

import java.net.InetAddress
import java.util.UUID

import akka.Done
import akka.actor.{Actor, ActorLogging, ActorRef, ActorSystem}
import akka.cluster.Cluster
import akka.cluster.ClusterEvent._
import akka.cluster.pubsub.DistributedPubSub
import akka.cluster.pubsub.DistributedPubSubMediator.{Publish, Subscribe, SubscribeAck}
import akka.event.LoggingReceive
import com.google.inject.Singleton
import javax.inject.Inject
import models._
import play.api.cache.AsyncCacheApi

import scala.collection.immutable.HashSet
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ProxyActor @Inject()(cache: AsyncCacheApi, system: ActorSystem)(implicit ec: ExecutionContext) extends Actor with ActorLogging {

  protected[this] var watchers: Map[String, HashSet[ActorRef]] = Map[String, HashSet[ActorRef]]()

  val observations = "observations"
  val uuid = UUID.randomUUID().toString
  log.info(s"Node: ${uuid}")

  val mediator = DistributedPubSub(context.system).mediator
  //Register this actor in the PubSub
  mediator ! Subscribe("observations-data", self)


  implicit val cluster = Cluster(context.system)

  override def preStart(): Unit = {
    //#subscribe
    cluster.subscribe(self, initialStateMode = InitialStateAsEvents,
      classOf[MemberEvent], classOf[UnreachableMember])
    //#subscribe
  }

  override def postStop(): Unit = cluster.unsubscribe(self)

  def receive = LoggingReceive {
    case Mediator(observations) =>
      mediator ! Publish("observations-data", UpdateMessage(observations))
    case Ping(_) =>
      watchers.foreach { w =>
        w._2.foreach { actor =>
          actor ! Ping(1)
        }
      }
    case SnapshotResponse(obs, uuid) =>
      log.info(s"Snapshot Response ${uuid} ${obs.size}")
      cache.get[Set[Observation]](observations).flatMap{
        case Some(obse) => cache.set(observations, obs ++ obse)
        case None => cache.set(observations, obs )
      }
      log.info(s"Snapshot Response updated : ${uuid}")

    case SnapshotRequest(uuid) =>

      for {
        set <- cache.get[Set[Observation]](observations)

      } yield {
        mediator ! Publish("observations-data", SnapshotResponse(set.getOrElse(Set()), uuid))
      }

    //    case Snapshot(uuid) =>
    //      log.info(s"getting snapshot ${uuid}")
    //
    //      val set: Future[Set[Observation]] = cache.get[Set[Observation]](observations).flatMap {
    //        case Some(set) => Future.successful(set)
    //        case _=> Future.successful( Set() )
    //      }


    case message@UpdateMessage(obs) =>

      cache.get[Set[Observation]](observations).flatMap {
        case None =>
          cache.set(observations, obs)
        case Some(set) =>
          cache.set(observations, set ++ obs )
      }

      watchers.foreach {
        w =>
//          log.info(s"UpdateMessage ${observation.ts}...")
          w._2.foreach { actor =>
            log.info(s"Actor ${actor}")
//            actor ! observation
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

    case MemberUp(member) => log.info(s"Member is Up: ${member}")
    case MemberJoined(member) => log.info(s"Member is Joined: ${member}")
    case UnreachableMember(member) => log.info(s"Member detected as unreachable: ${member}")
    case MemberRemoved(member, previousStatus) => log.info(s"Member is Removed: ${member} after ${previousStatus}")
    case SubscribeAck(subs) =>
      import scala.concurrent.duration._
      import scala.language.postfixOps
      system.scheduler.scheduleOnce(10 seconds) {
        mediator ! Publish("observations-data", SnapshotRequest(uuid))
      }
      log.info(s"SubscribeAck ${subs}")
    case default => log.info(s"  Unknown event $default ${default.getClass}")
  }


  def sendMessage(observation: Observation, v: ActorRef) = {
    v ! observation
  }
}

case class Mediator(observations: List[Observation])

case class Snapshot(uuid: String)

case class SnapshotResponse(obs: Set[Observation], uuid: String)

case class SnapshotRequest(node: String)