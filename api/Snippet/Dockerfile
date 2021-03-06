#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

RUN ln -s /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libdl.so
RUN apt-get update
RUN apt-get install libgdiplus -y && ln -s libgdiplus.so gdiplus.dll

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Snippet/Snippet.csproj", "Snippet/"]
RUN dotnet restore "Snippet/Snippet.csproj"
COPY . .
WORKDIR "/src/Snippet"
RUN dotnet build "Snippet.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Snippet.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
RUN mkdir FileStore
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Snippet.dll"]