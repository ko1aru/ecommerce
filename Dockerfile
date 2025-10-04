# Use official Maven image to build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /ecom-app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use lightweight JDK to run
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /ecom-app
COPY --from=build /ecom-app/target/*.jar ecom-app.jar

# Expose backend port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "ecom-app.jar"]
