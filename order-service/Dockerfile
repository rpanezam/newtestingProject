FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Prevent QEMU deadlock issues on ARM64 hosts during x64 emulation
ENV COMPlus_EnableDiagnostics=0
ENV DOTNET_SYSTEM_NET_HTTP_SOCKETSHTTPHANDLER_HTTP2SUPPORT=false
ENV MSBUILDDISABLENODEREUSE=1

# Copy project file and restore
COPY *.csproj ./
RUN dotnet restore --disable-parallel

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o /app/out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "OrderService.dll"]
