FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S appuser && adduser -S appuser -G appuser

COPY target/user-service-0.0.1-SNAPSHOT.jar /app.jar

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
