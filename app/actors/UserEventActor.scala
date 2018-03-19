package actors

import javax.inject._

import akka.actor.Status.Status
import akka.actor._
import akka.event.LoggingReceive
import com.google.inject.assistedinject.Assisted
import models.{Observation, ObservationHolder, Ping, WatchMessageEvents}
import play.api.Configuration
import play.api.libs.concurrent.InjectedActorSupport
import play.api.libs.json.Json

class UserEventActor @Inject()(@Assisted out: ActorRef,
                               @Assisted uri: String,
                               @Named("proxyActor") proxyActor: ActorRef,
                               //@Named("dataSpammerActor") dataSpammerActor: ActorRef,
                               configuration: Configuration) extends Actor with ActorLogging {


  override def preStart(): Unit = {
    super.preStart()
    configureDefaultEventSource()
  }

  def configureDefaultEventSource() = {
    proxyActor ! WatchMessageEvents(uri)
    //dataSpammerActor ! WatchEvents()
  }

  import models.Observations._
  override def receive: Receive = LoggingReceive {
//    case MessageUpdate(message) => out ! message
    case _ : Status => //Akka sending status success. We need to handle receiving it, but don't need to do anything with it.
    case observation: ObservationHolder => out ! Json.toJson(observation)
    case observation: Observation => out ! Json.toJson(observation)
    case p: Ping => out ! Json.toJson(p)
    case default => log.error(s"Invalid message ${default.getClass}")
  }
}

class UserEventFactoryActor @Inject()(childFactory: UserEventActor.Factory) extends Actor with InjectedActorSupport with ActorLogging {
  import UserEventFactoryActor._

  override def receive: Receive = LoggingReceive {
    case Create(id, out, uri) =>
      val child: ActorRef = injectedChild(childFactory(out, uri), s"userActor-$id") //add in uri~?
      sender() ! child
  }
}

object UserEventFactoryActor {
  case class Create(id: String, out: ActorRef, uri: String)
}

object UserEventActor {
  trait Factory {
    // Corresponds to the @Assisted parameters defined in the constructor
    def apply(out: ActorRef, uri: String): Actor
  }
}
