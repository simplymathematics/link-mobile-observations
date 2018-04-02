package modules

import com.google.inject.AbstractModule
import play.api.{Configuration, Environment}
import play.api.libs.concurrent.AkkaGuiceSupport
import com.typesafe.config.Config
import org.pac4j.core.authorization.generator.AuthorizationGenerator
import org.pac4j.core.context.WebContext
import org.pac4j.oidc.profile.OidcProfile
//import controllers.SecureHttpActionAdapter
import org.pac4j.core.authorization.authorizer.RequireAnyRoleAuthorizer
import org.pac4j.core.client.Clients
import org.pac4j.oidc.client.OidcClient
import org.pac4j.oidc.config.OidcConfiguration
import org.pac4j.play.CallbackController
import org.pac4j.play.LogoutController
import org.pac4j.play.store.PlayCacheSessionStore
import org.pac4j.play.store.PlaySessionStore


class OktaModule(environment: Environment, configuration: Configuration) extends AbstractModule with AkkaGuiceSupport {

  override def configure() {
    bind(classOf[PlaySessionStore]).to(classOf[PlayCacheSessionStore])

    val oidcConfiguration = new OidcConfiguration()
    oidcConfiguration.setDiscoveryURI(configuration.get[String]("oidc.discoveryUri"))
    oidcConfiguration.setClientId(configuration.get[String]("oidc.clientId"))
    oidcConfiguration.setSecret(configuration.get[String]("oidc.clientSecret"))

    val oidcClient = new OidcClient[OidcProfile](oidcConfiguration)

    val generator = new AuthorizationGenerator[OidcProfile]() {
      override def generate(context: WebContext, profile: OidcProfile): OidcProfile = {
        profile.addRole("ROLE_ADMIN")
        profile
      }
    }

    oidcClient.addAuthorizationGenerator( generator  )


    val baseUrl = configuration.getString("baseUrl")
    val clients = new Clients(baseUrl + "/callback",  oidcClient)

    val  config = new org.pac4j.core.config.Config(clients)
    config.addAuthorizer("admin", new RequireAnyRoleAuthorizer("ROLE_ADMIN"))
//    config.setHttpActionAdapter(new SecureHttpActionAdapter());
    bind(classOf[org.pac4j.core.config.Config]).toInstance(config)

    // callback
    val callbackController = new CallbackController()
    callbackController.setDefaultUrl("/")
    callbackController.setMultiProfile(true)
    bind(classOf[CallbackController]).toInstance(callbackController)

    // logout
    val logoutController = new LogoutController()
    logoutController.setDefaultUrl("/?defaulturlafterlogout")
    bind(classOf[LogoutController]).toInstance(logoutController)


  }
}
