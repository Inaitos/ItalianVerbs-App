@rem needs keytool -importcert -cacerts -storepass changeit -file {path}\ca.crt
npx openapi-generator-cli generate -i http://localhost:5124/swagger/v1/swagger.yaml -g typescript-angular -o .\verbs
pause

