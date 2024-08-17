Remove-Item -Recurse -Force publish

dotnet publish Verbs.Api\Verbs.Api.csproj --output publish -r linux-x64 --self-contained false

# $timestamp = $(get-date -f yyyyMMdd-HHmmss) pause

