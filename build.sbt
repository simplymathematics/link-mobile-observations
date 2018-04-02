import com.github.mmizutani.sbt.gulp.PlayGulpPlugin
import com.typesafe.sbt.packager.docker.{Cmd, ExecCmd}
import sbt.Keys._
import sbt.Path
import PlayGulpPlugin._

name := """link-mobile-observations"""
organization := "com.link"

version := "1.0-SNAPSHOT"

lazy val Root = (project in file("."))
  .enablePlugins(PlayJava, UniversalDeployPlugin, DockerPlugin, SbtWeb)
  .settings(scalacOptions ++= Seq("-deprecation", "-feature", "-Ypartial-unification"))
  .settings(javaOptions in IntegrationTest += "-Dlogger.resource=logback-test.xml")

scalaVersion := "2.12.2"

//scalacOptions += "-Ypartial-unification"

val playPac4jVersion = "4.0.0"
val pac4jVersion = "2.1.0"
val playVersion = "2.6.12"
val akkaVersion = "2.5.11"
libraryDependencies ++= Seq(
  guice,
  ws,
  ehcache,
  "com.datadoghq" % "java-dogstatsd-client" % "2.3",
  "com.amazonaws" % "aws-java-sdk" % "1.11.228",
  "io.swagger" %% "swagger-play2" % "1.6.0",
  "org.mockito" % "mockito-core" % "2.12.0" % "test",
  "org.scalatest" %% "scalatest" % "3.0.4" % "test",
  "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2",
  "com.typesafe.akka" %% "akka-stream" % "2.5.11",
  "com.amazonaws" % "amazon-kinesis-client" % "1.9.0",
  "org.typelevel" %% "cats-core" % "1.0.1",
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % "2.8.11",
  "org.pac4j" % "play-pac4j" % playPac4jVersion,
  "org.pac4j" % "pac4j-oidc" % pac4jVersion exclude("commons-io" , "commons-io"),
  "com.typesafe.play" % "play-cache_2.12" % playVersion,
  "commons-io" % "commons-io" % "2.4",
  "com.typesafe.akka" %% "akka-testkit" % akkaVersion % Test,
  "com.typesafe.akka" %% "akka-stream-testkit" % akkaVersion % Test,
  "com.typesafe.akka" %% "akka-persistence" % akkaVersion,
  "com.typesafe.akka" %% "akka-cluster" % akkaVersion,
  "com.typesafe.akka" %% "akka-cluster-tools" % akkaVersion,
  "com.typesafe.akka" %% "akka-slf4j" % akkaVersion,
  "com.typesafe.akka" %% "akka-persistence" % akkaVersion,
  "com.typesafe.akka" %% "akka-cluster" % akkaVersion,
  "com.typesafe.akka" %% "akka-cluster-sharding" % akkaVersion,
  "com.typesafe.akka" %% "akka-distributed-data" % akkaVersion
)

dockerExposedPorts := Seq(9000)
dockerRepository := Some("028957328603.dkr.ecr.us-east-1.amazonaws.com/intersection")

resolvers ++= Seq(
  "jcenter" at "https://jcenter.bintray.com/",
  "Local mvn repo" at "file:///"+Path.userHome+"/.m2/repository",
  "Typesafe" at "http://repo.typesafe.com/typesafe/releases/",
  "Java.net Maven2 Repository" at "http://download.java.net/maven/2/",
  "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases",
  "maven-central" at "https://mvnrepository.com/artifact/",
  "Splunk Releases" at "http://splunk.artifactoryonline.com/splunk/ext-releases-local"
)

dockerCommands := Seq(
  Cmd("FROM", "openjdk:latest"),

  Cmd("WORKDIR", "/opt/docker"),
  Cmd("ADD", "opt /opt"),

  Cmd("EXPOSE", "9000"),

  Cmd("ADD", "opt/docker/ /app/"),
  Cmd("WORKDIR", "/app"),


  ExecCmd("ENTRYPOINT", "bin/link-mobile-observations", "-Dlogger.resource=logback-prod.xml", "-Djava.security.egd=file:/dev/./urandom")
)

routesGenerator := InjectedRoutesGenerator

PlayGulpPlugin.playGulpSettings ++ PlayGulpPlugin.withTemplates
//unmanagedResourceDirectories in Assets += (gulpDirectory in Compile)(base => base / "app/dist")
unmanagedResourceDirectories in Assets +=  baseDirectory.value / "ui/app/dist"
sourceDirectories in TwirlKeys.compileTemplates in Compile ++= Seq(gulpDirectory.value / "app/src")
