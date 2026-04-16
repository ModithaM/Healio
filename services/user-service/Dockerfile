# Multi-stage build for Spring Boot application
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy parent and module pom.xml files and download dependencies
COPY pom.xml ./pom.xml
COPY services/user-service/pom.xml ./services/user-service/pom.xml
RUN mvn -f services/user-service/pom.xml dependency:go-offline -B

# Copy source code and build
COPY services/user-service/src ./services/user-service/src
RUN mvn -f services/user-service/pom.xml clean package -DskipTests -q

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S appuser && adduser -S appuser -G appuser

# Copy JAR from builder
COPY --from=builder /app/services/user-service/target/*.jar app.jar

# Change ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -q -O- http://localhost:8080/actuator/health || exit 1

# Expose port (dynamic via Eureka)
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
CMD [""]
