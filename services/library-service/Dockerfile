# Build stage: compile and publish the service with the full .NET SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore packages first: this layer stays cached until the .csproj changes
COPY LibraryService.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app --no-restore /p:UseAppHost=false

# Runtime stage: only the ASP.NET Core runtime, much smaller than the SDK
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# The official .NET images listen on port 8080; run as their non-root user
EXPOSE 8080
USER $APP_UID
ENTRYPOINT ["dotnet", "LibraryService.dll"]
