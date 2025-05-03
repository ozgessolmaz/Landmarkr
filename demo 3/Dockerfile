FROM openjdk:17-jdk-slim


WORKDIR /app
COPY pom.xml ./

COPY src ./src


COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8190
ENTRYPOINT ["java", "-jar", "app.jar"]





