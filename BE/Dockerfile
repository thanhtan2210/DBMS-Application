FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY opentelemetry-javaagent.jar /app/opentelemetry-javaagent.jar
COPY target/*.jar app.jar
# Giới hạn 512MB RAM cho mỗi instance để test khả năng chịu tải của app nhỏ
ENV JAVA_TOOL_OPTIONS="-javaagent:/app/opentelemetry-javaagent.jar"

ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]
