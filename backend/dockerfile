FROM openjdk:20
VOLUME tmp
COPY target/*.jar ika-1.0.0.jar
VOLUME 8080:8080
ENTRYPOINT ["java","-jar","/ika-1.0.0.jar"]